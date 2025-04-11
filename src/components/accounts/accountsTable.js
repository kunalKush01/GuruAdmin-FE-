import { Table, Modal, Form, Input, message } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import "../../assets/scss/common.scss";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { deleteAccount, updateAccount } from "../../api/profileApi";
import { useQueryClient } from "@tanstack/react-query";

function AccountsTable({ data }) {
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

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const id = selectedRow?.id || selectedRow?._id;

      await updateAccount(values, id);
      queryClient.invalidateQueries("Accounts");
      Swal.fire({
        icon: "success",
        title: t("Updated successfully"),
        showConfirmButton: false,
        timer: 1500,
      });

      setEditModalVisible(false);
    } catch (err) {
      console.error("Validation/API Error:", err);

      Swal.fire({
        icon: "error",
        title: t("Update failed"),
        text: err?.message || t("Something went wrong"),
      });
    }
  };

  const columns = [
    {
      title: "Account Holder Name",
      dataIndex: "accountHolderName",
      key: "accountHolderName",
      fixed: "left",
      width: 100,
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 100,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      width: 100,
    },
    {
      title: "IFSC Code",
      dataIndex: "ifsc",
      key: "ifsc",
      width: 100,
    },
    {
      title: t("action"),
      key: "action",
      width: 50,
      fixed: "right",
      render: (text, record) => (
        <div className="d-flex gap-1">
          <img
            src={editIcon}
            alt="View"
            className="cursor-pointer"
            width={35}
            onClick={() => handleEdit(record)}
          />
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer"
            alt="Edit"
            onClick={() => handleDelete(record)}
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
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="accountHolderName"
            label={t("Account Holder Name")}
            rules={[{ required: true, message: t("Please enter name") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="accountNumber" label={t("Account Number")}>
            <Input />
          </Form.Item>
          <Form.Item name="bankName" label={t("Bank Name")}>
            <Input />
          </Form.Item>
          <Form.Item name="ifsc" label={t("IFSC Code")}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AccountsTable;
