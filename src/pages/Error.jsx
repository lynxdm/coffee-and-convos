import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Error() {
  return (
    <>
      <Navbar />
      <main className="grid place-items-center h-[80vh]">
        <div className="text-center flex flex-col gap-5">
          <h1 className="text-8xl">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="font-semibold">Sorry, the page you're looking for doesn't exist.</p>
          <Link to={"/"} className="w-fit mx-auto px-12 py-3 rounded-3xl font-semibold bg-primary mt-4 text-white">Back to Home</Link>
        </div>
      </main>
    </>
  );
}

export default Error;
