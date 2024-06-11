import React from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function Preview() {
  const [articleDraft, setErrorComponent] = useOutletContext();

  const { content, coverImg, title } = articleDraft;

  return (
    <article className='p-10'>
      <h1 className='mx-auto mb-2 max-w-[60rem] text-6xl font-bold leading-[5rem]'>
        {title}
      </h1>
      <div className='mx-auto flex max-w-[60rem] items-center justify-between'>
        <p className='underline underline-offset-2'>Editing...</p>
      </div>
      <div className='relative mb-8 grid place-items-center py-8 after:absolute after:bottom-0 after:right-[50%] after:w-[10rem] after:translate-x-[50%] after:border after:border-primary'>
        <img
          src={coverImg}
          alt={title + "cover image"}
          className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
        />
      </div>
      <ReactMarkdown
        children={content}
        className='prose-lg mx-auto max-w-[60rem] prose-headings:font-bold prose-li:list-disc'
      />
    </article>
  );
}

export default Preview;
