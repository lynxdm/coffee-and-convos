import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useGlobalContext } from "../context";
import NotificationItem from "../components/NotificationItem";

function NewNotifications() {
  const { userNotifications } = useGlobalContext();
  const [readNotifications, setReadNotifications] = useState(null);

  useEffect(() => {
    if (userNotifications) {
      const newArr = userNotifications
        .flatMap((notification) => notification.read && notification)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      if (newArr.length > 0) {
        setReadNotifications([...newArr]);
      }
    }
  }, []);

  if (readNotifications) {
    return (
      <ul className='mx-auto my-14 flex max-w-[50rem] flex-col gap-3'>
        {readNotifications.map((notification, index) => {
          return (
            <NotificationItem {...notification} key={notification.timestamp} />
          );
        })}
      </ul>
    );
  }
}

export default NewNotifications;
