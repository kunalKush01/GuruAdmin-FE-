import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';

export const PaymentModal = ({ isOpen, onClose, onSave, bookingId }) => {
  const [form] = Form.useForm();
  const [paymentMode, setPaymentMode] = useState('cash');

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ mode: 'cash' });
      setPaymentMode('cash');
    }
  }, [isOpen, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      onClose();
    });
  };

  const handleModeChange = (value) => {
    setPaymentMode(value);
    if (value !== 'online') {
      form.setFieldsValue({ transactionId: undefined });
    }
  };

  return (
    <Modal
      title="Collect Payment"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ mode: 'cash' }}>
        <Form.Item name="mode" label="Mode" rules={[{ required: true }]}>
          <Select onChange={handleModeChange}>
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="online">Online</Select.Option>
          </Select>
        </Form.Item>
        {paymentMode === 'online' && (
          <Form.Item
            name="transactionId"
            label="Transaction ID"
            rules={[{ required: true, message: 'Transaction ID is required when paying online.' }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="remark" label="Remark">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};