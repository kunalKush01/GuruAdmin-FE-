import React, { useMemo, useState } from "react";
import AccountsTable from "../../components/accounts/accountsTable";
import { Trans, useTranslation } from "react-i18next";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/common.scss";
import { Form, Modal, Input, Radio } from "antd";
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
                  name="type"
                  // rules={[
                  //   { required: true, message: "Please select account type" },
                  // ]}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <label className="typeLabel">Type:</label>
                    <Radio.Group>
                      <Radio value="asset">Asset</Radio>
                      <Radio value="income">Income</Radio>
                      <Radio value="expense">Expense</Radio>
                    </Radio.Group>
                  </div>
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
