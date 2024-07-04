import React, { useState, useEffect } from "react";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { FaArrowUp} from "react-icons/fa6";
// import FooterBg from "../assets/images/footer_bg.png";

function Footer() {
  const { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState(pathname.slice(1));

  useEffect(() => {
    setCurrentPage(pathname.slice(1));
  }, [pathname]);

 const scrollUp = ()=>{
    window.scrollTo({top: 0, behavior: 'smooth'})
 }

// bg - [url("src/assets/images/footer_bg2.svg")];

  return (
    <footer className='relative mt-12 flex flex-col items-center gap-8 bg-[#fdadb8] bg-cover px-6 lg:px-20 pb-8 pt-14 text-[#342f23]'>
      <div className='flex flex-col items-center gap-6'>
        <Link to={"/"} className='text-lg font-semibold'>
          Coffee & Convos
        </Link>
        <ul className='flex items-center gap-8 *:text-sm *:uppercase'>
          <li>
            <Link
              to={"/"}
              className={currentPage === "" ? "font-semibold" : undefined}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={"/blog"}
              className={currentPage === "blog" ? "font-semibold" : undefined}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to={"/about"}
              className={currentPage === "about" ? "font-semibold" : undefined}
            >
              About
            </Link>
          </li>
        </ul>
        <ul className='flex gap-8 *:rounded-full *:border-2 *:border-[#342f23] *:p-2 *:bg-[#342f23] *:cursor-pointer *:text-[#fdadb8]'>
          <li>
            <FaLinkedinIn />
          </li>
          <li>
            <FaXTwitter />
          </li>
          <li>
            <FaInstagram />
          </li>
          <li>
            <FaMedium />
          </li>
          <li>
            <BiLogoGmail />
          </li>
        </ul>
      </div>
      <div className='w-full border-t-2 border-[#342f23] pt-8'>
        <p className='text-center'>
          Copyright &copy; {new Date().getFullYear()} Thebetawriter. All rights
          reserved
        </p>
      </div>
      {/* <button
        className='absolute bottom-10 right-32 grid size-10 place-items-center rounded-full border-2 border-white bg-white text-black transition-transform hover:-translate-y-[5%]'
        onClick={scrollUp}
      >
        <FaArrowUp className='size-6' />
      </button> */}
    </footer>
  );
}

export default Footer;
