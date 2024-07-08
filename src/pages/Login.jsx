import React, { useState, useEffect } from "react";
import { auth, provider } from "../utili/firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { ScaleLoader } from "react-spinners";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useNotification from "../hook/useNotification";

function Login() {
  const navigate = useNavigate();
  const { createUserNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = () => {
    setIsLoading(true);
    // signInWithRedirect(auth, provider).catch(error=>console.log(error))
    signInWithPopup(auth, provider)
      .then((UserCredential) => {
        const user = UserCredential.user;
        createUserNotification(user);
        navigate("/");
      })
      .catch((error) => console.log("There was an error signing in:", error));
  };

  // useEffect(() => {
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       if (result) {
  //         console.log("User signed in successfully:", result.user);
  //         setIsLoading(true)
  //         createUserNotification(result.user);
  //         navigate("/");
  //       } else{
  //         throw new Error("unable to get result from auth");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error during sign-in:", error);
  //     });
  // }, [navigate]);

  return (
    <>
      <Navbar />
      <main className='grid min-h-[80vh] place-content-center'>
        <Outlet context={[signInWithGoogle]} />
      </main>
      {isLoading && (
        <div className='fixed bottom-0 left-0 right-0 top-0 flex h-[100vh] w-[100vw] place-items-center justify-center bg-[#01030a52] text-[rgba(74,74,218,0.97)]'>
          <ScaleLoader
            height={70}
            color='rgba(256,256,256,1)'
            width={10}
            radius={8}
          />
        </div>
      )}
    </>
  );
}

export default Login;
