import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { Outlet, Link, useLocation, json } from "react-router-dom";

function New() {
  const { pathname } = useLocation();
  const path = pathname.split("/");
  const currentPath = path[path.length - 1];

  const [articleDraft, setArticleDraft] = useState(
    JSON.parse(localStorage.getItem("articleDraft")) || {
      coverImg: "",
      title: "",
      content: "",
      coverImgPath: "",
      publishedAt: "",
    },
  );

  const [errorComponent, setErrorComponent] = useState({
    show: false,
    content: "",
  });

  useEffect(() => {
    localStorage.setItem("articleDraft", JSON.stringify(articleDraft));
  }, [articleDraft]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setArticleDraft({ ...articleDraft, [name]: value });
  };

  return (
    <>
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
      <main className='min-h-[92vh] bg-[#f5f5f5] px-32 xl:min-h-[95vh]'>
        <section
          className={`h-[80vh] w-[60vw] overflow-y-hidden rounded-md border border-gray-300 bg-white ${(articleDraft.content.length > 250 || currentPath === "preview") && "overflow-y-scroll"}`}
        >
          {errorComponent.show && (
            <div className='m-0 grid items-center bg-red-100 px-10 py-4 pb-5 font-bold text-red-700'>
              <p className='m-0 h-fit py-0 text-2xl'>
                {errorComponent.content}
              </p>
            </div>
          )}
          <Outlet
            context={[
              articleDraft,
              handleChange,
              setArticleDraft,
              errorComponent,
              setErrorComponent,
            ]}
          />
        </section>
        <div className='mt-5 flex items-center gap-2 *:rounded-md *:px-4 *:py-[0.4rem]'>
          <button className='bg-blue-700 font-semibold text-white hover:bg-blue-800'>
            Publish
          </button>
          <button className='hover:bg-gray-300'>Save draft</button>
        </div>
      </main>
    </>
  );
}

export default New;
