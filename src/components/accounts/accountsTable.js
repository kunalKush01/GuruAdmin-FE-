import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Radio,
  Row,
  Col,
  Select,
  Switch,
} from "antd";
import React, { useState, useEffect, useMemo } from "react";
import "../../assets/scss/common.scss";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import lockIcon from "../../assets/images/icons/lock.svg";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { deleteAccount, updateAccount } from "../../api/profileApi";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ConverFirstLatterToCapital } from "../../utility/formater";

function AccountsTable({ data }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleEdit = (record) => {
    setSelectedRow(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (record) => {
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("Yes, delete it!"),
    });

    if (result.isConfirmed) {
      try {
        await deleteAccount(record.id);
        queryClient.invalidateQueries("Accounts");
        Swal.fire({
          title: t("Deleted!"),
          text: t("Your account has been deleted."),
          icon: "success",
        });
      } catch (err) {
        Swal.fire({
          title: t("Error"),
          text: t("Failed to delete account."),
          icon: "error",
        });
      }
    }
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then(async (values) => {
        const id = selectedRow?.id || selectedRow?._id;

        try {
          await updateAccount(values, id);
          queryClient.invalidateQueries("Accounts");

          Swal.fire({
            icon: "success",
            title: t("Updated successfully"),
            showConfirmButton: false,
            timer: 1500,
          });

          setEditModalVisible(false);
        } catch (error) {
          console.error("API Error:", error);

          Swal.fire({
            icon: "error",
            title: t("Update failed"),
            text: error?.message || t("Something went wrong"),
          });
        }
      })
      .catch((validationError) => {
        console.log("Validation Failed:", validationError);
        // Optional: Highlight fields or show a toast
      });
  };
  const formatSubType = (subType) => {
    if (!subType) return "";
    return subType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      fixed: "left",
      width: 30,
    },
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (text, record) => (
        <span className="d-flex align-items-center">
          {record.isSystem && (
            <img src={lockIcon} width={20} style={{ marginRight: 6 }} />
          )}
          {text}{" "}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => ConverFirstLatterToCapital(text),
      width: 100,
    },
    {
      title: "Sub Type",
      dataIndex: "subType",
      key: "subType",
      width: 100,
      render: (text) => formatSubType(text),
    },
    {
      title: t("action"),
      key: "action",
      width: 50,
      fixed: "right",
      render: (text, record) => (
        <div className="d-flex gap-1">
          <img
            src={eyeIcon}
            className="cursor-pointer"
            width={25}
            onClick={() => navigate(`/accounts/${record.id}`)}
          />
          <img
            src={editIcon}
            className="cursor-pointer"
            width={35}
            style={{
              opacity: record.isEditable ? 1 : 0.5,
              pointerEvents: record.isEditable ? "auto" : "none",
            }}
            onClick={() => record.isEditable && handleEdit(record)}
          />
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer"
            style={{
              opacity: record.isDeleted ? 1 : 0.5,
              pointerEvents: record.isDeleted ? "auto" : "none",
            }}
            onClick={() => record.isDeleted && handleDelete(record)}
          />
        </div>
      ),
    },
  ];
  const dataSource = data?.map((item) => ({
    ...item,
    key: item.id || item._id,
  }));

  return (
    <div className="">
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        pagination={
          {
            //   current: currentPage,
            //   pageSize: pageSize,
            //   total: totalItems,
            //   onChange: onChangePage,
            //   onShowSizeChange: (current, size) => onChangePageSize(size),
            //   showSizeChanger: true,
          }
        }
        bordered
      />
      <Modal
        title={t("Edit Account")}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdate}
        okText={t("Update")}
        cancelText={t("Cancel")}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
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
                <Input placeholder="Enter name" />
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
            {/* 
            <Col span={12}>
              <Form.Item label="Bank Name" name="bankName">
                <Input placeholder="Enter bank name" />
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
                  <Select.Option value="asset">Asset</Select.Option>
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                  {/* <Select.Option value="liability">Liability</Select.Option> */}
                  <Select.Option value="equity">Equity</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="subType"
                label="Sub Type"
                rules={[{ required: true, message: "Please select sub type" }]}
              >
                {/* <Input placeholder="Enter Sub type" /> */}

                <Select placeholder="Select Sub Type">
                  <Select.Option value="bank">Bank</Select.Option>
                  <Select.Option value="petty_cash">Petty Cash</Select.Option>
                  {/* <Select.Option value="cash_handler">
                    Cash Handler
                  </Select.Option>
                  <Select.Option value="receivable">Receivable</Select.Option>
                  <Select.Option value="payable">Payable</Select.Option> */}
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
  );
}

export default AccountsTable;
