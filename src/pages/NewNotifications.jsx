import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import NotificationItem from "../components/NotificationItem";

function NewNotifications() {
  const { userNotifications, user } = useGlobalContext();
  const [newNotifications, setNewNotifications] = useState(null);

  useEffect(() => {
    if (userNotifications) {
      const newArr = userNotifications
        .flatMap((notification) => !notification.read && notification)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      if (newArr.length > 0) {
        setNewNotifications([...newArr]);
      }
    }
  }, []);

  if (newNotifications) {
    return (
      <ul className='mx-auto my-14 flex max-w-[50rem] flex-col gap-2'>
        {newNotifications.map((notification, index) => {
          return (
            <NotificationItem
              {...notification}
              notification={notification}
              key={notification.timestamp}
            />
          );
        })}
      </ul>
    );
  }
}

export default NewNotifications;
