// PaymentModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';

export const PaymentModal = ({ isOpen, onClose, onSave, bookingId }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      onClose();
    });
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
      <Form form={form} layout="vertical">
        <Form.Item name="mode" label="Mode" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="online">Online</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="transactionId" label="Transaction ID">
          <Input />
        </Form.Item>
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