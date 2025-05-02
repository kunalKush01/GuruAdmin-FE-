import React, { useMemo, useState } from "react";
import AccountsTable from "../../components/accounts/accountsTable";
import { Trans, useTranslation } from "react-i18next";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/common.scss";
import { Form, Modal, Input, Radio, Select, Switch, Row, Col } from "antd";
import { Button } from "reactstrap";
import { createAccount, getAllAccounts } from "../../api/profileApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
function AccountList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { data } = useQuery(
    ["Accounts", pagination.page, pagination.limit],
    () =>
      getAllAccounts({
        ...pagination,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );
  const accountsItem = useMemo(() => data?.result ?? [], [data]);
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
      .then(async (values) => {
        try {
          await createAccount(values);
          queryClient.invalidateQueries("Accounts");
          Swal.fire({
            icon: "success",
            title: t("Account Create successfully"),
            showConfirmButton: false,
            timer: 1500,
          });
          setIsModalOpen(false);
          form.resetFields();
          // Optionally: refetch account list if needed
        } catch (error) {
          console.error("Failed to create account:", error);
          Swal.fire({
            icon: "error",
            title: t("Failed to create account"),
            text: err?.message || t("Something went wrong"),
          });
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          {/* <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            //   onClick={() => setShowHistory(false)}
          /> */}
          <span className="commonFont">{t("Chart of Accounts")}</span>
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
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Account Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter account name",
                        },
                      ]}
                    >
                      <Input placeholder="Enter Name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="code"
                      label="Code"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Input type="number" placeholder="Enter code" />
                    </Form.Item>
                  </Col>
                  {/* <Col span={12}>
                    <Form.Item label="Bank Name" name="bankName">
                      <Input />
                    </Form.Item>
                  </Col> */}
                  <Col span={12}>
                    <Form.Item
                      name="type"
                      label="Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select account type",
                        },
                      ]}
                    >
                      <Select placeholder="Select Type">
                        <Option value="asset">Asset</Option>
                        <Option value="income">Income</Option>
                        <Option value="expense">Expense</Option>
                        {/* <Option value="liability">Liability</Option> */}
                        <Option value="equity">Equity</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="subType"
                      label="Sub Type"
                      rules={[
                        { required: true, message: "Please select sub type" },
                      ]}
                    >
                      {/* <Input placeholder="Enter Sub type" /> */}

                      <Select placeholder="Select Sub Type">
                        <Option value="bank">Bank</Option>
                        <Option value="petty_cash">Petty Cash</Option>
                        {/* <Option value="cash_handler">Cash Handler</Option>
                        <Option value="receivable">Receivable</Option>
                        <Option value="payable">Payable</Option> */}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="isBankAccount"
                      label="Is Bank Account"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
      <div className="">
        <AccountsTable
          data={accountsItem}
          // totalItems={data ? data.totalResults : 0}
          // pageSize={pagination.limit}
          // onChangePage={(page) => {
          //   setPagination((prev) => ({ ...prev, page }));
          // }}
          // onChangePageSize={(pageSize) => {
          //   setPagination((prev) => ({
          //     ...prev,
          //     limit: pageSize,
          //     page: 1,
          //   }));
          // }}
        />
      </div>
    </div>
  );
}

export default AccountList;
