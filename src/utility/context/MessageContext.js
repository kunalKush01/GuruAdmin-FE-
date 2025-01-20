import React, { createContext, useContext } from 'react';
import { useMessageConnection } from '../../utility/hooks/useMessageConnection';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const connection = useMessageConnection();
  
  return (
    <MessageContext.Provider value={connection}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
