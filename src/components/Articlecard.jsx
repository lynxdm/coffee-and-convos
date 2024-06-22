import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

function Articlecard({ title, cover, date, id, type }) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const { fetchArticleContent, timeAgo } = useGlobalContext();

  const formatLink = (text) => {
    let formattedText = text.toLowerCase();

    return (formattedText = formattedText
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-"));
  };

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
      <ul className='border border-primary py-3' key={id}>
        <li className='flex items-center justify-between border-b border-primary px-2 pb-2'>
          <p className='text-sm'>{timeAgo(date)}</p>
          {type === "articles" ? (
            <Link
              to={`/${formatLink(title)}-${id}`}
              className='flex w-fit items-center gap-2 self-end'
            >
              <p className='font-semibold'>Read</p>
              <HiOutlineArrowNarrowRight className='size-5' />
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
        <li className='min-h-28 px-5 py-4'>
          <h3 className='text-4xl font-bold'>{title}</h3>
        </li>
        <li className='border-y border-primary'>
          <img
            className='aspect-[16/3.5] object-cover object-center'
            src={cover.image}
            alt={cover.alt}
          />
        </li>
        <li className='mt-6 px-2'>
          <ReactMarkdown
            children={content}
            className='prose line-clamp-4 leading-loose prose-img:hidden'
          />
        </li>
      </ul>
    );
  }
}

export default Articlecard;
