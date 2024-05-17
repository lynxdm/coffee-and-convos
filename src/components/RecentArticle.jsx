import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

function RecentArticle({ article }) {
  const [content, setContent] = useState("");
  const { fetchArticleContent, convertDate } = useGlobalContext();

  useEffect(() => {
    fetchArticleContent(article.id).then((result) => {
      setContent(result);
    });
  }, []);

  if (content) {
    return (
      <section className='relative flex gap-12 items-center after:absolute after:bottom-0 after:left-[50%] after:border-b-2 after:border-primary after:w-[10%] after:translate-x-[-50%] pb-10'>
        <div className='w-[55%]'>
          <h2 className='text-[3.5rem] leading-tight font-semibold'>
            {article.title}
          </h2>
          <p className='text-sm'>{convertDate(article.date)}</p>
        </div>
        <div className='w-[45%] flex flex-col'>
          <ReactMarkdown
            children={content}
            className='line-clamp-6 leading-loose'
          />
          <Link
            to={`/${article.id}`}
            className='flex gap-2 w-fit items-center self-end'
          >
            <p className='font-semibold'>Read</p>
            <HiOutlineArrowNarrowRight className='size-5' />
          </Link>
        </div>
      </section>
    );
  }
}

export default RecentArticle;
