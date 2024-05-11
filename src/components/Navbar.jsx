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
    <nav className='flex justify-between py-3 pt-4 px-4 text-primary bg-background border-b-2 border-primary items-center mb-8'>
      <Link to={"/"} className='text-xl font-semibold'>
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
            className={
              isMenuOpen
                ? "flex flex-col gap-y-4 *:capitalize *:*:capitalize absolute right-0 top-12 border border-primary w-72 py-2 rounded-sm *:*:flex *:*:gap-2 *:*:items-center z-10 bg-background visible"
                : "flex flex-col gap-y-4 *:capitalize *:*:capitalize absolute right-0 top-12 border border-primary w-72 py-2 rounded-sm *:*:flex *:*:gap-2 *:*:items-center z-10 bg-background invisible"
            }
            ref={userMenu}
          >
            <li className='w-full text-center pb-1 border-b border-b-primary'>
              {isAdmin ? admin.displayName : user.displayName}
            </li>
            {isAdmin && (
              <li className='px-2' onMouseUp={handleMenuOnMouseUp}>
                <Link to={"/editor"}>
                  <SlNote className='size-5' />
                  <p>write</p>
                </Link>
              </li>
            )}
            {user.email && (
              <li className='px-2' onMouseUp={handleMenuOnMouseUp}>
                <Link to={"/notifications"}>
                  <LuBell className='size-5' />
                  <p>notifications</p>
                </Link>
              </li>
            )}
            {user.email ? (
              <li className='px-2' onMouseUp={handleMenuOnMouseUp}>
                <button type='button' onClick={signUserOut}>
                  <TbLogout2 className='size-5' />
                  <p>logout</p>
                </button>
              </li>
            ) : (
              <li className='px-2' onMouseUp={handleMenuOnMouseUp}>
                <Link to={"/login"}>
                  <LuBell className='size-5' />
                  <p>Login</p>
                </Link>
              </li>
            )}
            <li className='px-2'>
              <button>
                <LuMoonStar className='size-5' />
                <p>theme</p>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
