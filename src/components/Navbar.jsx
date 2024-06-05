import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlNote } from "react-icons/sl";
import { LuBell, LuMoonStar } from "react-icons/lu";
import { IoIosSunny } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { CiUser, CiBellOn, CiLogout, CiDark, CiLight } from "react-icons/ci";
import { useGlobalContext } from "../context";

function Navbar() {
  const { admin, isAdmin, user, signUserOut } = useGlobalContext();

  const { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState(pathname.slice(1));

  const userMenu = useRef(null);
  const userBtn = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenu = (e) => {
    if (
      !userMenu.current.contains(e.target) &&
      !userBtn.current.contains(e.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  const handleMenuOnMouseUp = () => {
    setIsMenuOpen(false);
  };
  useEffect(() => {
    setCurrentPage(pathname.slice(1));
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.addEventListener("click", handleMenu);
    }

    return () => {
      document.body.removeEventListener("click", handleMenu);
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`flex justify-between py-3 pt-4  text-primary bg-inherit w-full items-center px-32 z-20 ${
        currentPage === "" && "absolute"
      }`}
    >
      <Link to={"/"} className='text-2xl font-semibold'>
        Coffee & Convos
      </Link>
      <ul className='flex gap-4 items-center'>
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
        <li className='relative'>
          <button
            className='grid place-items-center user-menu-btn'
            type='button'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={userBtn}
          >
            <FaUserCircle className='size-6' />
          </button>
          <ul
            className={`flex flex-col gap-y-4 *:capitalize *:*:capitalize *:cursor-pointer absolute right-0 top-12 shadow-md border w-72 py-4 px-3 rounded-xl *:*:flex *:*:gap-2 *:*:p-2 *:w-full *:rounded-lg *:*:items-center z-10 bg-white ${
              isMenuOpen ? "visible" : "invisible"
            }`}
            ref={userMenu}
          >
            <li className='w-full text-center border-b font-semibold pb-1 text-lg'>
              {isAdmin ? admin.displayName : user.displayName}
            </li>
            {isAdmin && (
              <li
                className='px-2 hover:bg-gray-200'
                onMouseUp={handleMenuOnMouseUp}
              >
                <Link to={"/editor"}>
                  <SlNote className='size-5' />
                  <p>write</p>
                </Link>
              </li>
            )}
            {user.email && (
              <li
                className='px-2 hover:bg-gray-200'
                onMouseUp={handleMenuOnMouseUp}
              >
                <Link to={"/notifications"}>
                  <LuBell className='size-5' />
                  <p>notifications</p>
                </Link>
              </li>
            )}
            <li className='px-2 hover:bg-gray-200'>
              <button>
                <LuMoonStar className='size-5' />
                <p>theme</p>
              </button>
            </li>
            {user.email ? (
              <li
                className=' border-t pt-4 mt-[-0.5rem] *:px-4 cursor-pointer *:w-full *:rounded-lg *:hover:bg-gray-200'
                onMouseUp={handleMenuOnMouseUp}
              >
                <button type='button' onClick={signUserOut}>
                  <TbLogout2 className='size-5' />
                  <p>logout</p>
                </button>
              </li>
            ) : (
              <li
                className='px-2 hover:bg-gray-200'
                onMouseUp={handleMenuOnMouseUp}
              >
                <Link to={"/login"}>
                  <LuBell className='size-5' />
                  <p>Login</p>
                </Link>
              </li>
            )}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
