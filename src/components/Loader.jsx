import React from "react";
import { DotLoader } from "react-spinners";

function Loader() {
  return (
    <main className='h-[85vh] grid place-items-center'>
      <DotLoader />
    </main>
  );
}

export default Loader;
