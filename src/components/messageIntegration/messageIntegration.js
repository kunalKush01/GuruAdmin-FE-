import React, { useState, useContext, useEffect } from 'react';
import { Button, Card, Table, message as antMessage, Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMessages, updateMessage, deleteMessage, createMessage } from '../../api/messageApi';
import { MessageContext } from '../../utility/context/MessageContext';
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import GroupMessageModal from './groupMessageModal';
import { UsergroupAddOutlined, ImportOutlined } from '@ant-design/icons';
import ImportForm from '../../views/donation/importForm';
import '../../assets/scss/viewCommon.scss';

const MessageIntegration = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [form] = Form.useForm();
  const [groupMessageVisible, setGroupMessageVisible] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sendingGroupMessage, setSendingGroupMessage] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [importModalVisible, setImportModalVisible] = useState(false);
const [showImportHistory, setShowImportHistory] = useState(false);

  const handleGroupSelection = (groups) => {
    setSelectedGroups(groups);
  };

  const messageMappedFields = [
    { label: 'Mobile No', value: 'mobile' },
    { label: 'Message', value: 'message' },
    { label: 'Variable 1', value: 'var1' },
    { label: 'Variable 2', value: 'var2' },
    { label: 'Variable 3', value: 'var3' },
    { label: 'Variable 4', value: 'var4' },
    { label: 'Variable 5', value: 'var5' }
  ];
  
  const { 
    isConnected,
    status,
    qrCode,
    handleDisconnect,
    startConnection,
    isPollingActive,
    messageWorker
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
  console.log('Raw response:', response);
  
  if (!response?.results || !Array.isArray(response.results)) {
    console.log('No results found or invalid format');
    return {
      data: [],
      total: 0
    };
  }
  
  const transformed = {
    data: response.results.map(message => ({
      key: message._id,
      ...message
    })),
    total: response.totalResults
  };
  
  console.log('Transformed data:', transformed);
  return transformed;
};

const handleGroupSelect = (group) => {
  setSelectedGroups(prev => 
    prev.includes(group) 
      ? prev.filter(g => g !== group)
      : prev.length < 5 
        ? [...prev, group] 
        : prev
  );
};

const handleSendGroupMessage = async () => {
  setSendingGroupMessage(true);
  try {
    const file = fileList[0];
    let fileData = null;

    if (file) {
      fileData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    }

    const messagePromises = selectedGroups.map(groupId => {
      const messagePayload = {
        destination: groupId,
        msgBody: messageText,
        type: 'group', 
        variables: {},
        status: 'pending',
        ...(fileData && { attachment: fileData })
      };
      return createMessage(messagePayload);
    });

    await Promise.all(messagePromises);
    
    antMessage.success(t('Messages created successfully'));
    queryClient.invalidateQueries('messages');
    
    setGroupMessageVisible(false);
    setSelectedGroups([]);
    setMessageText('');
    setFileList([]);
  } catch (error) {
    antMessage.error(t('Failed to create messages'));
    console.error('Create messages failed:', error);
  } finally {
    setSendingGroupMessage(false);
  }
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

  const updateMessageMutation = useMutation(
    ({ messageId, payload }) => updateMessage(messageId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
        antMessage.success(t('Message updated successfully'));
        setEditModalVisible(false);
      },
      onError: (error) => {
        antMessage.error(t('Failed to update message'));
        console.error('Update failed:', error);
      }
    }
  );

  const deleteMessageMutation = useMutation(
    (messageId) => deleteMessage(messageId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('messages');
        antMessage.success(t('Message deleted successfully'));
      },
      onError: (error) => {
        antMessage.error(t('Failed to delete message'));
        console.error('Delete failed:', error);
      }
    }
  );

  const handleEdit = (record) => {
    setEditingMessage(record);
    form.setFieldsValue({
      msgBody: record.msgBody,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (messageId) => {
    Modal.confirm({
      title: t('Delete Message'),
      content: t('Are you sure you want to delete this message?'),
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: () => deleteMessageMutation.mutate(messageId)
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateMessageMutation.mutateAsync({
        messageId: editingMessage.key,
        payload: {
          msgBody: values.msgBody,
          variables: editingMessage.variables || {},
          status: 'pending'
        }
      });
    } catch (error) {
      antMessage.error(t('Failed to update message'));
    }
  };

  useEffect(() => {
    if (isConnected && messagesQuery.data?.data) {
      const pendingMessages = messagesQuery.data.data.filter(msg => msg.status === 'pending');
      if (pendingMessages.length > 0) {
        messageWorker.addPendingMessages(pendingMessages);
      }
    }
  }, [isConnected, messagesQuery.data, messageWorker]);

  useEffect(() => {
    messageWorker.updateConnectionStatus(isConnected);
  }, [isConnected, messageWorker]);

  // Add this after your messagesQuery definition to debug
useEffect(() => {
  console.log('Query state:', {
    data: messagesQuery.data,
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    error: messagesQuery.error
  });
}, [messagesQuery.data, messagesQuery.isLoading, messagesQuery.isError]);

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
    // {
    //   title: t('Type'),
    //   dataIndex: 'type',
    //   key: 'type'
    // },
    // {
    //   title: t('Variables'),
    //   dataIndex: 'variables',
    //   key: 'variables',
    //   render: (variables) => (
    //     <div style={{ maxHeight: '100px', overflow: 'auto' }}>
    //       {Object.entries(variables || {}).map(([key, value]) => (
    //         <div key={key}>{`${key}: ${value}`}</div>
    //       ))}
    //     </div>
    //   )
    // },
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
        <div className="d-flex gap-2">
          <img
            src={editIcon}
            alt="Edit"
            className="cursor-pointer"
            onClick={() => handleEdit(record)}
            style={{ width: '20px', height: '20px' }}
          />
          <img
            src={deleteIcon}
            alt="Delete"
            className="cursor-pointer"
            onClick={() => handleDelete(record.key)}
            style={{ width: '20px', height: '20px' }}
          />
        </div>
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
        <div className="message-integration">
          <div className="d-flex flex-column align-items-start mb-4">
            <div className="d-flex align-items-center mb-2">
              <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'} connection-status`}>
                {status}
              </span>
              {!isConnected && !isPollingActive && (
                <Button type="primary" onClick={startConnection}>
                  {t('Connect with Connector App')}
                </Button>
              )}
              {isConnected && (
                <Button type="primary" danger onClick={handleDisconnect}>
                  {t('Disconnect')}
                </Button>
              )}
            </div>

            {qrCode && !isConnected && (
              <div>
                <img 
                  src={qrCode} 
                  alt="QR Code"
                  className="qr-code" 
                />
              </div>
            )}
            
            <div className="action-buttons">
              <Button 
                type="primary"
                icon={<UsergroupAddOutlined />}
                onClick={() => setGroupMessageVisible(true)}
              >
                {t('Group Send')}
              </Button>
              <Button 
                icon={<ImportOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                {t('Import')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card title={t('Message List')}>
        <div className="message-list">
          <Table
            columns={columns}
            dataSource={messagesQuery.data?.data}
            loading={messagesQuery.isLoading}
            rowSelection={rowSelection}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: messagesQuery.data?.total || 0,
              showSizeChanger: true
            }}
            onChange={handleTableChange}
            scroll={{ x: true }}
            onRow={(record) => {
              console.log('Row record:', record);
              return {};
            }}
          />
        </div>
      </Card>

      <Modal
        title={t('Edit Message')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item
            name="msgBody"
            label={t('Message')}
            rules={[{ required: true, message: t('Please input message body') }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div className="d-flex justify-content-end gap-2">
            <Button onClick={() => setEditModalVisible(false)}>
              {t('Cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMessageMutation.isLoading}
            >
              {t('Save')}
            </Button>
          </div>
        </Form>
      </Modal>

      <GroupMessageModal
        visible={groupMessageVisible}
        onCancel={() => {
          setGroupMessageVisible(false);
          setSelectedGroups([]);
          setMessageText('');
          setFileList([]); 
        }}
        onSend={handleSendGroupMessage}
        selectedGroups={selectedGroups}
        onGroupSelect={handleGroupSelection}
        messageText={messageText}
        onMessageChange={setMessageText}
        loading={sendingGroupMessage}
        fileList={fileList}
        setFileList={setFileList}
      />

      <ImportForm
        open={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        tab="Message"
        setShowHistory={setShowImportHistory}
        mappedField={messageMappedFields}
      />
    </div>
  );
};

export default MessageIntegration;