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

  return (
    <footer
      className='border-t mt-12 h-[16rem]  text-white border-primary flex items-start pt-[3.5rem] px-32 bg-[url("src/assets/images/footer_bg2.svg")] bg-cover justify-between relative'
    >
      <div className='flex flex-col gap-4'>
        <ul className='flex gap-6 *:text-lg items-center'>
          <li>
            <Link
              to={"/"}
              className={currentPage === "" ? "font-semibold" : undefined}
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
        <ul className='flex gap-5 *:text-xl'>
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
      <div className='flex flex-col gap-4 items-center'>
        <Link to={"/"} className='text-[1.5rem] font-semibold'>
          Coffee & Convos
        </Link>
        <p>Copyright &copy; {new Date().getFullYear()} Thebetawriter</p>
      </div>
      <form className='flex flex-col gap-4'>
        <label htmlFor='subscribe-email' className='text-lg font-semibold'>
          NEWSLETTER
        </label>
        <div className='flex items-center border-b border-white gap-2'>
          <input
            type='email'
            name='subscribe-email'
            placeholder='your email'
            id='subscribe-email'
            className='focus:outline-none w-[10rem] bg-transparent
             placeholder:text-white'
            required
          />
          <button type='submit' className='font-semibold text-sm'>
            SUBSCRIBE
          </button>
        </div>
      </form>
      <button className="absolute border-white bottom-10 right-32 border-2 size-10 grid place-items-center rounded-full text-black bg-white hover:-translate-y-[5%] transition-transform" onClick={scrollUp}><FaArrowUp className="size-6"/></button>
    </footer>
  );
}

export default Footer;
