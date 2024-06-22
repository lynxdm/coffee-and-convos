import React, { useEffect } from "react";
import { auth, provider } from "../Utilis/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useNotification from "../Hooks/useNotification";

function Login() {
  const navigate = useNavigate();
  const { createUserNotification } = useNotification();

  const signInWithGoogle = () => {
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("User signed in successfully:", result.user);
          createUserNotification(result.user);
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Outlet context={[signInWithGoogle]} />
      <Footer />
    </>
  );
}

export default Login;
