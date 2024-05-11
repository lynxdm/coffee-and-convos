import React, { useEffect, useState } from "react";
import { db, articlesRef } from "../Utilis/firebase";
import { getDoc, getDocs } from "firebase/firestore";

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
        console.log(articles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return <div>Blog</div>;
}

export default Blog;
