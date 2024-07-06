import React from "react";
import { DotLoader } from "react-spinners";
import { useGlobalContext } from "../context";

function Loader() {
  const {theme } = useGlobalContext()

  return (
    <main className='grid h-[100vh] place-items-center'>
      <DotLoader color={`${theme === "dark" ? "#D4D4D4" : "#161616"}`} />
    </main>
  );
}

export default Loader;
