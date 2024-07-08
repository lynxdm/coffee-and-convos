import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, storage, db } from "./utili/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    displayName: "Guest User",
    email: "",
    photoURL: "",
    userId: "",
  });

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const [userNotifications, setUserNotifications] = useState(
    JSON.parse(sessionStorage.getItem("userNotifications")) || [],
  );

  const admin = { displayName: "Ajayi Ayobami", email: "lynxdm32@gmail.com" };
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUser = () => {
    if (user.email === admin.email) {
      setIsAdmin(true);
    }
  };

  const updateNotifications = async (user) => {
    if (!user?.email) return; // Check if user email is available
    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("email", "==", user.email));

      // Execute the query
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const newNotifications = querySnapshot.docs.flatMap(
          (doc) => doc.data().userNotifications || [],
        );
        setUserNotifications(newNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, photoURL } = user;
        setUser({ displayName, email, photoURL, userId: user.uid });
        console.log("user logged in");
        console.log(user.uid);
      } else {
        setUser({
          displayName: "Guest User",
          email: "",
          photoURL: "",
          userId: "",
        });
        console.log("no user logged in");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user.email !== "") {
      checkUser();
      updateNotifications(user);
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem(
      "userNotifications",
      JSON.stringify(userNotifications),
    );
  }, [userNotifications]);

  const signUserOut = async () => {
    try {
      await auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.log(error);
    }
  };

  function timeAgo(dateString, comment) {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    if (diffInSeconds < secondsInMinute) {
      if (comment) {
        return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""}`;
      }
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < secondsInHour) {
      const minutes = Math.floor(diffInSeconds / secondsInMinute);
      if (comment) {
        return `${minutes} min${diffInSeconds !== 1 ? "s" : ""}`;
      }
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < secondsInDay) {
      const hours = Math.floor(diffInSeconds / secondsInHour);
      if (comment) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      }
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < secondsInDay * 2) {
      return "yesterday";
    } else {
      if (comment) {
        const options = { month: "short", day: "numeric" };
        return createdAt.toLocaleDateString("en-US", options);
      }
      const options = { year: "numeric", month: "long", day: "numeric" };
      return createdAt.toLocaleDateString(undefined, options);
    }
  }

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

  const formatLink = (text) => {
    let formattedText = text.toLowerCase();

    return (formattedText = formattedText
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-"));
  };

  return (
    <AppContext.Provider
      value={{
        admin,
        isAdmin,
        signUserOut,
        fetchArticleContent,
        timeAgo,
        user,
        theme,
        setTheme,
        publishArticle,
        userNotifications,
        formatLink,
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
