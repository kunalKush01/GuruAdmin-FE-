import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Checkbox } from "antd";
import "../../assets/scss/viewCommon.scss";

export const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  totalDue,
  isEditing,
  security,
  fromDate,
}) => {
  const [form] = Form.useForm();
  const [paymentMode, setPaymentMode] = useState("cash");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      form.setFieldsValue({ mode: "cash", checkIn: false });
      if (isEditing && Math.abs(totalDue) === security) {
        form.setFieldsValue({ amount: "" });
      } else {
        form.setFieldsValue({ amount: totalDue });
      }
      setPaymentMode("cash");
      setIsSaveDisabled(
        !totalDue && !isEditing && !form.getFieldValue("checkIn")
      );

      const today = new Date().toLocaleDateString("en-CA");
      setShowCheckIn(fromDate === today);
    }
  }, [isOpen, form, totalDue, isEditing, security, fromDate]);

  const handleFormChange = (changedValues, allValues) => {
    const { amount, checkIn } = allValues;
    // Enable the Save button if the amount is filled or "Check-In" is selected
    setIsSaveDisabled(!amount && !checkIn && !isEditing);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const formData = {
        ...values,
        status: values.checkIn ? "checked-in" : "",
      };
      onSave(formData);
      onClose();
    });
  };

  const handleModeChange = (value) => {
    setPaymentMode(value);
    if (value !== "online") {
      form.setFieldsValue({ transactionId: undefined });
    }
  };

  return (
    <Modal
      title="Collect/Refund Payment"
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
          className={isSaveDisabled ? "blur-button" : ""}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ mode: "cash", amount: totalDue }}
        onValuesChange={handleFormChange}
      >
        <Form.Item name="mode" label="Mode" rules={[{ required: true }]}>
          <Select onChange={handleModeChange} placeholder="Select payment mode">
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="online">Online</Select.Option>
          </Select>
        </Form.Item>
        {paymentMode === "online" && (
          <Form.Item
            name="transactionId"
            label="Transaction ID"
            rules={[
              {
                required: true,
                message: "Transaction ID is required when paying online.",
              },
            ]}
          >
            <Input placeholder="Enter transaction ID" />
          </Form.Item>
        )}
        <Form.Item
          name="amount"
          label="Amount"
          rules={
            isEditing
              ? []
              : [
                  { required: true, message: "Amount is required." },
                  {
                    type: "number",
                    min: 0,
                    message: "Amount must be positive.",
                  },
                ]
          }
        >
          <Input
            type="number"
            placeholder="Enter amount"
            min={0}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Prevents negative numbers
            }}
          />{" "}
        </Form.Item>
        <Form.Item name="remark" label="Remark">
          <Input.TextArea placeholder="Enter remark" />
        </Form.Item>
        {showCheckIn && (
          <Form.Item name="checkIn" valuePropName="checked" className="mb-0">
            <Checkbox>Check-In</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
