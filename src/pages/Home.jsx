import React, { useEffect, useState } from "react";
import { db } from "../Utilis/firebase";
import { collection } from "firebase/firestore";
import Articlecard from "../components/Articlecard";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { Link } from "react-router-dom";
import authorHero from "../assets/images/author_hero.jpg";
import heroImg from "../assets/images/hero.jpg";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorComponent from "../components/ErrorComponent.jsx";
import useGetArticles from "../Hooks/useGetArticles.jsx";

function Home() {
  const { articles, isLoading, error } = useGetArticles(
    collection(db, "articles"),
    true,
  );

  if (isLoading) {
    return <Loader />;
  }

  if(error) {
    return <>
      <Navbar/>
    <ErrorComponent/>
    </>
  }

  if (articles.length > 0) {
    return (
      <>
        <Navbar />
        <main>
          <section className='relative grid h-fit min-h-[80vh] place-items-center px-12 lg:px-32 md:mb-20 lg:mb-0'>
            <div className='absolute left-0 top-0 -z-10 aspect-[1] w-[87%] md:w-[55%] md:max-w-[30rem] lg:bottom-0 lg:aspect-[16/13] lg:w-[51%] lg:max-w-full'>
              <img
                src={heroImg}
                alt='hero image'
                className='aspect-[1] object-cover md:max-w-[30rem] lg:aspect-[16/13] lg:max-w-full'
              />
            </div>
            <article className='mb-16 mt-32 flex flex-col items-center gap-7 min-[400px]:mt-48 md:ml-[10rem] md:mt-28 md:flex-row md:gap-4 lg:mb-0 lg:ml-[2rem] xl:ml-[10rem] lg:mt-31 lg:gap-24'>
              <div className='relative aspect-square size-[14rem] before:absolute before:top-[5%] before:h-[90%] before:w-0 before:-translate-x-[1000%] before:border before:border-black md:size-[16rem] lg:size-[18rem] xl:size-[28rem]'>
                <img
                  src={authorHero}
                  className='aspect-square'
                  alt='A photo of the author, Adefunke'
                />
              </div>
              <div className='flex flex-col md:items-end gap-2 *:text-left *:uppercase md:*:max-w-[12rem] md:*:text-left lg:*:w-full lg:*:max-w-full lg:*:text-left'>
                <h1 className='relative w-fit self-auto text-2xl font-bold before:absolute before:top-[50%] before:h-0 before:w-[10rem] before:-translate-x-[110%] before:-translate-y-[100%] before:border before:border-primary md:self-end lg:self-auto xl:text-4xl'>
                  Hello!
                </h1>
                <h1 className='text-2xl font-bold lg:ml-0 xl:text-4xl'>
                  I am Adefunke,
                </h1>
                <p className='text-right text-base font-semibold md:text-end lg:ml-0 lg:text-left xl:text-xl'>
                  A creative, content & technical writer{" "}
                </p>
                <ul className='mt-5 hidden gap-5 lg:flex'>
                  <li>
                    <FaLinkedinIn />
                  </li>
                  <li>
                    <FaXTwitter />
                  </li>
                  <li>
                    <FaInstagram />
                  </li>
                  <li>
                    <FaMedium />
                  </li>
                  <li>
                    <BiLogoGmail />
                  </li>
                </ul>
              </div>
            </article>
          </section>
          <section className='mt-12 flex flex-col px-6 lg:mt-24 lg:px-32'>
            <div className='mb-8 flex items-center justify-between'>
              <h1 className='relative py-1.5 text-lg font-semibold after:absolute after:bottom-0 after:left-0 after:w-[60%] after:border after:border-gray-500 lg:text-2xl'>
                Latest posts
              </h1>
              <Link
                to={"/blog"}
                className='border-2 border-gray-500 px-6 py-2 text-xs font-semibold text-gray-600 hover:text-primary lg:px-10 lg:text-sm'
              >
                SEE ALL
              </Link>
            </div>
            <article className='grid gap-12 md:grid-cols-2'>
              {articles.map((article) => {
                return (
                  <Articlecard {...article} key={article.id} type='articles' />
                );
              })}
            </article>
            <Link
              to={"/blog"}
              className='mx-auto mb-8 mt-20 grid w-fit place-items-center border-2 border-gray-500 px-5 py-3 text-[13px] font-semibold text-gray-500 hover:text-primary lg:px-9 lg:py-3.5 lg:text-[14px]'
            >
              LOAD MORE
            </Link>
          </section>
        </main>
        <Footer />
      </>
    );
  }
}

export default Home;
