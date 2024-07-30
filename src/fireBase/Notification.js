import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { onMessageListener, requestForToken } from "./firebaseConfig";
import { X } from "react-feather";
import bellIcon from "../assets/images/icons/dashBoard/Group 5996.svg";
import { useQueryClient } from "@tanstack/react-query";
import "../assets/scss/viewCommon.scss";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast((t) => <ToastDisplay t={t} />);

  function ToastDisplay(props) {
    return (
      <div className="notify-pop-up-wrapper">
        <div className="d-flex justify-content-between align-items-center notification-container">
          <div>
            <img src={bellIcon} className="me-1" width={30} />
          </div>
          <div className="notify-content-box w-100">
            <div className="notification-title">{notification?.title}</div>
            <div className="notification-content">{notification?.body}</div>
          </div>
          <X
            className="ms-1 cursor-pointer"
            onClick={() => toast.dismiss(props.t.id)}
          />
        </div>
      </div>
    );
  }

  const queryClient = useQueryClient();

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload) => {
      queryClient.invalidateQueries(["notificationMessagePing"]);
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
};

export default Notification;
