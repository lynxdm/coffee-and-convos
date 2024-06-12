import React from "react";
import { auth, provider } from "../Utilis/firebase";
import { signInWithPopup } from "firebase/auth";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Login;
