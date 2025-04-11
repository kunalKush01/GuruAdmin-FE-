import React, { useState } from "react";
import AccountsTable from "../../components/accounts/accountsTable";
import { Trans, useTranslation } from "react-i18next";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/common.scss";
import {  Form, Modal, Input } from "antd";
import { Button } from "reactstrap";
function AccountList() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Payload:", values);
        // TODO: Submit this payload [to] backend
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            //   onClick={() => setShowHistory(false)}
          />
          <span className="commonFont">{t("Accounts")}</span>
        </div>
        <div>
          <div className="ms-1 mb-1">
            <Button
              color="primary"
              className="secondaryAction-btn"
              style={{ height: "38px" }}
              onClick={handleOpen}
            >
              Add Accounts
            </Button>
            <Modal
              title="Add Accounts"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Save"
            >
              <Form layout="vertical" form={form}>
                <Form.Item
                  label="Account Name"
                  name="accountHolderName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter account holder name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Account Number"
                  name="accountNumber"
                  // rules={[
                  //   { required: true, message: "Please enter account number" },
                  // ]}
                >
                  <Input maxLength={20} />
                </Form.Item>

                <Form.Item
                  label="Bank Name"
                  name="bankName"
                  // rules={[
                  //   { required: true, message: "Please enter bank name" },
                  // ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="IFSC Code"
                  name="ifsc"
                  // rules={[
                  //   { required: true, message: "Please enter IFSC code" },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
      <div className="">
        <AccountsTable />
      </div>
    </div>
  );
}

export default AccountList;
