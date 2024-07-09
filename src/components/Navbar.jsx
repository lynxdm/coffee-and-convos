import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlNote } from "react-icons/sl";
import { LuBell, LuMoonStar } from "react-icons/lu";
import { CgNotes, CgMenuRight } from "react-icons/cg";
import {
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedinIn,
  FaXmark,
} from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";
import { IoIosSunny } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useGlobalContext } from "../context";
import useMenu from "../hooks/useMenu";
import { genConfig } from "react-nice-avatar";
import ReactNiceAvatar from "react-nice-avatar";

function Navbar({ page, bg }) {
  const {
    admin,
    isAdmin,
    user,
    signUserOut,
    userNotifications,
    theme,
    setTheme,
  } = useGlobalContext();
  const [imageError, setImageError] = useState(false);

  const notificationNum = userNotifications.filter(
    (notification) => !notification.read && notification,
  ).length;

  const sidebarRef = useRef(null);
  const sidebarBtn = useRef(null);

  //  const [isSidebarOpen, setIsSidebarOpen] = useMenu(sidebarBtn, sidebarRef)
  const [isSidebarOpen, setIsSidebarOpen] = useMenu(sidebarBtn, sidebarRef);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState(pathname.slice(1));

  const userMenu = useRef(null);
  const userBtn = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useMenu(userMenu, userBtn);

  useEffect(() => {
    setCurrentPage(pathname.slice(1));
  }, [pathname]);

  const config = genConfig(user.email);

  return (
    <>
      <nav
        className={`z-20 flex w-full items-center justify-between ${bg ? `bg-[${bg}]` : "bg-inherit"} px-6 py-3 pt-4 text-primary lg:px-32 ${
          currentPage === "" && "absolute"
        }`}
      >
        <Link
          to={"/"}
          className={`text-xl font-semibold font-kreon lg:text-2xl ${currentPage !== "" && "dark:text-darkPrimary"}`}
        >
          Coffee & Convos
        </Link>
        <ul className='flex items-center gap-6 dark:text-darkSecondary'>
          <li className='hidden lg:block'>
            <Link to={"/"} className={`${currentPage === "" && "font-bold"}`}>
              Home
            </Link>
          </li>
          <li className='hidden lg:block'>
            <Link
              to={"/blog"}
              className={`${currentPage === "blog" && "font-bold"}`}
            >
              Blog
            </Link>
          </li>
          <li className='hidden lg:block'>
            <Link
              to={"/about"}
              className={`${currentPage === "about" && "font-bold"}`}
            >
              About
            </Link>
          </li>
          <li className='flex items-center gap-5'>
            <div className='relative'>
              <button
                className='user-menu-btn grid place-items-center'
                type='button'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                ref={userBtn}
              >
                {user.photoURL ? (
                  !imageError ? (
                    <img
                      src={user.photoURL}
                      alt={user.dispalyName + " display photo"}
                      className='size-6 rounded-full lg:size-8'
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <ReactNiceAvatar className='size-6 lg:size-8' {...config} />
                  )
                ) : (
                  <FaUserCircle className='size-6' />
                )}
              </button>
              <ul
                className={`absolute right-0 top-12 z-50 flex w-[90vw] translate-x-[14%] flex-col gap-y-4 rounded-lg border bg-white px-2 py-4 shadow-md *:*:flex *:w-full *:cursor-pointer *:*:items-center *:*:gap-2 *:*:p-2 *:*:capitalize *:capitalize dark:border-[#2c2c2d] dark:bg-darkBg sm:w-80 sm:translate-x-0 lg:w-72 lg:rounded-xl ${
                  isMenuOpen ? "visible" : "invisible"
                }`}
                ref={userMenu}
              >
                <li className='w-full border-b pb-1 text-center text-[1.1rem] font-[500] dark:border-[#3a3a3a]'>
                  {isAdmin ? admin.displayName : user.displayName}
                </li>
                {isAdmin && (
                  <>
                    <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                      <Link to={"/new"}>
                        <SlNote className='size-5' />
                        <p>write</p>
                      </Link>
                    </li>
                    <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                      <Link to={"/drafts"}>
                        <CgNotes className='size-5' />
                        <p>Drafts</p>
                      </Link>
                    </li>
                  </>
                )}
                {user.email && (
                  <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                    <Link to={"/notifications"}>
                      <div className='relative'>
                        <LuBell className='size-5' />
                        {notificationNum > 0 && (
                          <span className='absolute right-0 top-0 grid size-4 -translate-y-[50%] translate-x-[35%] place-items-center rounded-full bg-blue-700 text-[0.8rem] text-white'>
                            {notificationNum}
                          </span>
                        )}
                      </div>
                      <p>notifications</p>
                    </Link>
                  </li>
                )}
                <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                  <button
                    className='w-full'
                    onClick={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                  >
                    {theme === "light" ? (
                      <LuMoonStar className='size-5' />
                    ) : (
                      <IoIosSunny className='size-5' />
                    )}
                    <p>theme</p>
                  </button>
                </li>
                {user.email ? (
                  <li className='mt-[-0.5rem] cursor-pointer border-t pt-4 *:w-full *:rounded-lg *:px-4 *:hover:bg-gray-200 dark:border-[#3a3a3a] dark:*:hover:bg-[#262626]'>
                    <button
                      type='button'
                      onClick={() => {
                        signUserOut();
                        navigate("/login");
                      }}
                    >
                      <TbLogout2 className='size-5' />
                      <p>logout</p>
                    </button>
                  </li>
                ) : (
                  <li className='rounded-lg px-2 hover:bg-gray-200 dark:hover:bg-[#262626]'>
                    <Link to={"/login"}>
                      <LuBell className='size-5' />
                      <p>Login</p>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <button
              className='lg:hidden'
              ref={sidebarBtn}
              onClick={() => setIsSidebarOpen(true)}
            >
              <CgMenuRight className='size-6' />
            </button>
          </li>
        </ul>
      </nav>
      <aside
        className={`shadow-x fixed right-0 top-0 z-40 h-[100vh] w-[75vw] max-w-[20rem] ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} border-l border-gray-200 bg-white py-6 text-gray-700 transition-transform duration-300 dark:border-[#262626] dark:bg-darkBg dark:text-darkSecondary`}
        ref={sidebarRef}
      >
        <button
          className='float-right mr-6 rounded-full p-1 text-gray-700 dark:text-darkPrimary'
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaXmark className='size-6' />
        </button>
        <div className='clear-both mt-16 flex flex-col gap-14'>
          <div className='flex flex-col gap-6 text-xl font-semibold capitalize *:px-4 *:py-5 hover:*:bg-gray-200 dark:hover:*:bg-[#262626]'>
            <Link
              to={"/"}
              className={` ${currentPage === "" && "border-l-[6px] border-[#f88c9b] bg-[#febdbd6e] dark:border-[#f39fa9] dark:bg-[#b78a8a19]"}`}
            >
              Home
            </Link>
            <Link
              to={"/about"}
              className={` ${currentPage === "about" && "border-l-[6px] border-[#f88c9b] bg-[#febdbd6e] dark:border-[#f39fa9] dark:bg-[#b78a8a19]"}`}
            >
              About
            </Link>
            <Link
              to={"/blog"}
              className={` ${currentPage === "blog" && "border-l-[6px] border-[#f88c9b] bg-[#febdbd6e] dark:border-[#f39fa9] dark:bg-[#b78a8a19]"} `}
            >
              Blog
            </Link>
          </div>
          <ul className='flex flex-wrap gap-4 px-6 *:*:size-5 *:rounded-full *:p-2 hover:*:bg-gray-200 dark:hover:*:bg-[#262626]'>
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
      </aside>
    </>
  );
}

export default Navbar;
