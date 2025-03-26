import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageWorker } from "./useMessageWorker";
import { useTranslation } from "react-i18next";

export const useMessageIntegration = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Not connected");
  const [qrCode, setQrCode] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [sendingMessages, setSendingMessages] = useState({});
  const [isPollingActive, setIsPollingActive] = useState(false);
  const messageWorker = useMessageWorker();
  const queryClient = useQueryClient();

  const updateConnection = useCallback(
    (connected, user = null) => {
      setIsConnected(connected);
      messageWorker.updateConnectionStatus(connected);

      if (connected && user) {
        localStorage.setItem(
          "connectorStatus",
          JSON.stringify({
            isConnected: true,
            user,
            timestamp: Date.now(),
          })
        );
      }
    },
    [messageWorker]
  );

  const checkConnectionStatus = useCallback(async () => {
    if (!isPollingActive) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MESSAGE_SERVICE_URL}/get-qr`,
        { withCredentials: true }
      );

      if (response.data.status === "logged_in") {
        updateConnection(true, response.data.user);
        setLoggedInUser(response.data.user);
        setQrCode(null);
        setStatus(`Connected as ${response.data.user}`);
      } else if (response.data.status === "qr") {
        updateConnection(false);
        setQrCode(response.data.qr);
        setLoggedInUser(null);
        setStatus("Scan QR code to connect");
        localStorage.removeItem("connectorStatus");
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      setStatus(t("Connection_Error"));
      updateConnection(false);
      localStorage.removeItem("connectorStatus");
    }
  }, [isPollingActive, updateConnection]);

  const startConnection = () => {
    setIsPollingActive(true);
    setStatus(t("Initializing_Connection"));
  };

  const handleDisconnect = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_MESSAGE_SERVICE_URL}/disconnect`,
        {},
        { withCredentials: true }
      );
      setIsConnected(false);
      setLoggedInUser(null);
      setQrCode(null);
      setStatus("Disconnected");
      setIsPollingActive(false);

      localStorage.removeItem("connectorStatus");
    } catch (error) {
      console.error("Disconnect failed:", error);
      setStatus("Disconnect error");
    }
  };

  const sendMessage = async (messageData) => {
    if (!isConnected) {
      throw new Error("Not connected");
    }

    try {
      setSendingMessages((prev) => ({ ...prev, [messageData.key]: true }));

      const result = await messageWorker.sendMessage(messageData);

      if (!result.success) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries("messages");
      return true;
    } finally {
      setSendingMessages((prev) => ({ ...prev, [messageData.key]: false }));
    }
  };

  const sendMultipleMessages = async (messages) => {
    if (!isConnected) {
      throw new Error("Not connected");
    }

    messages.forEach((message) => {
      setSendingMessages((prev) => ({ ...prev, [message.key]: true }));
    });

    try {
      messageWorker.sendMultipleMessages(messages);
      await queryClient.invalidateQueries("messages");
    } finally {
      messages.forEach((message) => {
        setSendingMessages((prev) => ({ ...prev, [message.key]: false }));
      });
    }
  };

  useEffect(() => {
    const savedStatus = localStorage.getItem("connectorStatus");
    if (savedStatus) {
      try {
        const {
          isConnected: savedConnected,
          user,
          timestamp,
        } = JSON.parse(savedStatus);

        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;

        if (!isExpired && savedConnected) {
          setIsPollingActive(true);
          setStatus(`Restoring connection as ${user}...`);
          setLoggedInUser(user);
        } else {
          localStorage.removeItem("connectorStatus");
        }
      } catch (error) {
        console.error("Failed to parse saved connector status", error);
        localStorage.removeItem("connectorStatus");
      }
    }
  }, []);

  useEffect(() => {
    let interval;

    if (isPollingActive) {
      checkConnectionStatus();

      interval = setInterval(checkConnectionStatus, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [checkConnectionStatus, isPollingActive]);

  return {
    isConnected,
    status,
    qrCode,
    loggedInUser,
    handleDisconnect,
    sendMessage,
    sendMultipleMessages,
    sendingMessages,
    startConnection,
    isPollingActive,
    messageWorker,
  };
};
