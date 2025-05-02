import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../assets/scss/common.scss";
import { Form, Modal, Input, Select, Row, Col } from "antd";
import { Button } from "reactstrap";
import {
  fundTransfer,
  getAllAccounts,
  getFundTransfer,
} from "../../../api/profileApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import FundTransferTable from "../../../components/accounts/transfer/fundTransferTable";
const { TextArea } = Input;
const { Option } = Select;

function TransferList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState("fund_transfer"); // default
  const [filterTransfer, setFilterTransfer] = useState("");
  const handleOpen = () => {
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({ type: "fund_transfer" });
    setTransactionType("fund_transfer"); // default stays
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          await fundTransfer(values);

          const successMessage =
            values.transactionType === "fund_transfer"
              ? t("Fund Transfer successful")
              : t("Bank Transfer successful");

          Swal.fire({
            icon: "success",
            title: successMessage,
            showConfirmButton: false,
            timer: 1500,
          });

          setIsModalOpen(false);
          form.resetFields();
          queryClient.invalidateQueries("FundTransfer"); // uncomment if needed
        } catch (error) {
          console.error("Failed:", error);

          Swal.fire({
            icon: "error",
            title: t("Transfer Failed"),
            text: error?.message || t("Something went wrong"),
          });
        }
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const { data } = useQuery(["Accounts"], () => getAllAccounts(), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching member data:", error);
    },
  });

  const allAccounts = useMemo(() => data?.result ?? [], [data]);

  const assetAccounts = allAccounts.filter(
    (acc) =>
      acc.type === "asset" &&
      (acc.subType === "bank" || acc.subType === "petty_cash")
  );

  const bankAccounts = allAccounts.filter(
    (acc) =>
      acc.type === "asset" && acc.subType === "bank" && acc.isSystem !== true
  );
  //**get all fund transfer */
  const { data: fundData } = useQuery(
    ["FundTransfer", pagination.page, pagination.limit, filterTransfer],
    () =>
      getFundTransfer({
        ...pagination,
        transactionType: filterTransfer,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );
  const allFundTransferList = useMemo(() => fundData?.data ?? [], [fundData]);
  const totalItems = fundData?.data?.total ?? 0;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span className="commonFont">{t("Transactions")}</span>
        </div>
        <div className="ms-1 mb-1 d-flex">
          <div className="me-1" id="accountsListDrop">
            <Select
              style={{ width: 150, height: "38px" }}
              placeholder="Select Type"
              onChange={(value) => {
                setFilterTransfer(value);
              }}
              value={filterTransfer}
            >
              <Option key="all" value="">
                All
              </Option>
              <Option key="fundTransfer" value="fund_transfer">
                Fund Transfer
              </Option>
              <Option key="bankTransfer" value="bank_interest">
                Bank Interest
              </Option>
            </Select>
          </div>
          <Button
            color="primary"
            className="secondaryAction-btn"
            style={{ height: "38px" }}
            onClick={handleOpen}
          >
            Add Transaction
          </Button>

          <Modal
            title="Add Transaction"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Save"
          >
            <Form layout="vertical" form={form}>
              <Form.Item
                label="Transaction Type"
                name="type"
                rules={[{ required: true, message: "Please select a type" }]}
              >
                <Select
                  placeholder="Select Type"
                  onChange={(val) => setTransactionType(val)}
                >
                  <Option value="fund_transfer">Fund Transfer</Option>
                  <Option value="bank_interest">Bank Interest</Option>
                </Select>
              </Form.Item>

              {/* Fund Transfer Fields */}
              {transactionType === "fund_transfer" && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="From Account"
                      name="fromAccountId"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Select placeholder="Select From Account">
                        {assetAccounts.map((acc) => (
                          <Option key={acc.id} value={acc.id}>
                            {acc.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="To Account"
                      name="toAccountId"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Select placeholder="Select To Account">
                        {assetAccounts.map((acc) => (
                          <Option key={acc.id} value={acc.id}>
                            {acc.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* Bank Transfer Field */}
              {transactionType === "bank_interest" && (
                <Form.Item
                  label="Account"
                  name="account"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Select Account">
                    {bankAccounts.map((acc) => (
                      <Option key={acc.id} value={acc.id}>
                        {acc.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please enter amount" }]}
              >
                <Input type="number" placeholder="Enter Amount" />
              </Form.Item>
              <Form.Item label="Remark" name="narration">
                <TextArea placeholder="Enter Remark" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div>
        <FundTransferTable
          data={allFundTransferList}
          totalItems={totalItems}
          currentPage={pagination.page}
          pageSize={pagination.limit}
          onChangePage={(page) => setPagination((prev) => ({ ...prev, page }))}
          onChangePageSize={(pageSize) =>
            setPagination((prev) => ({
              ...prev,
              limit: pageSize,
              page: 1,
            }))
          }
        />
      </div>
    </div>
  );
}

export default TransferList;
