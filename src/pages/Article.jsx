import React, { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../utilis/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar.jsx";
import { deleteObject, ref } from "firebase/storage";
import Warningmodal from "../components/Warningmodal";
import CommentSection from "../components/CommentSection.jsx";
import useMenu from "../hooks/useMenu.jsx";
import { update } from "firebase/database";

function Article() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { fetchArticleContent, timeAgo, isAdmin } = useGlobalContext();
  const [content, setContent] = useState("");
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const manageMenuRef = useRef(null);
  const manageBtnRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useMenu(manageBtnRef, manageMenuRef);

  let path = pathname.split("-");
  const id = path[path.length - 1];

  const getArticle = async (id) => {
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);

    if (docSnap) {
      setArticle(docSnap.data());
      setIsLoading(false);
      if (docSnap.data().pinned) setIsPinned(true);
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
  const [warningStatement, setWarningStatement] = useState({
    delBtn: "",
    content: "",
    header: "",
    action: () => {},
  });

  const deleteArticle = () => {
    deleteDoc(doc(db, "articles", id));
    deleteObject(ref(storage, `articles/${id}`));
    navigate("/blog");
  };

  const unpinArticles = async () => {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("pinned", "==", true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;
    snapshot.forEach((doc) => {
      const docRef = doc.ref;
      updateDoc(docRef, {
        pinned: false,
      });
    });
  };

  const pinArticle = async () => {
    await unpinArticles();
    let articleRef = doc(db, "articles", id);
    updateDoc(articleRef, {
      pinned: true,
    });
    setIsModalWarningOpen(false);
    setIsPinned(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (article) {
    return (
      <>
        <Navbar />
        <main className='mx-6 pt-10 font-inter_tight lg:mx-32'>
          <h1 className='mx-auto mb-4 max-w-[50rem] text-center font-kreon text-3xl font-bold leading-10 lg:mb-8 lg:text-6xl lg:leading-[5rem]'>
            {article.title}
          </h1>
          <div className='mx-auto flex max-w-[60rem] items-center justify-between font-kurale dark:text-darkSecondary'>
            <p className='capitalize'>{timeAgo(article.date)}</p>
            <div className='flex items-center gap-4'>
              <button className='underline underline-offset-2'>
                Share this post
              </button>
              {isAdmin && (
                <div className='relative'>
                  <button
                    className='rounded p-1 px-2 font-semibold underline underline-offset-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                    ref={manageBtnRef}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Manage
                  </button>
                  {isMenuOpen && (
                    <div className='absolute right-0 top-[110%] z-20 flex w-[12rem] flex-col gap-1 rounded-md border border-gray-200 bg-white p-1.5 shadow-lg *:rounded *:px-2 *:text-left dark:border-[#3a3a3a] dark:bg-darkBg'>
                      <button
                        className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                        ref={manageMenuRef}
                        onClick={handleEditing}
                      >
                        Edit Article
                      </button>
                      <button
                        className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                        onClick={() => {
                          setWarningStatement({
                            delBtn: "Delete",
                            content:
                              "Are you sure you want to delete this post?",
                            header:
                              "You're about to delete a published article",
                            action: deleteArticle,
                          });
                          setIsModalWarningOpen(true);
                        }}
                      >
                        Delete Article
                      </button>
                      {!isPinned ? (
                        <button
                          className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                          onClick={() => {
                            // setModalType("pin");
                            setWarningStatement({
                              delBtn: "Pin",
                              content:
                                "Note that any previously pinned articles will be unpinned.",
                              header:
                                "You're about to pin this article to your blog",
                              action: pinArticle,
                            });
                            setIsModalWarningOpen(true);
                          }}
                        >
                          Pin Article
                        </button>
                      ) : (
                        <button
                          className='py-2 hover:bg-gray-200 dark:hover:bg-[#262626]'
                          onClick={() => {
                            setWarningStatement({
                              delBtn: "Unpin",
                              content:
                                "Are you sure you want to unpin this article?",
                              header: "You're about to unpin this article",
                              action: () => {
                                unpinArticles();
                                setIsPinned(false);
                                setIsModalWarningOpen(false);
                              },
                            });
                            setIsModalWarningOpen(true);
                          }}
                        >
                          Unpin Article
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='relative grid place-items-center border-primary py-10 pb-4 lg:py-12 lg:pb-8'>
            <img
              src={article.cover.image}
              alt={article.cover.alt}
              className='aspect-[16/9] w-[60rem] rounded-lg object-cover object-center'
            />
          </div>
          <ReactMarkdown
            children={content}
            className='prose-lg mx-auto max-w-[50rem] break-words font-overpass md:prose-xl prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-kreon prose-headings:font-bold prose-h2:font-extrabold prose-p:my-4 prose-li:list-disc lg:prose-h2:text-4xl'
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
            deleteaction={warningStatement.action}
            delBtn={warningStatement.delBtn}
            setIsModalWarningOpen={setIsModalWarningOpen}
            content={warningStatement.content}
            header={warningStatement.header}
            backBtn={"Cancel"}
          />
        )}
      </>
    );
  }
}

export default Article;
