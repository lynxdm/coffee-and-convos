import React, { useState, useEffect } from "react";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState(pathname.slice(1));

  useEffect(() => {
    setCurrentPage(pathname.slice(1));
  }, [pathname]);

  return (
    <footer className='border-t mt-12 my-10 pt-4 border-primary flex items-center mx-32 justify-between'>
      <div className='flex flex-col gap-3'>
        <ul className='flex gap-6 *:text-md items-center'>
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
        <ul className='flex gap-5'>
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
      <div className='flex flex-col gap-3 items-center'>
        <Link to={"/"} className='text-xl font-semibold'>
          Coffee & Convos
        </Link>
        <p>Copyright &copy; {new Date().getFullYear()} Thebetawriter</p>
      </div>
      <form className='flex flex-col gap-3'>
        <label htmlFor='subscribe-email' className='text-md font-semibold'>
          NEWSLETTER
        </label>
        <div className='flex items-center border-b border-primary gap-2'>
          <input
            type='email'
            name="subscribe-email"
            placeholder='your email'
            id='subscribe-email'
            className='placeholder:text-primary focus:outline-none w-[10rem]'
            required
          />
          <button type='submit' className='font-semibold text-sm'>
            SUBSCRIBE
          </button>
        </div>
      </form>
    </footer>
  );
}

export default Footer;
