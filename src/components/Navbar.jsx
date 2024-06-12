import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlNote } from "react-icons/sl";
import { LuBell, LuMoonStar } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";
import { IoIosSunny } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { CiUser, CiBellOn, CiLogout, CiDark, CiLight } from "react-icons/ci";
import { useGlobalContext } from "../context";

function Navbar({ page }) {
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
      className={`z-20 flex w-full items-center justify-between bg-inherit px-32 py-3 pt-4 text-primary ${
        currentPage === "" && "absolute"
      }`}
    >
      <Link to={"/"} className='text-2xl font-semibold'>
        Coffee & Convos
      </Link>
      <ul className='flex items-center gap-4'>
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
            className='user-menu-btn grid place-items-center'
            type='button'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={userBtn}
          >
            <FaUserCircle className='size-6' />
          </button>
          <ul
            className={`absolute right-0 top-12 z-50 flex w-72 flex-col gap-y-4 rounded-xl border bg-white px-2 py-4 shadow-md *:*:flex *:w-full *:cursor-pointer *:*:items-center *:*:gap-2 *:rounded-lg *:*:p-2 *:*:capitalize *:capitalize ${
              isMenuOpen ? "visible" : "invisible"
            }`}
            ref={userMenu}
          >
            <li className='w-full border-b pb-1 text-center text-[1.1rem] font-[500]'>
              {isAdmin ? admin.displayName : user.displayName}
            </li>
            {isAdmin && (
              <>
                <li
                  className='px-2 hover:bg-gray-200'
                  onMouseUp={handleMenuOnMouseUp}
                >
                  <Link to={"/new"}>
                    <SlNote className='size-5' />
                    <p>write</p>
                  </Link>
                </li>
                <li
                  className='px-2 hover:bg-gray-200'
                  onMouseUp={handleMenuOnMouseUp}
                >
                  <Link to={"/drafts"}>
                    <CgNotes className='size-5' />
                    <p>Drafts</p>
                  </Link>
                </li>
              </>
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
                className='mt-[-0.5rem] cursor-pointer border-t pt-4 *:w-full *:rounded-lg *:px-4 *:hover:bg-gray-200'
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
