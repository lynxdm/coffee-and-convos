import React from "react";
import { FaXmark } from "react-icons/fa6";

function Warningmodal({
  setIsModalWarningOpen,
  deleteaction,
  header,
  content,
  delBtn,
  backBtn
}) {
  return (
    <section className='pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-50 grid h-[100vh] w-[100vw] place-items-center bg-[#0000006c] dark:bg-[#0000009d]'>
      <div className=' w-[100vw] h-[100vh] md:h-fit md:w-[40rem] md:rounded-xl bg-white dark:bg-darkBg py-4 pt-2 dark:border dark:border-[#3a3a3a]'>
        <div className='flex items-center justify-between border-b px-3 lg:px-6 py-2 dark:border-[#3a3a3a]'>
          <p className='text-lg lg:text-xl font-extrabold'>{header}</p>
          <button
            className='grid size-8 place-items-center rounded hover:bg-blue-100 dark:hover:bg-[#0000ff2d] hover:text-blue-700'
            onClick={() => setIsModalWarningOpen(false)}
          >
            <FaXmark className='size-5' />
          </button>
        </div>
        <div className='lg:px-6 px-3 lg:pt-8 py-4'>
          <p> {content}</p>
          <div className='mt-3 flex gap-4 *:rounded-md *:px-3 lg:*:px-4 *:py-2 *:font-semibold text-sm lg:text-base'>
            <button
              className='bg-red-700 dark:text-black text-white'
            onClick={deleteaction}
            >
              {delBtn}
            </button>
            <button
              className='bg-gray-00 dark:bg-[#262626] dark:text-darkPrimary text-gray-800 hover:bg-gray-300'
              onClick={() => setIsModalWarningOpen(false)}
            >
              {backBtn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Warningmodal;
