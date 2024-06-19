import React, { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../Utilis/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar.jsx";
import { deleteObject, ref } from "firebase/storage";
import Warningmodal from "../components/Warningmodal";
import CommentSection from "../components/CommentSection.jsx";
import useMenu from "../Hooks/useMenu.jsx";

function Article() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { fetchArticleContent, convertDate, isAdmin } = useGlobalContext();
  const [content, setContent] = useState("");
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const manageMenuRef = useRef(null);
  const manageBtnRef = useRef(null);
  const { isMenuOpen, setIsMenuOpen } = useMenu(manageBtnRef, manageMenuRef);

  let path = pathname.split("-");
  const id = path[path.length - 1];

  const getArticle = async (id) => {
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);

    if (docSnap) {
      setArticle(docSnap.data());
      setIsLoading(false);
    } else {
      console.log("an error occurred");
    }
  };

  useEffect(() => {
    getArticle(id);
    fetchArticleContent(id, "articles").then((result) => {
      setContent(result);
    });
  }, []);

  const handleEditing = () => {
    const { cover, title, date } = article;
    let articleDraft = {
      coverImg: cover.image,
      title: title,
      content: content,
      details: { type: "articles", id: id },
      publishDate: date,
    };

    localStorage.setItem("articleDraft", JSON.stringify(articleDraft));
    navigate("/new");
  };

  const [isModalWarningOpen, setIsModalWarningOpen] = useState(false);

  const deleteArticle = () => {
    deleteDoc(doc(db, "articles", id));
    deleteObject(ref(storage, `articles/${id}`));
    navigate("/");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (article) {
    return (
      <>
        <Navbar />
        <main className='mx-32 border-t border-primary pt-10'>
          <h1 className='mx-auto mb-2 max-w-[60rem] text-6xl font-bold leading-[5rem]'>
            {article.title}
          </h1>
          <div className='mx-auto flex max-w-[60rem] items-center justify-between'>
            {convertDate(article.date)}
            <div className='flex items-center gap-4'>
              <button className='underline underline-offset-2'>
                Share this post
              </button>
              {isAdmin && (
                <div className='relative'>
                  <button
                    className='rounded p-1 px-2 font-semibold underline underline-offset-2 hover:bg-gray-200'
                    ref={manageBtnRef}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Manage
                  </button>
                  {isMenuOpen && (
                    <div className='absolute right-0 top-[110%] z-20 flex w-[12rem] flex-col gap-1 rounded-md border border-gray-200 bg-white p-1.5 shadow-lg *:rounded *:px-2 *:text-left'>
                      <button
                        className='py-1 hover:bg-blue-50 hover:text-blue-700'
                        ref={manageMenuRef}
                        onClick={handleEditing}
                      >
                        Edit Article
                      </button>
                      <div className='h-0 border-t py-0'></div>
                      <button
                        className='py-1 hover:bg-blue-50 hover:text-blue-700'
                        onClick={() => setIsModalWarningOpen(true)}
                      >
                        Delete Article
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='relative mb-8 grid place-items-center py-8 after:absolute after:bottom-0 after:right-[50%] after:w-[10rem] after:translate-x-[50%] after:border after:border-primary'>
            <img
              src={article.cover.image}
              alt={article.cover.alt}
              className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
            />
          </div>
          <ReactMarkdown
            children={content}
            className='prose-lg mx-auto max-w-[60rem] prose-headings:my-3 prose-headings:font-bold prose-li:list-disc'
          />
        </main>
        <CommentSection articleId={id} />
        <Footer />
        {isModalWarningOpen && (
          <Warningmodal
            deleteaction={deleteArticle}
            delBtn={"Delete"}
            setIsModalWarningOpen={setIsModalWarningOpen}
            content={"Are you sure you want to delete this post?"}
            header={"You're about to delete a published article"}
            backBtn={"Cancel"}
          />
        )}
      </>
    );
  }
}

export default Article;
