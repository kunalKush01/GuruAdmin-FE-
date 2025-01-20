import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const useMessageConnection = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Not connected');
  const [qrCode, setQrCode] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const checkConnectionStatus = async () => {
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
        // Ensure status is a string
        setStatus(response.data.user ? t('Connected as {user}', { user: String(response.data.user) }) : t('Connected'));
      } else if (response.data.status === 'qr') {
        setIsConnected(false);
        setQrCode(response.data.qr);
        setLoggedInUser(null);
        setStatus(t('Scan QR code to connect'));
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus(t('Connection error'));
      setIsConnected(false);
    }
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
      setStatus(t('Disconnected. Please scan QR code to connect again'));
    } catch (error) {
      console.error('Disconnect failed:', error);
      setStatus(t('Disconnect error'));
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    status: String(status), // Ensure status is always a string
    qrCode,
    loggedInUser: loggedInUser ? String(loggedInUser) : null,
    handleDisconnect,
    checkConnectionStatus
  };
};