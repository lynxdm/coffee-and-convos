import React from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function Preview() {
  const [articleDraft, setErrorComponent] = useOutletContext();

  const { content, coverImg, title } = articleDraft;

  return (
    <article className='lg:p-10 p-6'>
      <h1 className='font-inter mx-auto max-w-[50rem] text-center text-3xl font-bold leading-10 lg:mb-8 lg:text-6xl lg:leading-[5rem]'>
        {title}
      </h1>
      <div className='relative grid place-items-center border-primary py-8 pb-4 lg:py-12 lg:pb-8'>
        <img
          src={coverImg}
          alt={title + "cover image"}
          className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
        />
      </div>
      <ReactMarkdown
        children={content}
        className='prose-headings: prose-headings:font-inter prose-lg mx-auto max-w-[50rem] break-words md:prose-xl prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-bold prose-h2:font-extrabold prose-p:my-4 prose-li:list-disc lg:prose-h2:text-4xl'
      />
    </article>
  );
}

export default Preview;
