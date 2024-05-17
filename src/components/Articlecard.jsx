import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

function Articlecard({ title, cover, date, id }) {
  const [content, setContent] = useState("");
  const { fetchArticleContent, convertDate } = useGlobalContext();

  useEffect(() => {
    fetchArticleContent(id).then((result) => {
      setContent(result);
    });
  }, []);

  if (content) {
    return (
      <ul className='border border-primary py-3' key={id}>
        <li className='px-2 flex justify-between border-b border-primary pb-2 items-center'>
          <p className='text-sm'>{convertDate(date)}</p>
          <Link
            to={`/${id}`}
            className='flex gap-2 w-fit items-center self-end'
          >
            <p className='font-semibold'>Read</p>
            <HiOutlineArrowNarrowRight className='size-5' />
          </Link>
        </li>
        <li className='px-5 py-4 min-h-28'>
          <h3 className='text-4xl font-bold'>{title}</h3>
        </li>
        <li
          className='
                border-y border-primary'
        >
          <img
            className='aspect-[16/3.5] object-cover object-center'
            src={cover.image}
            alt={cover.alt}
          />
        </li>
        <li className='px-2 mt-6'>
          <ReactMarkdown
            children={content}
            className='line-clamp-4 leading-loose'
          />
        </li>
      </ul>
    );
  }
}

export default Articlecard;
