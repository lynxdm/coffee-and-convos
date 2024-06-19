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
    <section className='pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-50 grid h-[100vh] w-[100vw] place-items-center bg-[#0000006c]'>
      <div className='aspect-[3.3/1] w-[40rem] rounded-xl bg-white py-4 pt-2'>
        <div className='flex items-center justify-between border-b px-6 py-2'>
          <p className='text-xl font-semibold'>{header}</p>
          <button
            className='grid size-8 place-items-center rounded hover:bg-blue-100 hover:text-blue-700'
            onClick={() => setIsModalWarningOpen(false)}
          >
            <FaXmark className='size-5' />
          </button>
        </div>
        <div className='px-6 pt-8'>
          <p> {content}</p>
          <div className='mt-3 flex gap-4 *:rounded-md *:px-4 *:py-2 *:font-semibold'>
            <button
              className='bg-red-600 text-white hover:bg-red-700'
            onClick={deleteaction}
            >
              {delBtn}
            </button>
            <button
              className='bg-gray-200 text-gray-800 hover:bg-gray-300'
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
