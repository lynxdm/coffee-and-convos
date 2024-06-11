import React, { useRef, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import UseToolbar from "../Hooks/UseToolbar";
import { addDoc } from "firebase/firestore";
import { storage } from "../Utilis/firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Editor() {
  const [articleDraft, handleChange, setArticleDraft] = useOutletContext();
  const [imageIsLoading, setImageIsLoading] = useState(false);

  const textAreaRef = useRef(null);

  useEffect(() => {
    textAreaRef.current.style.height = "0px";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height = scrollHeight + "px";
  }, [textAreaRef, articleDraft.content]);

  const {
    handleBold,
    handleItalic,
    handleStrikethrough,
    handleOrderedList,
    handleUnderline,
    handleLinking,
    handleUnOrderedList,
    handleQuote,
    handleAddImage,
  } = UseToolbar(textAreaRef, setArticleDraft, articleDraft);

  const uploadImage = (e) => {
    if (e.target.files[0]) {
      const startPos = textAreaRef.current.selectionStart;
      const endPos = textAreaRef.current.selectionEnd;

      handleAddImage(true, "", startPos, endPos);
      const image = e.target.files[0];
      const uniqueImageName = `${v4()}-${image.name}`;
      console.log(uniqueImageName);
      const imageRef = ref(storage, `uploads/articleImages/${uniqueImageName}`);
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          handleAddImage(false, url, startPos, endPos);
        });
      });
    }
  };

  return (
    <form className='relative flex flex-col gap-6 py-8'>
      <label
        htmlFor='cover-img'
        className='mx-16 w-fit cursor-pointer rounded-md border-2 border-gray-300 px-3 py-[0.4rem] font-semibold'
      >
        Add a cover image
        <input
          type='file'
          name='cover-img'
          id='cover-img'
          accept='image/*'
          className='hidden'
        />
      </label>
      <input
        type='text'
        placeholder='Article title here'
        name='title'
        value={articleDraft.title}
        onChange={handleChange}
        id='title'
        className='px-16 text-5xl font-extrabold placeholder:text-5xl placeholder:font-extrabold placeholder:text-gray-600 focus:outline-none'
      />
      <div className='sticky top-0 flex w-full items-center gap-6 bg-[#f5f5f5] px-16 py-3'>
        <button
          type='button'
          className='font-mono text-2xl'
          onClick={handleBold}
        >
          B
        </button>
        <button
          type='button'
          className='font-mono text-2xl italic'
          onClick={handleItalic}
        >
          I
        </button>
        <button type='button' className='font-mono text-2xl'>
          H
        </button>
        <button
          type='button'
          className='font-mono text-2xl underline'
          onClick={handleUnderline}
        >
          U
        </button>
        <button
          type='button'
          className='font-mono text-2xl line-through'
          onClick={handleStrikethrough}
        >
          S
        </button>
        <button type='button' onClick={handleLinking}>
          <svg
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M18.364 15.536 16.95 14.12l1.414-1.414a5.001 5.001 0 0 0-3.531-8.551 5 5 0 0 0-3.54 1.48L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 1 1 9.9 9.9l-1.415 1.414zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z'></path>
          </svg>
        </button>
        <button type='button' onClick={handleOrderedList}>
          <svg
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
            class='crayons-icon'
          >
            <path d='M8 4h13v2H8zM5 3v3h1v1H3V6h1V4H3V3zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2zM8 11h13v2H8zm0 7h13v2H8z'></path>
          </svg>
        </button>
        <button type='button' onClick={handleUnOrderedList}>
          <svg
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
            class='crayons-icon'
          >
            <path d='M8 4h13v2H8zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8zm0 7h13v2H8z'></path>
          </svg>
        </button>
        <button type='button' onClick={handleQuote}>
          <svg
            height='24'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
            class='crayons-icon'
          >
            <path d='M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179z'></path>
          </svg>
        </button>
        <label htmlFor='add-img'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path d='M20 5H4v14l9.292-9.294a1 1 0 011.414 0L20 15.01V5zM2 3.993A1 1 0 012.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 01-.992.993H2.992A.993.993 0 012 20.007V3.993zM8 11a2 2 0 110-4 2 2 0 010 4z'></path>
          </svg>
          <input
            type='file'
            className='hidden'
            name='add-img'
            id='add-img'
            accept='image/*'
            onInput={uploadImage}
          />
        </label>
      </div>
      <textarea
        name='content'
        id='content'
        value={articleDraft.content}
        placeholder='Article content here...'
        onChange={handleChange}
        className='resize-none overflow-hidden px-16 font-mono text-lg leading-loose placeholder:text-gray-600 focus:outline-none'
        ref={textAreaRef}
      ></textarea>
    </form>
  );
}

export default Editor;
