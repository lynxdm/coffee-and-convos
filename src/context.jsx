import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./Utilis/firebase";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {
          displayName: "Guest User",
          email: "",
        }
  );

  const admin = { displayName: "Ajayi Ayobami", email: "lynxdm32@gmail.com" };
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUser = () => {
    if (user.email === admin.email) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    if (user.email !== "") {
      checkUser();
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const signUserOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      setIsAdmin(false);
      setUser({
        displayName: "Guest User",
        email: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, admin, isAdmin, signUserOut }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
