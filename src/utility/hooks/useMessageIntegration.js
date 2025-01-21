import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useQueryClient } from "@tanstack/react-query";

export const useMessageIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Not connected');
  const [qrCode, setQrCode] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [sendingMessages, setSendingMessages] = useState({});
  const [isPollingActive, setIsPollingActive] = useState(false);
  const queryClient = useQueryClient();

  const checkConnectionStatus = useCallback(async () => {
    if (!isPollingActive) return;

    try {
      const axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true  
      };
      
      const response = await axios.get(
        `${process.env.REACT_APP_MESSAGE_SERVICE_URL}/get-qr`, 
        axiosConfig
      );
      
      if (response.data.status === 'logged_in') {
        setIsConnected(true);
        setLoggedInUser(response.data.user);
        setQrCode(null);
        setStatus(`Connected as ${response.data.user}`);
      } else if (response.data.status === 'qr') {
        setIsConnected(false);
        setQrCode(response.data.qr);
        setLoggedInUser(null);
        setStatus('Scan QR code to connect');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus('Connection error');
      setIsConnected(false);
    }
  }, [isPollingActive]);

  const startConnection = () => {
    setIsPollingActive(true);
    setStatus('Initializing connection...');
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
      setStatus('Disconnected');
      setIsPollingActive(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
      setStatus('Disconnect error');
    }
  };

  const sendMessage = async (messageData) => {
    if (!isConnected) {
      throw new Error('Not connected');
    }

    try {
      setSendingMessages(prev => ({ ...prev, [messageData.key]: true }));
      
      await axios.post(
        `${process.env.REACT_APP_MESSAGE_SERVICE_URL}/send-message`,
        {
          number: messageData.destination,
          message: messageData.msgBody,
          variables: messageData.variables || {}
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      await queryClient.invalidateQueries('messages');
      return true;
    } finally {
      setSendingMessages(prev => ({ ...prev, [messageData.key]: false }));
    }
  };

  useEffect(() => {
    let interval;
    
    if (isPollingActive) {
      // Initial check when polling starts
      checkConnectionStatus();
      
      // Set up interval for periodic checks
      interval = setInterval(checkConnectionStatus, 10000);
    }

    // Cleanup on unmount or when polling is stopped
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
    sendingMessages,
    startConnection,
    isPollingActive
  };
};