import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import "../../assets/scss/viewCommon.scss";

export const PaymentModal = ({ isOpen, onClose, onSave, totalDue, isEditing, security }) => {
  const [form] = Form.useForm();
  const [paymentMode, setPaymentMode] = useState('cash');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); 

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      form.setFieldsValue({ mode: 'cash' });
      if (isEditing && Math.abs(totalDue) === security) {
        form.setFieldsValue({ amount: '' });
      } else {
        form.setFieldsValue({ amount: totalDue });
      }
      setPaymentMode('cash');
      setIsSaveDisabled(!totalDue && !isEditing); 
    }
  }, [isOpen, form, totalDue, isEditing, security]);

  const handleFormChange = (changedValues) => {
    const amount = changedValues.amount;
    setIsSaveDisabled(!amount && !isEditing); 
  };

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
        <Button 
          key="save" 
          type="primary" 
          onClick={handleSave} 
          disabled={isSaveDisabled} 
          className={isSaveDisabled ? 'blur-button' : ''} 
        >
          Save
        </Button>,
      ]}
    >
      <Form 
        form={form} 
        layout="vertical" 
        initialValues={{ mode: 'cash', amount: totalDue }}
        onValuesChange={handleFormChange} 
      >
        <Form.Item
          name="mode"
          label="Mode"
          rules={[{ required: true }]}
        >
          <Select
            onChange={handleModeChange}
            placeholder="Select payment mode"
          >
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
            <Input placeholder="Enter transaction ID" />
          </Form.Item>
        )}
        <Form.Item
          name="amount"
          label="Amount"
          rules={isEditing ? [] : [{ required: true, message: 'Amount is required.' }]}
        >
          <Input type="number" placeholder="Enter amount" />
        </Form.Item>
        <Form.Item name="remark" label="Remark">
          <Input.TextArea placeholder="Enter remark" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
