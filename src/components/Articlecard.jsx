import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

function Articlecard({ title, cover, date, id, type }) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { fetchArticleContent, timeAgo, formatLink } = useGlobalContext();

  useEffect(() => {
    fetchArticleContent(id, type).then((result) => {
      setContent(result);
    });
  }, []);

  const handleEditing = () => {
    let articleDraft = {
      coverImg: cover.image,
      title: title,
      content: content,
      details: { type: "drafts", id: id },
    };

    localStorage.setItem("articleDraft", JSON.stringify(articleDraft));
    navigate("/new");
  };

  if (content) {
    return (
      <ul className='border border-primary py-3 dark:border-[#3a3a3a]' key={id}>
        <li className='dark:border-[#3a3a3a] dark:text-darkSecondary flex items-center justify-between border-b border-primary px-2 pb-2'>
          <p className='text-sm capitalize'>{timeAgo(date)}</p>
          {type === "articles" ? (
            <Link
              to={`/blog/${formatLink(title)}-${id}`}
              className='flex w-fit items-center gap-1 self-end lg:gap-2'
            >
              <p className='lg:text-md text-sm font-semibold'>Read</p>
              <HiOutlineArrowNarrowRight className='lg:size-5' />
            </Link>
          ) : (
            <button
              className='flex w-fit items-center gap-2 self-end'
              onClick={handleEditing}
            >
              <p className='font-semibold'>Edit</p>
              <HiOutlineArrowNarrowRight className='size-5' />
            </button>
          )}
        </li>
        <li className='px-3 py-4 md:min-h-24 lg:min-h-28 lg:px-5'>
          <h3 className='text-2xl font-bold lg:font-semibold xl:text-4xl'>
            {title}
          </h3>
        </li>
        <li className='border-y border-primary dark:border-[#3a3a3a]'>
          <img
            className='aspect-[16/7] object-cover object-center md:aspect-[16/5] lg:aspect-[16/3.5]'
            src={cover.image}
            alt={cover.alt}
          />
        </li>
        <li className='mt-6 px-2'>
          <ReactMarkdown
            children={content}
            className='prose line-clamp-3 leading-loose prose-headings:hidden prose-p:my-0 prose-img:hidden dark:text-darkSecondary lg:line-clamp-4'
          />
        </li>
      </ul>
    );
  }
}

export default Articlecard;
