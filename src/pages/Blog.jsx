import React, { useEffect, useState } from "react";
import { db, articlesRef, storage } from "../Utilis/firebase";
import { getDoc, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import RecentArticle from "../components/RecentArticle";
import Articlecard from "../components/Articlecard";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import authorHero from "../assets/images/author_hero.jpg";
import heroImg from "../assets/images/hero.jpg";

function Blog() {
  const [articles, setArticles] = useState([]);

  const getArticles = async () => {
    try {
      const snapshot = await getDocs(articlesRef);
      const data = snapshot.docs;
      if (data) {
        let articlesArr = [];
        data.forEach((doc) => articlesArr.push({ ...doc.data(), id: doc.id }));
        setArticles(
          articlesArr.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
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

  const convertDate = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let [year, month, day] = date.split("-").map(Number);
    return `${months[month - 1]} ${day}, ${year}`;
  };

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
      <main>
        {/* <RecentArticle article={articles[0]} /> */}
        <section className='relative min-h-[80vh] grid place-items-center h-fit px-32'>
          <div className='w-[53%] aspect-[1] absolute -z-10 left-0 bottom-0'>
            <img src={heroImg} alt='hero image' className='aspect-[1]' />
          </div>
          <article className='ml-[18rem] flex items-center gap-24 mt-16'>
            <div className='size-[28rem] aspect-square before:w-0 before:h-[90%] before:border-r-[2px] before:border-black relative before:absolute before:-translate-x-[1000%] before:top-[5%]'>
              <img
                src={authorHero}
                className='aspect-square'
                alt='A photo of the author, Adefunke'
              />
            </div>
            <div className='*:uppercase flex flex-col gap-2'>
              <h1 className='text-4xl font-bold before:h-0 before:w-[10rem] before:border before:border-primary relative before:absolute w-fit before:top-[50%] before:-translate-x-[110%] before:-translate-y-[100%]'>
                Hello!
              </h1>
              <h1 className='text-4xl font-bold'>I am Adefunke,</h1>
              <p className='font-semibold text-xl'>
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
        <section className='mt-28 px-32 flex flex-col'>
          <article className='grid grid-cols-2 gap-12'>
            {articles.map((article) => {
              return <Articlecard {...article} key={article.id} />;
            })}
          </article>
          <button className="mx-auto w-fit border border-primary mt-16 mb-4 hover:font-semibold text-[16px] px-12 py-4 grid place-items-center">LOAD MORE</button>
        </section>
      </main>
    );
  }
}

export default Blog;
