import React, { useRef, useState, useEffect } from "react";
import { db } from "../utilis/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useGlobalContext } from "../context";
import { FaUserCircle } from "react-icons/fa";
import CommentItem from "./CommentItem";
import { v4 } from "uuid";
import { ScaleLoader } from "react-spinners";
import useNotification from "../hooks/useNotification";
import { Link } from "react-router-dom";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";

function CommentSection({ articleId, articleLink, articleTitle }) {
  const { user, getCurrentDate } = useGlobalContext();
  const { sendAdminNotification } = useNotification();
  const [comments, setComments] = useState(null);
  const [imageError, setImageError] = useState(false)
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  const getComments = async () => {
    const commentsRef = collection(db, "articles", articleId, "comments");
    const snapshot = await getDocs(commentsRef);

    let commentsArr = [];
    snapshot.docs.forEach((doc) =>
      commentsArr.push({
        ...doc.data(),
        id: doc.id,
      }),
    );
    setComments(
      commentsArr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    );
  };

  useEffect(() => {
    getComments();
  }, []);

  const newCommentRef = useRef(null);
  useEffect(() => {
    newCommentRef.current.style.height = "70px";
    const scrollHeight = newCommentRef.current.scrollHeight;
    newCommentRef.current.style.height = scrollHeight + "px";
  }, [newCommentRef, newComment]);

  const addComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (newComment) {
      const commentsRef = collection(db, "articles", articleId, "comments");
      const commentData = {
        content: newComment,
        likes: [],
        replies: [],
        timestamp: new Date().toISOString(),
        user,
      };

      await addDoc(commentsRef, commentData);
      getComments();
      sendAdminNotification(
        "new_comment",
        commentData,
        articleId,
        user,
        articleLink,
        articleTitle,
      );
      setIsLoading(false);
      setNewComment("");
    }
  };

  const config = genConfig(user.email);

  return (
    <section
      className='mx-auto mt-8 max-w-[60rem] border-t px-3 pt-10 dark:border-darkSecondary md:px-8'
      id='comment_section'
    >
      <h2 className='text-center text-2xl md:text-3xl font-kreon font-bold lg:text-4xl'>Comments</h2>
      <div className='mt-7 flex items-start gap-3'>
        {user.photoURL ? (
          !imageError ? (
            <img
              src={user.photoURL}
              alt={user.dispalyName + " display photo"}
              className='size-8 rounded-full'
              onError={() => setImageError(true)}
            />
          ) : (
            <ReactNiceAvatar className='size-8' {...config} />
          )
        ) : (
          <FaUserCircle className='size-8' />
        )}
        <form className='w-full' onSubmit={addComment}>
          <textarea
            name='newComment'
            id='newComment'
            ref={newCommentRef}
            placeholder='What are you thinking?'
            className='peer h-[30rem] w-full resize-none overflow-hidden rounded-md border-2 border-[#3e3b3b] p-2 focus:outline-none dark:bg-[#101011] dark:placeholder:text-[#61626d]'
            value={newComment}
            onChange={handleChange}
          />
          {newComment.length > 0 && (
            <div className='transition-[height 1ms ease] mt-1 flex gap-3'>
              {isLoading ? (
                <div className='flex items-center gap-2 rounded-md bg-[#3e3b3b] px-4 py-2 text-white'>
                  <ScaleLoader
                    color='rgba(256, 256, 256, 1)'
                    height={12}
                    radius={5}
                    width={2}
                  />
                  <p>Posting...</p>
                </div>
              ) : user.email ? (
                <button
                  className='rounded-md bg-[#3e3b3b] px-4 py-2 text-white hover:bg-[#343432]'
                  type='submit'
                >
                  Post
                </button>
              ) : (
                <Link
                  to={"/login"}
                  className='rounded-md bg-[#3e3b3b] px-4 py-2 text-white hover:bg-[#343432]'
                >
                  Login to post
                </Link>
              )}
              <button
                className='rounded-md px-4 py-2 hover:bg-gray-200'
                type='button'
                onClick={() => setNewComment("")}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
      <ul className='mt-6 flex w-full flex-col gap-4'>
        {comments?.map((comment) => {
          return (
            <CommentItem
              {...comment}
              getComments={getComments}
              articleId={articleId}
              id={comment.id}
              comment={comment}
              key={comment.id}
              parentId={comment.id}
              articleLink={articleLink}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default CommentSection;
