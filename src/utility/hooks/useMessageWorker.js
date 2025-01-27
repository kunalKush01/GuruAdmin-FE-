import { useEffect, useRef, useCallback } from 'react';

export const useMessageWorker = () => {
  const workerRef = useRef(null);
  const callbacksRef = useRef(new Map());

  useEffect(() => {
    workerRef.current = new Worker(new URL('./messageWorker.js', import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      
      if (type === 'MESSAGE_RESULT') {
        const callback = callbacksRef.current.get(payload.messageId);
        if (callback) {
          callback(payload);
          callbacksRef.current.delete(payload.messageId);
        }
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const updateConnectionStatus = useCallback((isConnected) => {
    workerRef.current.postMessage({
      type: 'SET_CONNECTION_STATUS',
      payload: { isConnected }
    });
  }, []);

  const addPendingMessages = useCallback((messages) => {
    workerRef.current.postMessage({
      type: 'ADD_PENDING_MESSAGES',
      payload: messages.map(message => ({
        ...message,
        baseUrl: process.env.REACT_APP_MESSAGE_SERVICE_URL
      }))
    });
  }, []);

  const sendMessage = useCallback((messageData) => {
    return new Promise((resolve) => {
      callbacksRef.current.set(messageData.key, resolve);
      
      workerRef.current.postMessage({
        type: 'SEND_MESSAGE',
        payload: {
          ...messageData,
          baseUrl: process.env.REACT_APP_MESSAGE_SERVICE_URL
        }
      });
    });
  }, []);

  const sendMultipleMessages = useCallback((messages) => {
    messages.forEach(message => {
      callbacksRef.current.set(message.key, () => {});
    });

    workerRef.current.postMessage({
      type: 'SEND_MULTIPLE_MESSAGES',
      payload: messages.map(message => ({
        ...message,
        baseUrl: process.env.REACT_APP_MESSAGE_SERVICE_URL
      }))
    });
  }, []);

  return {
    sendMessage,
    sendMultipleMessages,
    updateConnectionStatus,
    addPendingMessages
  };
};