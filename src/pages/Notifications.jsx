import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import Navbar from "../components/Navbar";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../Utilis/firebase";
import useNotification from "../Hooks/useNotification";

function Notifications() {
  const { userNotifications, user } = useGlobalContext();
  const {markNotificationsAsRead} = useNotification()
  const { pathname } = useLocation();
  const path = pathname.split("/");
  const currentPath = path[path.length - 1];

  useEffect(() => {
     markNotificationsAsRead(user);
  }, []);

  return (
    <>
      <Navbar bg={"#f5f5f5"} />
      <main className='min-h-[100vh] bg-[#f5f5f5] px-32 pb-14'>
        <h1 className='mb-5 pt-4 text-center text-2xl font-semibold'>
          All Notifications
        </h1>
        <nav className='mx-auto flex w-fit justify-center rounded-3xl border bg-gray-200 *:rounded-3xl *:border-gray-300 *:px-10 *:py-1.5 *:text-lg'>
          <Link
            to={"/notifications"}
            className={`${currentPath === "notifications" ? "bg-white text-primary" : "text-gray-500"}`}
          >
            New
          </Link>
          <Link
            to={"/notifications/read"}
            className={`${currentPath === "read" ? "bg-white text-primary" : "text-gray-500"}`}
          >
            Read
          </Link>
        </nav>
        <Outlet />
      </main>
    </>
  );
}

export default Notifications;
