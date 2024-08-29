import { Table, Button, Space, Modal, Input, Form, DatePicker } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSuspense,
  deleteSuspense,
  updateSuspense,
} from "../../api/suspenseApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import Swal from "sweetalert2";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { useTranslation } from "react-i18next";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
function SuspenseListTable({ success }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    ["suspenseData", currentPage, pageSize],
    () => getAllSuspense(currentPage, pageSize),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching suspense data:", error);
      },
    }
  );
  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(["suspenseData"]);
    }
  }, [success, queryClient]);
  const deleteMutation = useMutation(deleteSuspense, {
    onSuccess: () => {
      queryClient.invalidateQueries(["suspenseData"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateMutation = useMutation(updateSuspense, {
    onSuccess: () => {
      queryClient.invalidateQueries(["suspenseData"]);
      form.resetFields();
      setIsEditModalVisible(false);
    },
    onError: (error) => {
      console.log(`Error updating record: ${error.message}`);
    },
  });

  const handleDelete = (record) => {
    Swal.fire({
      title: `<img src="${confirmationIcon}" alt="Confirmation"/>`,
      html: `
          <h3 class="swal-heading mt-1">${t("suspense_delete")}</h3>
          <p>${t("suspense_sure")}</p>
        `,
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: true,
      cancelButtonText: t("cancel"),
      cancelButtonAriaLabel: t("cancel"),
      confirmButtonText: t("confirm"),
      confirmButtonAriaLabel: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(record._id);
      }
    });
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      ...record,
      transactionDate: record.transactionDate
        ? moment(record.transactionDate)
        : null,
    });
  };

  const handleEditSubmit = (values) => {
    const utcDateTime = moment(values.transactionDate).utc().format();

    updateMutation.mutate({
      id: editingRecord._id,
      updatedData: {
        ...values,
        transactionDate: utcDateTime,
      },
    });
  };

  const columns = [
    {
      title: t("transactionDate"),
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY HH:mm") : "-"),
      // fixed:"left",
    },
    {
      title: t("bankNarration"),
      dataIndex: "bankNarration",
      key: "bankNarration",
    },
    {
      title: t("suspense_amount"),
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: t("suspense_mode_of_payment"),
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (text, record) => (
        <Space>
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => handleEdit(record)}
          />
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const tableData = data?.result || [];
  const totalItems = data?.total || 0;

  return (
    <>
      <Table
        className="donationListTable"
        columns={columns}
        dataSource={tableData}
        rowKey={(record) => record._id}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        scroll={{ x: 1000, y: 400 }}
        sticky={{ offsetHeader: 64 }}
        bordered
      />

      {/* Edit Modal */}
      <Modal
        title={t("edit_suspense_record")}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        centered
      >
        <Form
          form={form} // Attach form instance
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item
            label={t("transactionDate")}
            name="transactionDate"
            rules={[
              {
                required: true,
                message: t("req_transactionDate"),
              },
            ]}
          >
            <CustomDatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            label={t("bankNarration")}
            name="bankNarration"
            rules={[{ required: true, message: t("req_bankNarration") }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label={t("suspense_amount")}
            name="amount"
            rules={[{ required: true, message: t("req_ammount") }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label={t("suspense_mode_of_payment")}
            name="modeOfPayment"
            rules={[{ required: true, message: t("req_modeofPayment") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SuspenseListTable;
