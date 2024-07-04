import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
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
import Warningmodal from "../components/Warningmodal";

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
                date: `${articleDraft.publishDate ? articleDraft.publishDate : new Date().toISOString()}`,
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
  const [isDeleteDraft, setIsDeleteDraft] = useState(false);

  const clearEditor = () => {
    localStorage.removeItem("articleDraft");
    navigate("/");
  };

  const deleteDraft = () => {
    deleteDoc(doc(db, "drafts", `${articleDraft.details.id}`));
    deleteObject(ref(storage, `drafts/${articleDraft.details.id}`));
    localStorage.removeItem("articleDraft");
    navigate("/");
  };

  return (
    <>
      <nav className='relative flex items-center justify-between bg-[#f5f5f5] lg:px-32 py-2 px-2 min-h-[5vh]'>
        <div className='flex min-w-[60vw] items-center justify-between'>
          <div className='lg:flex items-center gap-5 hidden'>
            <Link to={"/"} className='text-2xl font-semibold'>
              Coffee & Convos
            </Link>
            <p className='text-lg font-semibold underline'>Markdown Editor</p>
          </div>
          <div className='flex items-center lg:gap-5 *:rounded-lg *:px-4 *:py-2 hover:*:bg-gray-300'>
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
          className='absolute right-4 lg:right-[3rem]'
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
      <main className='bg-[#f5f5f5] lg:px-32 min-h-[110vh]'>
        <section
          className={`h-[40rem] xl:w-[57rem] overflow-y-hidden lg:rounded-md border border-gray-300 bg-white ${(articleDraft.content.length > 200 || currentPath === "preview") && "overflow-y-scroll"} relative`}
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
        <div className='my-5 flex items-center px-3 gap-2 pb-4 *:rounded-md *:px-4 *:py-[0.4rem]'>
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
              {articleDraft.details.type === "drafts" && (
                <button
                  className='self-end bg-red-600 text-white hover:bg-red-700'
                  onClick={() => setIsDeleteDraft(true)}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </main>
      {isDeleteDraft && (
        <Warningmodal
          deleteaction={deleteDraft}
          delBtn={"Delete"}
          setIsModalWarningOpen={setIsDeleteDraft}
          content={"Are you sure you want to delete your saved work?"}
          header={"You're about to delete a draft"}
          backBtn={"Cancel"}z
        />
      )}
      {isModalWarningOpen && (
        <Warningmodal
          deleteaction={clearEditor}
          delBtn={"Yes, leave this page"}
          setIsModalWarningOpen={setIsModalWarningOpen}
          content={
            "You've made some changes to this post. Do you want to leave this page?"
          }
          header={"You have unsaved changes"}
          backBtn={"No, keep editing"}
        />
      )}
    </>
  );
}

export default New;
