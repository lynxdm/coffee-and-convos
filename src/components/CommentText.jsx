import React, { useRef, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function CommentText({
  onSubmit,
  text,
  setText,
  handleChange,
  submitText,
  loadingText,
  isLoading,
  setIsTextOpen,
  placeholder,
}) {
  const textRef = useRef(null);
  useEffect(() => {
    textRef.current.style.height = "70px";
    const scrollHeight = textRef.current.scrollHeight;
    textRef.current.style.height = scrollHeight + "px";
  }, [textRef, text]);

 useEffect(()=>{
    textRef.current.focus()
 }, [])

  return (
    <form className='ml-auto mt-4 w-[95%]' onSubmit={onSubmit}>
      <textarea
        name='newComment'
        id='newComment'
        ref={textRef}
        placeholder={placeholder}
        className='peer h-[30rem] w-full resize-none overflow-hidden rounded-md border-2 border-gray-600 p-2 focus:outline-none'
        value={text}
        onChange={handleChange}
      />
      <div className='transition-[height 1ms ease] mt-1 flex gap-3'>
        {isLoading ? (
          <div className='flex items-center gap-2 rounded-md bg-[#3e3b3b] px-4 py-2 text-white'>
            <ScaleLoader
              color='rgba(256, 256, 256, 1)'
              height={12}
              radius={5}
              width={2}
            />
            <p>{loadingText}</p>
          </div>
        ) : (
          <button
            className='rounded-md bg-[#3e3b3b] px-4 py-2 text-white hover:bg-[#343432]'
            type='submit'
          >
            {submitText}
          </button>
        )}
        <button
          className='rounded-md px-4 py-2 hover:bg-gray-200'
          type='button'
          onClick={() => {
            setText("");
            setIsTextOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CommentText;
