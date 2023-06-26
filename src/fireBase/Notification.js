import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { onMessageListener, requestForToken } from "./firebaseConfig";
import { X } from "react-feather";
import styled from "styled-components";
import bellIcon from "../assets/images/icons/dashBoard/Group 5996.svg";
import { useQueryClient } from "@tanstack/react-query";
const NotifyPopUpWarapper = styled.div`
  font: normal normal normal 12px/20px noto Sans;
  .notifyContentBox {
    border-right: 1px solid black;
  }
  .notificationTitle {
    font: normal normal 600 16px/33px noto Sans;
  }
  .notification-container {
    min-width: 300px;
  }
  .notificationContent {
   display: -webkit-box;
   max-width: 220px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  }
`;

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  // const notify = () =>  toast(<ToastDisplay/>);
  const notify = () => toast((t) => <ToastDisplay t={t} />);

  function ToastDisplay(props) {
    return (
      <NotifyPopUpWarapper>
        <div className="d-flex justify-content-between align-items-center notification-container">
          <div>
            <img src={bellIcon} className="me-1" width={30} />
          </div>
          <div className="notifyContentBox w-100">
            <div className="notificationTitle">{notification?.title}</div>
            <div className="notificationContent">{notification?.body}</div>
          </div>
          <X className="ms-1 cursor-pointer" onClick={() => toast.dismiss(props.t.id)} />
        </div>
      </NotifyPopUpWarapper>
    );
  }

  const queryClient = useQueryClient()

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload) => {
      queryClient.invalidateQueries(["notificationMessagePing"])
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
};

export default Notification;
