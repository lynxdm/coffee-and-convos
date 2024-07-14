import React, { useEffect, useState } from "react";
import { db } from "../utilis/firebase";
import { collection } from "firebase/firestore";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import useGetArticles from "../hooks/useGetArticles";
import Articlecard from "../components/Articlecard";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";
import { RxDrawingPinFilled } from "react-icons/rx";
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
        <main className='px-6 lg:px-32'>
          <section className='mt-8 flex flex-col items-center justify-between gap-4 border-b-2 border-primary pb-4 dark:border-[#3a3a3a] lg:flex-row lg:gap-8 lg:border-2 lg:pb-0'>
            <img
              src={articles[0].cover.image}
              alt={articles[0].title + "cover image"}
              className='aspect-[2/1.5] w-full max-w-[40rem] object-cover md:aspect-[2/1.2] lg:aspect-[1/1.1] lg:w-[50%] lg:max-w-full min-[1200px]:aspect-[2/1.8] xl:aspect-[2/1.5]'
            />
            <div className='flex flex-col gap-4 border-primary px-3 py-2 dark:border-[#3a3a3a] lg:gap-4 lg:px-0'>
              <Link
                to={`/blog/${formatLink(articles[0].title)}-${articles[0].id}`}
                className='flex items-start gap-3 border-primary pr-2 hover:text-gray-600 dark:border-[#3a3a3a] dark:hover:text-gray-400 lg:border-b lg:pb-3'
              >
                <h2 className='lg:max-w-[92%]: max-w-[90%] font-kreon text-3xl font-extrabold lg:text-4xl'>
                  {articles[0].title}
                </h2>
                <FiArrowUpRight className='size-6' />
              </Link>
              <ReactMarkdown
                children={previewContent}
                className='prose line-clamp-6 pr-2 prose-headings:hidden prose-p:my-0 prose-img:hidden dark:text-darkSecondary lg:line-clamp-5 lg:leading-8 xl:max-w-[41rem]'
              />
              <div className='flex flex-col justify-center gap-1'>
                <div className='flex items-start gap-1 text-pink-700'>
                  <RxDrawingPinFilled className='lg:size-5' />
                  <p className='self-end font-bold'>Pinned</p>
                </div>
                <p>{timeAgo(articles[0].date)}</p>
              </div>
            </div>
          </section>
          <section className='py-12'>
            <article className='grid gap-12 md:grid-cols-2 xl:grid-cols-3'>
              {articles.map((article) => {
                return (
                  <Articlecard {...article} key={article.id} type='articles' />
                );
              })}
            </article>
          </section>
        </main>
        <Footer />
      </>
    );
  }
}

export default Blog;
