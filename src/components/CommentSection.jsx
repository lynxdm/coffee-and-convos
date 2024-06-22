import React, { useRef, useState, useEffect } from "react";
import { db } from "../Utilis/firebase";
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
import useNotification from "../Hooks/useNotification";

function CommentSection({ articleId, articleLink, articleTitle }) {
  const { user, getCurrentDate } = useGlobalContext();
  const { sendAdminNotification } = useNotification();
  const [comments, setComments] = useState(null);
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

  return (
    <section
      className='mx-auto mt-8 max-w-[60rem] border-t pt-10'
      id='comment_section'
    >
      <h2 className='text-center text-2xl font-bold'>Comments</h2>
      <div className='mt-7 flex items-start gap-3'>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.dispalyName + " display photo"}
            className='size-8 rounded-full'
          />
        ) : (
          <FaUserCircle className='size-8' />
        )}
        <form className='w-full' onSubmit={addComment}>
          <textarea
            name='newComment'
            id='newComment'
            ref={newCommentRef}
            placeholder='What are you thinking?'
            className='peer h-[30rem] w-full resize-none overflow-hidden rounded-md border-2 border-gray-600 p-2 focus:outline-none'
            value={newComment}
            onChange={handleChange}
          />
          {newComment.length > 0 && (
            <div className='transition-[height 1ms ease] mt-1 flex gap-3'>
              {isLoading ? (
                <div className='flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white'>
                  <ScaleLoader
                    color='rgba(256, 256, 256, 1)'
                    height={12}
                    radius={5}
                    width={2}
                  />
                  <p>Posting...</p>
                </div>
              ) : (
                <button
                  className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-500'
                  type='submit'
                >
                  Post
                </button>
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
