import React, { useState, useEffect } from "react";
import { getDocs, query, limit, collection, orderBy } from "firebase/firestore";
import { db } from "../utili/firebase";

function useGetArticles(articlesRef, homePage = false) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const getArticles = async () => {
    try {
      let snapshot;
      if (!homePage) {
        snapshot = await getDocs(articlesRef);
      } else {
        const q = query(
          collection(db, "articles"),
          orderBy("date", "desc"),
          limit(6),
        );
        snapshot = await getDocs(q);
      }
      if (snapshot.empty) {
        setError(true);
      }
      const data = snapshot.docs;
      if (data) {
        let articlesArr = [];
        data.forEach((doc) => articlesArr.push({ ...doc.data(), id: doc.id }));
        setArticles(
          articlesArr.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return { isLoading, error, articles };
}

export default useGetArticles;
