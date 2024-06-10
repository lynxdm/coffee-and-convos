import React from "react";
import { auth, provider } from "../Utilis/firebase";
import { signInWithPopup } from "firebase/auth";
import { Outlet } from "react-router-dom";

function Login() {
  return <Outlet />;
}

export default Login;
