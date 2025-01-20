import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import { Button, Row, Col, Card, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../../components/partials/customTextField';
import deleteIcon from '../../assets/images/icons/category/deleteIcon.svg';
import axios from 'axios';
import { listMessages } from '../../api/messageApi';
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MessageIntegration = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Not connected');
  const [qrCode, setQrCode] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const [filters, setFilters] = useState({
    status: "pending",
    // type: null,
    sortKey: 'createdAt',
    sortOrder: 'DESC'
  });
  const transformMessageData = (response) => {
    console.log('Raw API Response:', response);
    
    if (!response?.results || !Array.isArray(response.results)) {
      console.log('No results found in response');
      return [];
    }
    
    const transformedData = response.results.map(message => ({
      key: message._id,
      ...message
    }));
    
    console.log('Transformed Data:', transformedData);
    return transformedData;
  };

  const messagesQuery = useQuery(
    [
      'messages',
      pagination.page,
      pagination.limit,
      filters.status,
      filters.type,
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

  useEffect(() => {
    const interval = setInterval(() => {
      checkConnectionStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
        setStatus(t('Connected as {user}', { user: response.data.user }));
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
      await axios.post(`${process.env.REACT_APP_MESSAGE_SERVICE_URL}/disconnect`);
      setIsConnected(false);
      setLoggedInUser(null);
      setQrCode(null);
      setStatus(t('Disconnected. Please scan QR code to connect again'));
    } catch (error) {
      console.error('Disconnect failed:', error);
      setStatus(t('Disconnect error'));
    }
  };

  const handleSendMessages = async (messages) => {
    if (!isConnected) {
      setStatus(t('Please connect first'));
      return;
    }

    for (const message of messages) {
      if (message.number && message.message) {
        try {
          await axios.post(`${process.env.REACT_APP_MESSAGE_SERVICE_URL}/send-message`, {
            number: message.number,
            message: message.message
          });
          message.status = 'sent';
        } catch (error) {
          console.error('Failed to send message:', error);
          message.status = 'failed';
        }
      }
    }
  };

  const columns = [
    {
      title: t('mobile_number'),
      dataIndex: 'destination',
      key: 'destination'
    },
    {
      title: t('message'),
      dataIndex: 'msgBody',
      key: 'msgBody'
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: t('variables'),
      dataIndex: 'variables',
      key: 'variables',
      render: (variables) => (
        <div>
          {Object.entries(variables || {}).map(([key, value]) => (
            <div key={key}>{`${key}: ${value}`}</div>
          ))}
        </div>
      )
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status.toLowerCase()}`}>
          {t(status)}
        </span>
      )
    },
    {
      title: t('created_at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
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
            {isConnected ? (
              <Button type="primary" danger onClick={handleDisconnect}>
                {t('Disconnect')}
              </Button>
            ) : null}
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

        <Formik
          initialValues={{
            rows: [
              { id: Date.now(), number: '', message: '', status: 'pending' }
            ]
          }}
          onSubmit={(values) => {
            handleSendMessages(values.rows);
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {/* ... existing form code ... */}
              {values.rows.map((row, index) => (
                <div key={row.id} style={{ marginBottom: '20px' }}>
                  <Row gutter={16}>
                    {/* ... existing row code ... */}
                  </Row>
                </div>
              ))}

              <Button
                className="me-1"
                type="primary"
                onClick={() => {
                  const newRow = {
                    id: Date.now(),
                    number: '',
                    message: '',
                    status: 'pending'
                  };
                  setFieldValue('rows', [...values.rows, newRow]);
                }}
                style={{ marginRight: '10px' }}
              >
                {t('Add Row')}
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                disabled={!isConnected}
              >
                {t('Send Messages')}
              </Button>
            </form>
          )}
        </Formik>
      </Card>

      {/* Message List Card */}
      <Card title={t('Message List')}>
        <Table
          columns={columns}
          dataSource={messagesQuery.data}
          loading={messagesQuery.isLoading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: messagesQuery.data?.length || 0,
            showSizeChanger: true
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default MessageIntegration;