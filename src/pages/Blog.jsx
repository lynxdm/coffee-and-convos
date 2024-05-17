import React, { useEffect, useState } from "react";
import { db, articlesRef, storage } from "../Utilis/firebase";
import { getDoc, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import RecentArticle from "../components/RecentArticle";
import Articlecard from "../components/Articlecard";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

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
        <RecentArticle article={articles[0]} />
        <section className='grid grid-cols-2 gap-12 my-12'>
          {articles.slice(1).map((article) => {
            return <Articlecard {...article} key={article.id} />;
          })}
        </section>
      </main>
    );
  }
}

export default Blog;
