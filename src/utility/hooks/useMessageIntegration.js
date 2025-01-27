import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useQueryClient } from "@tanstack/react-query";
import { useMessageWorker } from './useMessageWorker';

export const useMessageIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Not connected');
  const [qrCode, setQrCode] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [sendingMessages, setSendingMessages] = useState({});
  const [isPollingActive, setIsPollingActive] = useState(false);
  const messageWorker = useMessageWorker();
  const queryClient = useQueryClient();

  const updateConnection = useCallback((connected) => {
    setIsConnected(connected);
    messageWorker.updateConnectionStatus(connected);
  }, [messageWorker]);

  const checkConnectionStatus = useCallback(async () => {
    if (!isPollingActive) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MESSAGE_SERVICE_URL}/get-qr`,
        { withCredentials: true }
      );
      
      if (response.data.status === 'logged_in') {
        updateConnection(true);
        setLoggedInUser(response.data.user);
        setQrCode(null);
        setStatus(`Connected as ${response.data.user}`);
      } else if (response.data.status === 'qr') {
        updateConnection(false);
        setQrCode(response.data.qr);
        setLoggedInUser(null);
        setStatus('Scan QR code to connect');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus('Connection error');
      updateConnection(false);
    }
  }, [isPollingActive, updateConnection]);

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
      
      const result = await messageWorker.sendMessage(messageData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      await queryClient.invalidateQueries('messages');
      return true;
    } finally {
      setSendingMessages(prev => ({ ...prev, [messageData.key]: false }));
    }
  };

  const sendMultipleMessages = async (messages) => {
    if (!isConnected) {
      throw new Error('Not connected');
    }

    messages.forEach(message => {
      setSendingMessages(prev => ({ ...prev, [message.key]: true }));
    });

    try {
      messageWorker.sendMultipleMessages(messages);
      await queryClient.invalidateQueries('messages');
    } finally {
      messages.forEach(message => {
        setSendingMessages(prev => ({ ...prev, [message.key]: false }));
      });
    }
  };

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
    messageWorker
  };
};