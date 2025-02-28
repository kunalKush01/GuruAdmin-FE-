import React from 'react';
import { Button } from 'antd';
import { useMessage } from '../../utility/context/MessageContext';

export const MessageStatus = () => {
  const { isConnected, status, qrCode, handleDisconnect } = useMessage();
  
  const statusText = typeof status === 'string' ? status : 'Status unavailable';
  
  return (
    <div className="d-flex flex-column align-items-start mb-4">
      <div className="d-flex align-items-center mb-2">
        <span 
          className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}
          style={{
            padding: '4px 12px',
            borderRadius: '4px',
            marginRight: '12px',
            backgroundColor: isConnected ? '#f6ffed' : '#fff1f0',
            color: isConnected ? '#52c41a' : '#ff4d4f',
            border: `1px solid ${isConnected ? '#b7eb8f' : '#ffa39e'}`
          }}
        >
          {statusText}
        </span>
        {isConnected && (
          <Button type="primary" danger onClick={handleDisconnect}>
            Disconnect
          </Button>
        )}
      </div>

      {qrCode && !isConnected && (
        <div className="mt-3 mb-3">
          <img 
            src={qrCode} 
            alt="QR Code" 
            style={{
              maxWidth: '200px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
    </div>
  );
};