import React, { useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, storage, db } from "./Utilis/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { addDoc, doc, setDoc } from "firebase/firestore";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    displayName: "Guest User",
    email: "",
    photoURL: "",
  });

  const admin = { displayName: "Ajayi Ayobami", email: "lynxdm32@gmail.com" };
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUser = () => {
    if (user.email === admin.email) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, photoURL } = user;
        console.log(user);
        setUser({ displayName, email, photoURL });
        console.log("user logged in");
      } else {
        setUser({
          displayName: "Guest User",
          email: "",
          photoURL: "",
        });
        console.log("no user logged in");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user.email !== "") {
      checkUser();
    }
  }, [user]);

  const signUserOut = async () => {
    try {
      await auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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

  const fetchArticleContent = async (id, type) => {
    const articleContentRef = ref(storage, `${type}/${id}/content.md`);
    const url = await getDownloadURL(articleContentRef);

    if (url) {
      let response = await fetch(url);
      let data = await response.text();
      return data;
    }
  };

  const publishArticle = async (data, id, path) => {
    try {
      let articleRef = doc(db, path, id);
      await setDoc(articleRef, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        admin,
        isAdmin,
        signUserOut,
        fetchArticleContent,
        convertDate,
        user,
        publishArticle,
        getCurrentDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
