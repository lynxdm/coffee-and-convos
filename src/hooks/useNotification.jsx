import React, { useState } from "react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../utilis/firebase";
import { useGlobalContext } from "../context";
import { RiRadarFill } from "react-icons/ri";
import { update } from "firebase/database";
import { v4 } from "uuid";

function useNotification() {
  const { user, admin, getCurrentDate, isAdmin } = useGlobalContext();

  const notificationsRef = collection(db, "notifications");

  const createUserNotification = async (result) => {
    // Create a query against the subcollection
    try {
      const q = query(notificationsRef, where("email", "==", result.email));

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const newUserNotificationData = {
          userNotifications: [],
          displayName: result.displayName,
          email: result.email,
          id: result.uid,
        };

        const newUserRef = doc(db, "notifications", result.uid);

        await setDoc(newUserRef, newUserNotificationData);
      } else {
        console.log("snapshot empty");
      }
    } catch (err) {
      console.log("unable to create user notification", err);
    }
  };

  const sendNotification = async (
    type,
    comment,
    articleId,
    currentUser,
    reply = false,
    articleLink,
  ) => {
    const {
      user: { userId, displayName, email, photoURL },
      id,
      content,
    } = comment;

    if (currentUser.email === email) {
      console.log("auto action");
      return;
    }

    const newNotification = {
      type,
      articleId,
      articleLink,
      timestamp: new Date().toISOString(),
      commentId: id,
      content: content,
      read: false,
      reply,
      notificationId: v4(),
      currentUser,
    };

    if (email === admin.email) {
      const userData = await getDoc(
        doc(db, "notifications", "adminNotifications"),
      );

      const updatedNotifications = [
        ...userData.data().userNotifications,
        newNotification,
      ];

      await updateDoc(doc(db, "notifications", "adminNotifications"), {
        userNotifications: updatedNotifications,
      });
      return;
    }

    const userData = await getDoc(doc(db, "notifications", userId));

    const updatedNotifications = [
      ...userData.data().userNotifications,
      newNotification,
    ];

    await updateDoc(doc(db, "notifications", userId), {
      userNotifications: updatedNotifications,
    });
  };

  const sendAdminNotification = async (
    type,
    comment,
    articleId,
    currentUser,
    articleLink,
    articleTitle,
  ) => {
    if (currentUser.email === admin.email) {
      console.log("auto notify");
      return;
    }

    const newNotification = {
      type,
      comment,
      articleId,
      currentUser,
      articleLink,
      articleTitle,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const userData = await getDoc(
      doc(db, "notifications", "adminNotifications"),
    );

    const updatedNotifications = [
      ...userData.data().userNotifications,
      newNotification,
    ];

    await updateDoc(doc(db, "notifications", "adminNotifications"), {
      userNotifications: updatedNotifications,
    });
  };

  const markNotificationsAsRead = async (user) => {
    let notificationsRef;

    if (isAdmin) {
      notificationsRef = doc(db, "notifications", "adminNotifications");
    } else {
      notificationsRef = doc(db, "notifications", user.userId);
    }
    const data = await getDoc(notificationsRef);

    if (data.exists()) {
      const notifications = data.data().userNotifications;
      const updatedNotifications = notifications.map((notification) => {
        if (!notification.read) {
          return { ...notification, read: true };
        }
        return notification;
      });

      await updateDoc(notificationsRef, {
        userNotifications: updatedNotifications,
      });
    }
  };

  return {
    createUserNotification,
    sendNotification,
    sendAdminNotification,
    markNotificationsAsRead,
  };
}

export default useNotification;
