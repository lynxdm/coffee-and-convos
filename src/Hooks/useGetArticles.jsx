import React, { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";

function useGetArticles(articlesRef) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setIsError] = useState(false);

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
      }
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return { isLoading, error, articles };
}

export default useGetArticles;
