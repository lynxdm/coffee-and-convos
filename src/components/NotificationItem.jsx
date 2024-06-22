import React from "react";
import { useGlobalContext } from "../context";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaHeart, FaReply, FaComment } from "react-icons/fa";
import { Link } from "react-router-dom";

function NotificationItem({
  articleId,
  commentId,
  content,
  reply,
  timestamp,
  type,
  articleTitle,
  articleLink,
  comment,
  currentUser,
}) {
  const { timeAgo } = useGlobalContext();
  if (currentUser) {
    const { displayName, photoURL } = currentUser;

    if (type === "like") {
      return (
        <li className='items-startq flex min-h-[5rem] gap-4 rounded-2xl border bg-white p-4 shadow-sm'>
          <div className='relative'>
            <img
              src={photoURL}
              alt={displayName + "profile picture"}
              className='size-12 rounded-full'
            />
            <FaHeart className='absolute right-0 top-0 size-6 translate-x-[25%] text-red-500' />
          </div>
          <div className='flex w-full flex-col gap-1'>
            <div className='justify flex justify-between'>
              <h3>
                <span className='font-semibold'>{displayName}</span> liked your{" "}
                <span className='font-semibold'>comment</span>:
              </h3>
              <p>{timeAgo(timestamp)}</p>
            </div>
            <Link to={articleLink}>
              <p className='border-l-4 pl-4 italic first-letter:capitalize'>
                {content}
              </p>
            </Link>
          </div>
        </li>
      );
    }

    if (type === "reply") {
      return (
        <li className='items-startq flex min-h-[5rem] gap-4 rounded-2xl border bg-white p-4 shadow-sm'>
          <div className='relative'>
            <img
              src={photoURL}
              alt={displayName + "profile picture"}
              className='size-12 rounded-full'
            />
            <FaReply className='absolute right-0 top-0 size-6 translate-x-[25%] text-purple-500' />
          </div>
          <div className='flex w-full flex-col gap-2'>
            <div className='justify flex justify-between'>
              <h3>
                <span className='font-semibold'>{displayName}</span> replied to
                your <span className='font-semibold'>comment</span>:
              </h3>
              <p>{timeAgo(timestamp)}</p>
            </div>
            <Link to={articleLink}>
              <p className='border-l-4 pl-4 italic first-letter:capitalize'>
                {content}
              </p>
            </Link>
            <p className='font-semibold first-letter:capitalize'>
              "{reply.content}"
            </p>
          </div>
        </li>
      );
    }

    if (type === "new_comment") {
      return (
        <li className='items-startq flex min-h-[5rem] gap-4 rounded-2xl border bg-white p-4 shadow-sm'>
          <div className='relative'>
            <img
              src={photoURL}
              alt={displayName + "profile picture"}
              className='size-12 rounded-full'
            />
            <FaComment className='absolute right-0 top-0 size-6 translate-x-[25%] text-blue-300' />
          </div>
          <div className='flex w-full flex-col gap-2'>
            <div className='justify flex justify-between'>
              <h3>
                <span className='font-semibold'>{displayName}</span> commented
                on your <span className=''>article</span>:{" "}
                <span className='line-clamp-1 font-bold'>
                  {articleTitle ||
                    "from mind to growth simplifying the writing journey"}
                </span>
              </h3>
              <p>{timeAgo(timestamp)}</p>
            </div>
            <Link to={`${articleLink}#${comment.id || "comment_section"}`}>
              <p className='border-l-4 pl-4 italic first-letter:capitalize'>
                {comment.content}
              </p>
            </Link>
          </div>
        </li>
      );
    }
  }
}

export default NotificationItem;
