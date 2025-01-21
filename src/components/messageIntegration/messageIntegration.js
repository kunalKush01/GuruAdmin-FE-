import React, { useState, useContext } from 'react';
import { Button, Card, Table, message as antMessage } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { listMessages } from '../../api/messageApi';
import { MessageContext } from '../../utility/context/MessageContext';

const MessageIntegration = () => {
  const { t } = useTranslation();
  const { 
    isConnected,
    status,
    qrCode,
    handleDisconnect,
    sendMessage,
    sendingMessages,
    startConnection,
    isPollingActive
  } = useContext(MessageContext);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const [filters, setFilters] = useState({
    status: "pending",
    sortKey: 'createdAt',
    sortOrder: 'DESC'
  });

  const transformMessageData = (response) => {
    if (!response?.results || !Array.isArray(response.results)) {
      return [];
    }
    
    return response.results.map(message => ({
      key: message._id,
      ...message
    }));
  };

  const messagesQuery = useQuery(
    [
      'messages',
      pagination.page,
      pagination.limit,
      filters.status,
      filters.sortKey,
      filters.sortOrder
    ],
    () => listMessages({
      ...pagination,
      ...filters
    }),
    {
      keepPreviousData: true,
      select: transformMessageData
    }
  );

  const handleSendSingleMessage = async (record) => {
    if (!isConnected) {
      antMessage.error(t('Please connect first'));
      return;
    }

    try {
      await sendMessage(record);
      antMessage.success(t('Message sent successfully'));
    } catch (error) {
      console.error('Failed to send message:', error);
      antMessage.error(t('Failed to send message'));
    }
  };

  const handleSendSelectedMessages = async () => {
    if (!isConnected) {
      antMessage.error(t('Please connect first'));
      return;
    }

    if (selectedRowKeys.length === 0) {
      antMessage.warning(t('Please select messages to send'));
      return;
    }

    const selectedMessages = messagesQuery.data.filter(msg => 
      selectedRowKeys.includes(msg.key) && msg.status === 'pending'
    );

    let successCount = 0;
    let failCount = 0;

    for (const message of selectedMessages) {
      try {
        await sendMessage(message);
        successCount++;
      } catch (error) {
        console.error('Failed to send message:', error);
        failCount++;
      }
    }

    setSelectedRowKeys([]);

    if (successCount > 0) {
      antMessage.success(t('{count} messages sent successfully', { count: successCount }));
    }
    if (failCount > 0) {
      antMessage.error(t('Failed to send {count} messages', { count: failCount }));
    }
  };

  const columns = [
    {
      title: t('Mobile Number'),
      dataIndex: 'destination',
      key: 'destination'
    },
    {
      title: t('Message'),
      dataIndex: 'msgBody',
      key: 'msgBody',
      width: '30%',
      render: (text) => (
        <div style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      )
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: t('Variables'),
      dataIndex: 'variables',
      key: 'variables',
      render: (variables) => (
        <div style={{ maxHeight: '100px', overflow: 'auto' }}>
          {Object.entries(variables || {}).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
        </div>
      )
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status.toLowerCase()}`}>
          {t(status)}
        </span>
      )
    },
    {
      title: t('Created At'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          loading={sendingMessages[record.key]}
          disabled={!isConnected || record.status !== 'pending'}
          onClick={() => handleSendSingleMessage(record)}
        >
          {t('Send')}
        </Button>
      )
    }
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      page: pagination.current,
      limit: pagination.pageSize
    });

    setFilters(prev => ({
      ...prev,
      sortKey: sorter.field || 'createdAt',
      sortOrder: sorter.order ? sorter.order.replace('end', '') : 'desc'
    }));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status !== 'pending',
    }),
  };

  return (
    <div className="d-flex flex-column gap-4">
      <Card title={t('Message Integration')}>
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
              {status}
            </span>
            {!isConnected && !isPollingActive && (
              <Button type="primary" onClick={startConnection}>
                {t('Connect')}
              </Button>
            )}
            {isConnected && (
              <Button type="primary" danger onClick={handleDisconnect}>
                {t('Disconnect')}
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
      </Card>

      <Card 
        title={t('Message List')}
        extra={
          <Button
            type="primary"
            onClick={handleSendSelectedMessages}
            disabled={!isConnected || selectedRowKeys.length === 0}
            loading={Object.values(sendingMessages).some(Boolean)}
          >
            {t('Send Selected Messages')}
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={messagesQuery.data}
          loading={messagesQuery.isLoading}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: messagesQuery.data?.length || 0,
            showSizeChanger: true
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default MessageIntegration;