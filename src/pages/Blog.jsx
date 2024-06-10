import React, { useEffect, useState } from "react";
import { db, articlesRef, storage } from "../Utilis/firebase";
import { getDoc, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import RecentArticle from "../components/RecentArticle";
import Articlecard from "../components/Articlecard";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import authorHero from "../assets/images/author_hero.jpg";
import heroImg from "../assets/images/hero.jpg";
import { useGlobalContext } from "../context";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Blog() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getArticles = async () => {
    try {
      const snapshot = await getDocs(articlesRef);
      const data = snapshot.docs;
      if (data) {
        let articlesArr = [];
        data.forEach((doc) => articlesArr.push({ ...doc.data(), id: doc.id }));
        setArticles(
          articlesArr.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
        setIsLoading(false);
        console.log(articlesArr);
        console.log(articles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (articles.length > 0) {
    const fetchArticle = async (id) => {
      const articleRef = ref(storage, `articles/${id}/content.md`);
      const url = await getDownloadURL(articleRef);

      if (url) {
        let response = await fetch(url);
        let data = await response.text();
        return data;
      }
    };

    return (
      <>
        <Navbar />
        <main>
          {/* <RecentArticle article={articles[0]} /> */}
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
          <section className='mt-28 flex flex-col px-32'>
            <article className='grid grid-cols-2 gap-12'>
              {articles.map((article) => {
                return <Articlecard {...article} key={article.id} />;
              })}
            </article>
            <button className='mx-auto mb-4 mt-16 grid w-fit place-items-center border border-primary px-12 py-4 text-[16px] hover:font-semibold'>
              LOAD MORE
            </button>
          </section>
        </main>
        <Footer />
      </>
    );
  }
}

export default Blog;
