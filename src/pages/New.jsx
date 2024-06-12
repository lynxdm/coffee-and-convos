import React, { useState, useEffect } from "react";
import { FaLess, FaXmark } from "react-icons/fa6";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage, db } from "../Utilis/firebase";
import { v4 } from "uuid";
import { ScaleLoader } from "react-spinners";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";

function New() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.split("/");
  const currentPath = path[path.length - 1];
  const [isLoading, setIsLoading] = useState({ show: false, message: "" });

  const { publishArticle } = useGlobalContext();

  const [articleDraft, setArticleDraft] = useState(
    JSON.parse(localStorage.getItem("articleDraft")) || {
      coverImg: "",
      title: "",
      content: "",
      details: { type: "new", id: v4().split("-").join("") },
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

  const getCurrentDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handlePublishing = (type) => {
    if (articleDraft.title) {
      setIsLoading({
        show: true,
        message: `${type === "articles" ? "Publishing Article..." : "Saving Draft..."}`,
      });
      const markdownContent = new Blob([articleDraft.content], {
        type: "text/markdown",
      });
      const markdownRef = ref(
        storage,
        `${type}/${articleDraft.details.id}/content.md`,
      );
      if (articleDraft.details.type !== "new") {
        deleteObject(ref(storage, markdownRef)).catch((error) =>
          console.log("error deleting markdown" + error),
        );
        if (type === "articles" && articleDraft.details.type === "drafts") {
          deleteObject(ref(storage, `drafts/${articleDraft.details.id}`)).catch(
            (error) =>
              console.log("error deleting article from storage" + error),
          );
          deleteDoc(doc(db, "drafts", `${articleDraft.details.id}`)).catch(
            (error) => console.log("error deleting artice from drafts" + error),
          );
        }
      }
      uploadBytes(markdownRef, markdownContent)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              const articleData = {
                content: url,
                title: articleDraft.title,
                cover: {
                  image: articleDraft.coverImg,
                  alt: `${articleDraft.title} cover image`,
                },
                date: `${articleDraft.publishDate ? articleDraft.publishDate : getCurrentDate()}`,
              };
              if (articleDraft.details.type === "article") {
                updateDoc(
                  doc(storage, `articles/${articleDraft.details.id}`),
                  articleData,
                );
                localStorage.removeItem("articleDraft");
                navigate("/");
                return;
              }
              publishArticle(articleData, articleDraft.details.id, type);
              localStorage.removeItem("articleDraft");
              navigate(`${type === "articles" ? "/" : "/drafts"}`);
            })
            .catch((error) => {
              setErrorComponent({
                show: true,
                content: `${type === "articles" ? "whoops there was a problem publishing:" : "whoops there was a problem saving the draft"}`,
              });
              console.log(error);
            });
        })
        .catch((error) => {
          setErrorComponent({
            show: true,
            content: `${type === "articles" ? "whoops there was a problem publishing:" : "whoops there was a problem saving the draft"}`,
          });
          console.log(error);
        });
    } else {
      setErrorComponent({ show: true, content: "The title cannot be blank" });
    }
  };

  const [isModalWarningOpen, setIsModalWarningOpen] = useState(false);

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
        <button
          className='absolute right-[3rem]'
          onClick={() => {
            if (
              articleDraft.title ||
              articleDraft.content ||
              articleDraft.coverImg
            ) {
              setIsModalWarningOpen(true);
            } else {
              navigate("/");
            }
          }}
        >
          <FaXmark className='size-6' />
        </button>
      </nav>
      <main className='min-h-[92vh] bg-[#f5f5f5] px-32 xl:min-h-[95vh]'>
        <section
          className={`h-[80vh] w-[60vw] overflow-y-hidden rounded-md border border-gray-300 bg-white ${(articleDraft.content.length > 250 || currentPath === "preview") && "overflow-y-scroll"} relative`}
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
          {isLoading.show ? (
            <div className='flex gap-2 bg-blue-700 font-semibold text-white'>
              <ScaleLoader
                color='rgba(256, 256, 256, 1)'
                height={12}
                radius={5}
                width={2}
              />
              <p>{isLoading.message}</p>
            </div>
          ) : (
            <>
              <button
                className='bg-blue-700 font-semibold text-white hover:bg-blue-800'
                onClick={() => handlePublishing("articles")}
              >
                Publish
              </button>
              {articleDraft.details.type !== "articles" && (
                <button
                  className='hover:bg-gray-300'
                  onClick={() => handlePublishing("drafts")}
                >
                  Save draft
                </button>
              )}
            </>
          )}
        </div>
      </main>
      {isModalWarningOpen && (
        <section className='pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-50 grid h-[100vh] w-[100vw] place-items-center bg-[#0000006c]'>
          <div className='aspect-[3.3/1] w-[40rem] rounded-xl bg-white py-4 pt-2'>
            <div className='flex items-center justify-between border-b px-6 py-2'>
              <p className='text-xl font-semibold'>
                You have some unsaved changes
              </p>
              <button
                className='grid size-8 place-items-center rounded hover:bg-blue-100 hover:text-blue-700'
                onClick={() => setIsModalWarningOpen(false)}
              >
                <FaXmark className='size-5' />
              </button>
            </div>
            <div className='px-6 pt-8'>
              <p>
                {" "}
                You've made some changes to this post. Do you want to leave this
                page?
              </p>
              <div className='mt-3 flex gap-4 *:rounded-md *:px-4 *:py-2 *:font-semibold'>
                <button
                  className='bg-red-600 text-white hover:bg-red-700'
                  onClick={() => {
                    localStorage.removeItem("articleDraft");
                    navigate("/");
                  }}
                >
                  Yes, leave this page
                </button>
                <button
                  className='bg-gray-200 text-gray-800 hover:bg-gray-300'
                  onClick={() => setIsModalWarningOpen(false)}
                >
                  No, keep editing
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default New;
