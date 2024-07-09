import React, { useRef, useState, useEffect } from "react";
import {
  FaUserCircle,
  FaRegHeart,
  FaHeart,
  FaRegComment,
} from "react-icons/fa";
import { HiOutlineDotsHorizontal, HiBadgeCheck } from "react-icons/hi";
import { useGlobalContext } from "../context";
import { v4 as uuidv4 } from "uuid";
import { db } from "../utilis/firebase";
import { updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import useMenu from "../hooks/useMenu";
import CommentText from "./CommentText";
import Warningmodal from "./Warningmodal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";

function CommentItem({
  user: { displayName, photoURL, email },
  timestamp,
  content,
  replies,
  comment,
  likes,
  getComments,
  articleId,
  parentId = null,
  articleLink,
  id,
}) {
  const navigate = useNavigate();
  const { user, timeAgo, admin, isAdmin } = useGlobalContext();
  const { sendNotification } = useNotification();
  const [newReply, setNewReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReplyFolded, setIsReplyFolded] = useState(true);
  const [likesCount, setLikesCount] = useState(likes.length);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const manageCommentBtn = useRef(null);
  const manageCommentMenu = useRef(null);

  const [ isMenuOpen, setIsMenuOpen ] = useMenu(
    manageCommentBtn,
    manageCommentMenu,
  );

  useEffect(() => {
    likes.forEach((like) => {
      if (like.email === user.email) {
        setIsLiked(true);
      }
    });
    setLikesCount(likes.length);
  }, []);

  const handleChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleEditText = (e) => {
    setEditText(e.target.value);
  };

  const addLike = async () => {
    // Add like functionality
    const addLikeRecursively = (replies, commentLikes, parentReplyId) => {
      if (parentId === id) return [...commentLikes, { ...user }];
      return replies.map((reply) => {
        if (reply.id === parentReplyId)
          return { ...reply, likes: [...reply.likes, { ...user }] };
        return {
          ...reply,
          replies: addLikeRecursively(
            reply.replies,
            commentLikes,
            parentReplyId,
          ),
        };
      });
    };

    const commentRef = doc(db, "articles", articleId, "comments", parentId);
    const commentDoc = await getDoc(commentRef);
    const currentComment = commentDoc.data();

    const updatedComments = addLikeRecursively(
      currentComment.replies,
      currentComment.likes,
      id,
    );

    if (parentId === id) {
      await updateDoc(commentRef, { likes: updatedComments });
    } else {
      await updateDoc(commentRef, { replies: updatedComments });
    }

    setIsLiked(true);
    sendNotification("like", comment, articleId, user, false, articleLink);
    setLikesCount(likesCount + 1);
    getComments();
  };

  const removeLike = async () => {
    const commentRef = doc(db, "articles", articleId, "comments", parentId);
    const commentDoc = await getDoc(commentRef);
    const currentComment = commentDoc.data();
    const filteredLikes = likes.filter((like) => like.email !== user.email);

    if (parentId === id) {
      await updateDoc(commentRef, { likes: filteredLikes });
      getComments();
      setIsLiked(false);
      setLikesCount(likesCount - 1);
      return;
    }

    const checkReplies = (replies, replyId) => {
      return replies.map((reply) => {
        if (reply.id === replyId) return { ...reply, likes: filteredLikes };
        return {
          ...reply,
          replies: checkReplies(reply.replies, replyId),
        };
      });
    };

    const updatedLikes = checkReplies(currentComment.replies, id);
    await updateDoc(commentRef, { replies: updatedLikes });

    getComments();
    setLikesCount(likesCount - 1);
    setIsLiked(false);
  };

  const addReply = async (e) => {
    e.preventDefault();
    if (newReply) {
      setIsLoading(true);
      const replyData = {
        content: newReply,
        likes: [],
        replies: [],
        timestamp: new Date().toISOString(),
        user,
        id: uuidv4(),
      };

      const addReplyRecursively = (replies, parentReplyId) => {
        if (parentId === id) return [replyData, ...replies];
        return replies.map((reply) => {
          if (reply.id === parentReplyId) {
            return { ...reply, replies: [replyData, ...reply.replies] };
          }
          return {
            ...reply,
            replies: addReplyRecursively(reply.replies, parentReplyId),
          };
        });
      };

      const commentRef = doc(db, "articles", articleId, "comments", parentId);

      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.log(parentId);
        console.error("No such document!");
        return;
      }

      const currentComment = commentDoc.data();

      const updatedReplies = addReplyRecursively(currentComment.replies, id);

      await updateDoc(commentRef, {
        replies: updatedReplies,
      });

      sendNotification(
        "reply",
        comment,
        articleId,
        user,
        replyData,
        articleLink,
      );

      setIsLoading(false);
      setIsReplyOpen(false);
      setNewReply("");
      getComments();
      setIsReplyFolded(false);
    }
  };

  const editComment = async (e) => {
    e.preventDefault();
    if (editText) {
      setIsLoading(true);
      const updateContentRecursively = (
        repliesArray,
        commentId,
        newContent,
      ) => {
        return repliesArray.map((reply) => {
          if (reply.id === commentId) {
            return {
              ...reply,
              content: newContent,
              edited: true,
            };
          }
          return {
            ...reply,
            replies: updateContentRecursively(
              reply.replies,
              commentId,
              newContent,
            ),
          };
        });
      };

      const commentRef = doc(db, "articles", articleId, "comments", parentId);

      const commentDoc = await getDoc(commentRef);

      const currentComment = commentDoc.data();

      const updatedReplies = updateContentRecursively(
        currentComment.replies,
        id,
        editText,
      );

      if (parentId === id) {
        await updateDoc(commentRef, {
          content: editText,
          edited: true,
        });
      } else {
        await updateDoc(commentRef, {
          replies: updatedReplies,
        });
      }

      setIsLoading(false);
      getComments();
      setIsEditing(false);
      setEditText("");
    }
  };

  const deleteComment = async () => {
    const deleteCommentRecursively = (repliesArray, commentId) => {
      return repliesArray
        .filter((reply) => reply.id !== commentId)
        .map((reply) => {
          return {
            ...reply,
            replies: deleteCommentRecursively(reply.replies, commentId),
          };
        });
    };

    const commentRef = doc(db, "articles", articleId, "comments", parentId);

    const commentDoc = await getDoc(commentRef);

    const currentComment = commentDoc.data();

    if (parentId === id) {
      await deleteDoc(commentRef);
      getComments();
      return;
    }
    const updatedReplies = deleteCommentRecursively(currentComment.replies, id);
    await updateDoc(commentRef, {
      replies: updatedReplies,
    });

    getComments();
    setIsDeleteModalOpen(false);
  };

  const config = genConfig(email);

  return (
    <li id={id}>
      <div className='flex items-start gap-3'>
        {photoURL ? (
          !imageError ? (
            <img
              src={photoURL}
              alt={displayName + " display photo"}
              className='size-8 rounded-full'
              onError={() => setImageError(true)}
            />
          ) : (
            <ReactNiceAvatar className='size-8' {...config} />
          )
        ) : (
          <FaUserCircle className='size-8' />
        )}
        <div className='w-full rounded-md border border-gray-300 p-2 dark:border-[#3a3a3a]'>
          <div className='flex w-full justify-between'>
            <div className='mb-2 font-kurale flex items-center gap-2 text-[0.9rem] text-gray-600 dark:text-darkSecondary'>
              <p className='font-bold'>
                {displayName}{" "}
                {email === admin.email && (
                  <HiBadgeCheck className='inline size-4' title='Author' />
                )}
              </p>
              <span>•</span>
              <p className='text-sm'>{timeAgo(timestamp, true)}</p>
              {comment.edited && (
                <>
                  <span>•</span>
                  <p className='font-semibold italic'>Edited</p>
                </>
              )}
            </div>
            {(email === user.email || isAdmin) && (
              <div className='relative'>
                <button
                  type='button'
                  className='grid size-6 place-items-center rounded-md hover:bg-gray-200 dark:hover:bg-[#262626]'
                  ref={manageCommentBtn}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <HiOutlineDotsHorizontal />
                </button>
                {isMenuOpen && (
                  <div
                    className='absolute right-0 top-[110%] z-20 flex w-[12rem] flex-col gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg *:rounded *:px-2 *:text-left *:text-sm dark:border-[#3a3a3a] dark:bg-darkBg'
                    ref={manageCommentMenu}
                  >
                    {email === user.email && (
                      <>
                        <button
                          className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Comment
                        </button>
                        {/* <div className='h-0 border-t dark:border-[#262626] py-0'></div> */}
                      </>
                    )}
                    <button
                      className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete Comment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className='text-lg'>{content}</p>
        </div>
      </div>
      {!isReplyOpen && !isEditing && (
        <div className='flex items-center justify-between'>
          <div className='ml-12 mt-3 flex gap-2 *:flex *:items-start *:gap-2 *:rounded *:px-3 *:py-1.5'>
            <button
              className={`${isLiked ? "bg-[#d71c1c18]" : "hover:bg-gray-100 dark:hover:bg-[#262626]"}`}
              onClick={() => {
                if (!user.email) {
                  toast.custom((t) => (
                    <div className='flex items-center gap-20 rounded-md p-5 py-3 text-[0.8rem] font-semibold shadow-md'>
                      <p className=''>Login to interact with comment</p>
                      <button
                        className='rounded-md bg-primary px-2 py-1 font-medium text-white'
                        onClick={() => {
                          navigate("/login");
                          toast.dismiss(t);
                        }}
                      >
                        Login
                      </button>
                    </div>
                  ));
                  return;
                }
                if (!isLiked) {
                  addLike();
                  return;
                }
                removeLike();
              }}
            >
              {isLiked ? <FaHeart className='text-red-600' /> : <FaRegHeart />}{" "}
              <p className='text-sm'>
                <span>{likesCount > 0 ? likesCount : ""} </span>
                <span className='hidden lg:inline-block'>
                  {likesCount > 1 ? "likes" : "like"}
                </span>
              </p>
            </button>
            <button
              onClick={() => {
                if (!user.email) {
                  toast.custom((t) => (
                    <div className='flex items-center gap-20 rounded-md p-5 py-3 text-[0.8rem] font-semibold shadow-md'>
                      <p className=''>Login to interact with comment</p>
                      <button
                        className='rounded-md bg-primary px-2 py-1 font-medium text-white'
                        onClick={() => {
                          navigate("/login");
                          toast.dismiss(t);
                        }}
                      >
                        Login
                      </button>
                    </div>
                  ));
                  return;
                }
                setIsReplyOpen(true);
              }}
              className='hover:bg-gray-100 dark:hover:bg-[#262626]'
            >
              <FaRegComment /> <p className='hidden text-sm lg:block'>Reply</p>
            </button>
          </div>
          {replies.length > 0 && (
            <button
              className='text-sm font-semibold italic text-gray-500'
              onClick={() => setIsReplyFolded(!isReplyFolded)}
            >
              {isReplyFolded ? (
                <p>
                  Show <span>{replies.length}</span>{" "}
                  {replies.length > 1 ? "replies" : "reply"}
                </p>
              ) : (
                <p>Hide replies</p>
              )}
            </button>
          )}
        </div>
      )}
      {isEditing && (
        <CommentText
          onSubmit={editComment}
          text={editText}
          setText={setEditText}
          handleChange={handleEditText}
          submitText={"Edit"}
          loadingText={"Editing..."}
          isLoading={isLoading}
          setIsTextOpen={setIsEditing}
          placeholder={"New comment..."}
        />
      )}
      {isReplyOpen && (
        <CommentText
          onSubmit={addReply}
          text={newReply}
          setText={setNewReply}
          handleChange={handleChange}
          submitText={"Reply"}
          loadingText={"Replying..."}
          isLoading={isLoading}
          setIsTextOpen={setIsReplyOpen}
          placeholder={"Your reply..."}
        />
      )}
      {replies.length > 0 && !isReplyFolded && (
        <ul className='mb-1 ml-auto mt-6 flex w-[95%] flex-col gap-2.5'>
          {replies.map((reply) => {
            return (
              <CommentItem
                {...reply}
                comment={reply}
                key={reply.id}
                articleId={articleId}
                parentId={parentId}
                getComments={getComments}
              />
            );
          })}
        </ul>
      )}
      {isDeleteModalOpen && (
        <Warningmodal
          deleteaction={deleteComment}
          delBtn={"Delete"}
          setIsModalWarningOpen={setIsDeleteModalOpen}
          content={"Are you sure you want to delete your comment?"}
          header={"You're about to delete a comment"}
          backBtn={"Cancel"}
        />
      )}
    </li>
  );
}

export default CommentItem;
