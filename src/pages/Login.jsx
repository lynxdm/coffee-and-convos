import React from "react";
import { auth, provider } from "../Utilis/firebase";
import { signInWithPopup } from "firebase/auth";
import { Outlet } from "react-router-dom";

function Login({ setIsAuth }) {
  // const signInWithGoogle = () => {
  //   signInWithPopup(auth, provider).then((result) => {
  //     localStorage.setItem("isAuth", true);
  //     setIsAuth(true);
  //   });
  // };

  return <Outlet />;
}

export default Login;
