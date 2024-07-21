import React, { useState, useEffect } from "react";
import { auth, provider } from "../utilis/firebase";
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
import useNotification from "../hooks/useNotification";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const { createUserNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "The email address is already in use by another account.";
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled.";
      case "auth/weak-password":
        return "The password is too weak.";
      case "auth/user-disabled":
        return "The user account has been disabled.";
      case "auth/user-not-found":
        return "There is no user corresponding to this email.";
      case "auth/wrong-password":
        return "The password is invalid.";
      case "auth/invalid-credential":
        return "The provided credential is not valid.";
      case "auth/cancelled-popup-request":
        return "This operation has been cancelled due to another conflicting popup being opened.";
      case "auth/operation-not-supported-in-this-environment":
        return "This operation is not supported in the environment this application is running on.";
      case "auth/popup-blocked":
        return "The popup has been blocked by the browser.";
      case "auth/popup-closed-by-user":
        return "The popup has been closed by the user before finalizing the operation.";
      default:
        return "An unknown error occurred. Check your connection, and try again.";
    }
  };

  const signInWithGoogle = () => {
    setIsLoading(true);
    // signInWithRedirect(auth, provider).catch(error=>console.log(error))
    signInWithPopup(auth, provider)
      .then((UserCredential) => {
        const user = UserCredential.user;
        createUserNotification(user);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        let errorMsg = getErrorMessage(error.code);
        toast.error(errorMsg);
      });
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
        {/* <div className='mb-5 bg-red-100 text-red-700 dark:bg-[#c7363640] rounded p-2 max-w-[20rem]'>Wrong password or email in current use and its sad</div> */}
        <Outlet context={[signInWithGoogle, getErrorMessage]} />
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
