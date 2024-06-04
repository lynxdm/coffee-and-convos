import React, { useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "./Utilis/firebase";
import { ref, getDownloadURL } from "firebase/storage";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    displayName: "Guest User",
    email: "",
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
        const { displayName, email } = user;
        setUser({ displayName, email });
        console.log("user logged in");
      } else {
        setUser({
          displayName: "Guest User",
          email: "",
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

  const fetchArticleContent = async (id) => {
    const articleRef = ref(storage, `articles/${id}/content.md`);
    const url = await getDownloadURL(articleRef);

    if (url) {
      let response = await fetch(url);
      let data = await response.text();
      return data;
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
