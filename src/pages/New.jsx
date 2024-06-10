import React, {useState, useEffect} from "react";
import { FaXmark } from "react-icons/fa6";
import { Outlet, Link, useLocation } from "react-router-dom";

function New() {
  const { pathname } = useLocation();
  const path = pathname.split("/");
  const currentPath = path[path.length - 1];

const [articleDraft, setArticleDraft] = useState({
    cover_img: "",
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setArticleDraft({ ...articleDraft, [name]: value });
  };

  return (<>
      <nav className='relative flex items-center justify-between bg-[#f5f5f5] px-32 py-2'>
        <div className='flex min-w-[60vw] items-center justify-between'>
          <div className='flex items-center gap-5'>
            <Link to={"/"} className='text-2xl font-semibold'>
              Coffee & Convos
            </Link>
            <p className='text-lg font-semibold underline'>Markdown Editor</p>
          </div>
          <div className='flex items-center gap-5 *:rounded-lg *:px-4 *:py-2 hover:*:bg-gray-300'>
            <Link
              to={"/new"}
              className={`${currentPath === "new" && "font-bold"}`}
            >
              Edit
            </Link>
            <Link
              to={"/new/preview"}
              className={`${currentPath === "preview" && "font-bold"}`}
            >
              Preview
            </Link>
          </div>
        </div>
        <button className='absolute right-[3rem]'>
          <FaXmark className='size-6' />
        </button>
      </nav>
      <main className='min-h-[92vh] xl:min-h-[95vh] bg-[#f5f5f5] px-32'>
        <section className='h-[80vh] w-[60vw] overflow-y-scroll rounded-md border bg-white border-gray-300'>
          <Outlet context={[articleDraft, handleChange, setArticleDraft]} />
        </section>
        <div className="mt-5 flex items-center gap-2 *:px-4 *:py-[0.4rem] *:rounded-md">
          <button className="bg-blue-700 text-white hover:bg-blue-800 font-semibold">Publish</button>
          <button className="hover:bg-gray-300">Save draft</button>
        </div>
      </main>
    </>
  );
}

export default New;
