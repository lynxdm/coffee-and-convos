import React, { useEffect, useState } from "react";
import { db, articlesRef } from "../Utilis/firebase";
import { getDoc, getDocs } from "firebase/firestore";

function Blog() {
  const [articles, setArticles] = useState([]);

  // const getArticles = async () => {
  //   const snapshot = await getDocs(articlesRef);
  //   // const data = snapshot.docs;
  //   console.log(snapshot);
  //   // if(data){
  //   //   let articlesArr = []
  //   //   data.forEach( (doc)=> articlesArr.push({...doc.data(), id:doc.id})
  //   //   )
  //   //   console.log(articlesArr)
  //   //   setArticles(articlesArr)
  //   // }.
  // };

  // useEffect(() => {
  //   getArticles();
  // }, []);

  return <div>Blog</div>;
}

export default Blog;
