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
    <footer className='relative mt-12 flex flex-col items-center gap-8 bg-[#fdadb8] bg-cover px-6 pb-8 pt-14 text-[#342f23] dark:bg-[#c26d78] dark:text-[#18140d] lg:px-20'>
      <div className='flex flex-col items-center gap-6'>
        <Link to={"/"} className='text-xl font-kreon font-semibold'>
          Coffee & Convos
        </Link>
        <ul className='flex items-center gap-8 *:text-sm *:uppercase'>
          <li>
            <Link
              to={"/"}
              className={currentPage === "" ? "font-bold" : undefined}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={"/blog"}
              className={currentPage === "blog" ? "font-bold" : undefined}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to={"/about"}
              className={currentPage === "about" ? "font-bold" : undefined}
            >
              About
            </Link>
          </li>
        </ul>
        <ul className='flex gap-8 *:cursor-pointer *:rounded-full *:border-2 *:border-[#342f23] *:bg-[#342f23] dark:*:border-[#18140d] *:p-2 *:text-[#fdadb8] dark:*:bg-[#18140d] dark:*:text-[#c26d78]'>
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
      <div className='w-full border-t-2 font-kreon border-[#342f23] pt-8'>
        <p className='text-center'>
          Copyright &copy; {new Date().getFullYear()} Thebetawriter. All rights
          reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
