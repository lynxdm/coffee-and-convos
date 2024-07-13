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
          {/* <section
            className={`mt-4 flex h-[40rem]  w-full items-end overflow-hidden bg-[#adadad] bg-cover bg-center bg-no-repeat text-white bg-blend-multiply rounded-lg`}
            style={{ backgroundImage: `url(${articles[0].cover.image})` }}
          >
            <div className='flex max-h-[62%] w-full flex-col justify-between gap-4 border-[#fdadb8] bg-[#00000089] p-4 md:p-6 lg:p-7 backdrop-blur-sm dark:border-[#c26d78] lg:flex-row lg:gap-10 lg:border-l-[12px]'>
              <div className='flex xl:max-w-[35rem] flex-col gap-4 lg:gap-2'>
                <h1 className='font-kreon text-2xl md:text-3xl font-bold lg:text-5xl lg:leading-[4rem] xl:text-6xl xl:leading-[5rem]'>
                  {articles[0].title}
                </h1>
                <div className='flex text-sm md:text-base gap-2 font-kreon lg:flex'>
                  <p>{timeAgo(articles[0].date)}</p>
                  <span>•</span>
                  <div className='flex items-start text-blue-500'>
                    <PiMapPinSimpleBold className='lg:size-5' />
                    <p className='self-end'>Pinned</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <ReactMarkdown
                  children={previewContent}
                  className='prose md:prose-lg line-clamp-6 xl:max-w-[35rem] text-justify text-darkPrimary lg:prose-lg prose-headings:hidden prose-p:my-0 prose-img:hidden lg:leading-10'
                />
                <Link
                  to={`/blog/${formatLink(articles[0].title)}-${articles[0].id}`}
                  className='font-bold font-kreon md:text-lg lg:text-xl w-fit self-end lg:self-start'
                >
                  READ MORE
                </Link>
              </div>
            </div>
          </section> */}
          <section className='mt-8 flex flex-col lg:flex-row items-center justify-between lg:gap-8 gap-4 pb-4 lg:pb-0 lg:border-2 border-b-2 border-primary'>
            <img
              src={articles[0].cover.image}
              alt={articles[0].title + "cover image"}
              className='aspect-[2/1.5] lg:w-[50%] object-cover'
            />
            <div className='flex flex-col px-3 lg:px-0 lg:gap-4 py-2 gap-4 border-primary'>
              <Link
                to={`/blog/${formatLink(articles[0].title)}-${articles[0].id}`}
                className='flex items-start gap-3 lg:border-b border-primary lg:pb-3 pr-2 hover:text-gray-600'
              >
                <h2 className='font-kreon text-3xl lg:text-4xl font-extrabold max-w-[90%] lg:max-w-[92%]:'>
                 {articles[0].title}
                </h2>
                <FiArrowUpRight className='size-6' />
              </Link>
              <ReactMarkdown
                children={previewContent}
                className='prose line-clamp-6 lg:line-clamp-5 pr-2 prose-headings:hidden prose-p:my-0 prose-img:hidden lg:leading-8 xl:max-w-[41rem]'
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
