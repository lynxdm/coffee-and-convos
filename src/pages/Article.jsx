import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../Utilis/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useGlobalContext } from "../context";
import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";

function Article() {
  const { pathname } = useLocation();
  const { fetchArticleContent, convertDate } = useGlobalContext();
  const [content, setContent] = useState("");
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let path = pathname.split("-");
  const id = path[path.length - 1];

  const getArticle = async (id) => {
    const articleRef = doc(db, "articles", id);
    const docSnap = await getDoc(articleRef);

    if (docSnap) {
      console.log(docSnap.data());
      setArticle(docSnap.data());
      setIsLoading(false);
    } else {
      console.log("an error occurred");
    }
  };

  useEffect(() => {
    getArticle(id);
    fetchArticleContent(id).then((result) => {
      setContent(result);
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (article) {
    return (
      <main className='mx-32 pt-10 border-t border-primary'>
        <h1 className='text-6xl font-bold leading-[5rem] mb-2 max-w-[60rem] mx-auto'>
          {article.title}
        </h1>
        <div className='flex justify-between items-center max-w-[60rem] mx-auto'>
          {convertDate(article.date)}
          <button className='underline underline-offset-2'>
            Share this post
          </button>
        </div>
        <div className='py-8 relative after:absolute after:w-[10rem] after:bottom-0 after:right-[50%] after:translate-x-[50%] after:border after:border-primary mb-8 grid place-items-center'>
          <img
            src={article.cover.image}
            alt={article.cover.alt}
            className='aspect-[16/9] w-[60rem] object-cover object-center rounded-lg'
          />
        </div>
        <ReactMarkdown
          children={content}
          className='mx-auto prose-lg max-w-[60rem] prose-headings:font-bold prose-li:list-disc'
        />
      </main>
    );
  }
}

export default Article;
