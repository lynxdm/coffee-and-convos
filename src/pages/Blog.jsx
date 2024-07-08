import React, { useEffect, useState } from "react";
import { db } from "../utilis/firebase";
import { collection } from "firebase/firestore";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import useGetArticles from "../hooks/useGetArticles";
import Articlecard from "../components/Articlecard";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import { useGlobalContext } from "../context";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import ErrorComponent from "../components/ErrorComponent";

function Blog() {
  const { articles, isLoading, error } = useGetArticles(
    collection(db, "articles"),
  );
  const [previewContent, setPreviewContnt] = useState("");

  const { fetchArticleContent, timeAgo, formatLink } = useGlobalContext();

  useEffect(() => {
    if (!isLoading) {
      fetchArticleContent(articles[0].id, "articles").then((data) => {
        setPreviewContnt(data);
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <Navbar />
        <ErrorComponent />
      </>
    );
  }

  if (articles.length > 0) {
    return (
      <>
        <Navbar />
        <main className='lg:px-32  px-6'>
          <section className='mt-12 border dark:border-[#3a3a3a] border-primary py-2 pt-6 hidden lg:block'>
            <div className='flex flex-col lg:flex-row w-full items-center justify-center gap-2 lg:gap-10 px-4 mb-4'>
              <div className='lg:w-[60rem]'>
                <h1 className='text-left text-2xl lg:text-6xl font-bold lg:font-semibold leading-normal'>
                  {articles[0].title}
                </h1>
              </div>
              <div>
                <ReactMarkdown
                  children={previewContent}
                  className='prose prose-md dark:text-darkSecondary lg:prose-lg line-clamp-6 max-w-[50rem] leading-10 prose-headings:hidden prose-p:my-0 prose-img:hidden'
                />
              </div>
            </div>
            <div className='flex border-t items-center border-primary dark:border-[#3a3a3a] px-3 pt-2 mt-5'>
              <p className='text-sm'>{timeAgo(articles[0].date)}</p>
              <Link
                to={`/blog/${formatLink(articles[0].title)}-${articles[0].id}`}
                className='ml-auto flex w-fit items-center gap-2'
              >
                <p className='font-semibold'>Read</p>
                <HiOutlineArrowNarrowRight className='size-5' />
              </Link>
            </div>
          </section>
          <section className='py-12'>
            <article className='grid md:grid-cols-2 gap-12'>
              {articles.map((article) => {
                return (
                  <Articlecard {...article} key={article.id} type='articles' />
                );
              })}
            </article>
          </section>
        </main>
        <Footer/>
      </>
    );
  }
}

export default Blog;
