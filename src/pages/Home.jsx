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
          <section className='relative grid h-fit min-h-[80vh] place-items-center px-32'>
            <div className='absolute bottom-0 left-0 -z-10 aspect-[1] w-[53%]'>
              <img src={heroImg} alt='hero image' className='aspect-[1]' />
            </div>
            <article className='ml-[18rem] mt-16 flex items-center gap-24'>
              <div className='relative aspect-square size-[28rem] before:absolute before:top-[5%] before:h-[90%] before:w-0 before:-translate-x-[1000%] before:border-r-[2px] before:border-black'>
                <img
                  src={authorHero}
                  className='aspect-square'
                  alt='A photo of the author, Adefunke'
                />
              </div>
              <div className='flex flex-col gap-2 *:uppercase'>
                <h1 className='relative w-fit text-4xl font-bold before:absolute before:top-[50%] before:h-0 before:w-[10rem] before:-translate-x-[110%] before:-translate-y-[100%] before:border before:border-primary'>
                  Hello!
                </h1>
                <h1 className='text-4xl font-bold'>I am Adefunke,</h1>
                <p className='text-xl font-semibold'>
                  A creative, content & technical writer{" "}
                </p>
                <ul className='mt-5 flex gap-5'>
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
          <section className='mt-24 flex flex-col px-32'>
            <div className='mb-8 flex items-center justify-between'>
              <h1 className='relative py-1.5 text-2xl font-semibold after:absolute after:bottom-0 after:left-0 after:w-[60%] after:border after:border-gray-500'>
                Latest posts
              </h1>
              <Link
                to={"/blog"}
                className='border-2 border-gray-500 px-10 py-2 text-sm font-semibold text-gray-600 hover:text-primary'
              >
                SEE ALL
              </Link>
            </div>
            <article className='grid grid-cols-2 gap-12'>
              {articles.map((article) => {
                return (
                  <Articlecard {...article} key={article.id} type='articles' />
                );
              })}
            </article>
            <Link
              to={"/blog"}
              className='mx-auto mb-8 mt-20 grid w-fit place-items-center border-2 border-gray-500 px-9 py-3.5 text-[14px] font-semibold text-gray-500 hover:text-primary'
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
