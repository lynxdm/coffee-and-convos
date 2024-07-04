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
  const { fetchArticleContent, timeAgo, isAdmin } = useGlobalContext();
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
        <main className='lg:mx-32 mx-6 pt-10 font-inter_tight'>
          <h1 className='mx-auto lg:mb-8 mb-4 max-w-[50rem] text-3xl lg:text-6xl lg:leading-[5rem] leading-10 font-bold font-inter text-center'>
            {article.title}
          </h1>
          <div className='mx-auto flex max-w-[60rem] items-center justify-between'>
            <p className="capitalize">{timeAgo(article.date)}</p>
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
                        className='py-1 hover:bg-gray-200'
                        ref={manageMenuRef}
                        onClick={handleEditing}
                      >
                        Edit Article
                      </button>
                      <div className='h-0 border-t py-0'></div>
                      <button
                        className='py-1 hover:bg-gray-200'
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
          <div className='relative grid place-items-center border-primary lg:py-12 py-10 pb-4 lg:pb-8'>
            <img
              src={article.cover.image}
              alt={article.cover.alt}
              className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
            />
          </div>
          <ReactMarkdown
            children={content}
            className='md:prose-xl prose-lg mx-auto max-w-[50rem] prose-headings: prose-headings:font-bold prose-headings:font-inter prose-h2:font-extrabold prose-li:list-disc lg:prose-h2:text-4xl prose-p:my-4 break-words prose-headings:mt-8 prose-headings:mb-4'
          />
        </main>
        <CommentSection
          articleId={id}
          articleLink={pathname}
          articleTitle={article.title}
        />
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
