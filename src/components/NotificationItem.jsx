import React, { useState } from "react";
import { useGlobalContext } from "../context";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaHeart, FaReply, FaComment } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";

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
  const { timeAgo, admin } = useGlobalContext();
  const [imageError, setImageError] = useState(false);
  if (currentUser) {
    const { displayName, photoURL, email } = currentUser;

    const config = genConfig(email);

    if (type === "like") {
      return (
        <Link to={`/blog${articleLink}`}>
          <li className='flex min-h-[5rem] items-start gap-4 border bg-white p-2 shadow-sm dark:border-[#3a3a3a] dark:bg-[#262626] md:p-4 lg:rounded-2xl'>
            <div className='relative'>
              {!imageError ? (
                <img
                  src={photoURL}
                  alt={displayName + "profile picture"}
                  className='size-8 rounded-full lg:size-12'
                  onError={() => setImageError(true)}
                />
              ) : (
                <ReactNiceAvatar className='size-8 lg:size-12' {...config} />
              )}
              <FaHeart className='absolute right-0 top-0 size-5 translate-x-[25%] text-red-500 lg:size-6' />
            </div>
            <div className='flex flex-col gap-1 md:w-full'>
              <div className='justify flex items-center justify-between gap-6 text-[0.9rem] lg:text-[1rem]'>
                <h3>
                  <span className='font-semibold'>
                    {displayName}{" "}
                    {email === admin.email && (
                      <HiBadgeCheck className='inline size-4' title='Author' />
                    )}
                  </span>{" "}
                  liked your <span className='font-semibold'>comment</span>:
                </h3>
                <p className='text-xs lg:text-base'>
                  {timeAgo(timestamp, true)}
                </p>
              </div>
              <p className='border-l-4 pl-4 italic first-letter:capitalize'>
                {content}
              </p>
            </div>
          </li>
        </Link>
      );
    }

    if (type === "reply") {
      return (
        <Link to={`/blog${articleLink}`}>
          <li className='flex min-h-[5rem] items-start gap-4 border bg-white p-2 shadow-sm dark:border-[#3a3a3a] dark:bg-[#262626] md:p-4 lg:rounded-2xl'>
            <div className='relative'>
              {!imageError ? (
                <img
                  src={photoURL}
                  alt={displayName + "profile picture"}
                  className='size-8 rounded-full lg:size-12'
                  onError={() => setImageError(true)}
                />
              ) : (
                <ReactNiceAvatar className='size-8 lg:size-12' {...config} />
              )}
              <FaReply className='absolute right-0 top-0 size-5 translate-x-[25%] text-purple-500 lg:size-6' />
            </div>
            <div className='flex flex-col gap-2 md:w-full'>
              <div className='justify flex items-center justify-between gap-4 text-sm lg:text-base'>
                <h3>
                  <span className='font-semibold'>
                    {displayName}{" "}
                    {email === admin.email && (
                      <HiBadgeCheck className='inline size-4' title='Author' />
                    )}
                  </span>
                  {"  "}
                  replied to your <span className='font-semibold'>comment</span>
                  :
                </h3>
                <p className='text-xs lg:text-base'>
                  {timeAgo(timestamp, true)}
                </p>
              </div>
              <Link to={`/articles${articleLink}`}>
                <p className='border-l-4 pl-4 italic first-letter:capitalize'>
                  {content}
                </p>
              </Link>
              <p className='font-semibold first-letter:capitalize'>
                "{reply.content}"
              </p>
            </div>
          </li>
        </Link>
      );
    }

    if (type === "new_comment") {
      return (
        <Link to={`/blog${articleLink}`}>
          <li className='items-startq flex min-h-[5rem] gap-4 border bg-white dark:bg-[#262626] dark:border-[#3a3a3a] p-2 shadow-sm md:p-4 lg:rounded-2xl'>
            <div className='relative'>
              {!imageError ? (
                <img
                  src={photoURL}
                  alt={displayName + "profile picture"}
                  className='size-8 rounded-full lg:size-12'
                  onError={() => setImageError(true)}
                />
              ) : (
                <ReactNiceAvatar className='size-8 lg:size-12' {...config} />
              )}
              <FaComment className='absolute right-0 top-0 size-5 translate-x-[25%] text-blue-300 lg:size-6' />
            </div>
            <div className='flex flex-col gap-4 md:w-full'>
              <div className='justify flex gap-2 text-sm md:justify-between lg:text-base'>
                <h3>
                  <span className='font-semibold'>{displayName}</span> commented
                  on:
                  {/* your <span className=''>article</span>:{" "} */}
                  <span className='line-clamp-1 text-xs font-bold md:text-sm lg:text-base'>
                    {articleTitle ||
                      "from mind to growth simplifying the writing journey"}
                  </span>
                </h3>
                <p className='text-xs lg:text-base'>
                  {timeAgo(timestamp, true)}
                </p>
              </div>
              <Link to={`/articles${articleLink}`}>
                <p className='border-l-4 pl-4 italic first-letter:capitalize'>
                  {comment.content}
                </p>
              </Link>
            </div>
          </li>
        </Link>
      );
    }
  }
}

export default NotificationItem;
