import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Form,
  DatePicker,
  Select,
  Tooltip,
  Radio,
  Flex,
} from "antd";
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
import exchangeIcon from "../../assets/images/icons/account-donation.svg";
import Swal from "sweetalert2";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import moveToExpense from "../../assets/images/icons/moveToExpense.svg";
import { useTranslation } from "react-i18next";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { useHistory } from "react-router-dom";
const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
function SuspenseListTable({
  success,
  filterData,
  type,
  accountId,
  setSelectedRowKeys = [],
  selectedRowKeys,
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const history = useHistory();
  const [categoryTypeName, setCategoryTypeName] = useState(t("All"));
  const [subCategoryTypeName, setSubCategoryTypeName] = useState(t("All"));
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [activeTab, setActiveTab] = useState("Donation");
  const { data, isLoading } = useQuery(
    ["suspenseData", currentPage, pageSize, filterData, accountId],
    () =>
      getAllSuspense({
        page: currentPage,
        limit: pageSize,
        search: "",
        sortKey: "createdAt",
        sortOrder: "DESC",
        ...(filterData && filterData && { advancedSearch: filterData }),
        ...(accountId && { accountId }), // ✅ include accountId in request payload
      }),
    {
      keepPreviousData: true,
      enabled: type == "Suspense",
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
  const [transactionType, setTransactionType] = useState("credit");

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditModalVisible(true);
    const isCredit =
      record?.creditedAmount !== null && record?.creditedAmount !== undefined;

    setTransactionType(isCredit ? "credit" : "debit");
    form.setFieldsValue({
      ...record,
      amount: isCredit ? record.creditedAmount : record.debitedAmount,
      transactionDate: record.transactionDate
        ? moment(record.transactionDate)
        : null,
    });
  };
  const handleEditSubmit = (values) => {
    const utcDateTime = moment(values.transactionDate).utc().format();

    const payload = {
      transactionDate: utcDateTime,
      bankNarration: values.bankNarration,
      modeOfPayment: values.modeOfPayment,
      creditedAmount:
        transactionType === "credit" ? Number(values.amount) : null,
      debitedAmount: transactionType === "debit" ? Number(values.amount) : null,
      accountId: accountId,
    };

    updateMutation.mutate({
      id: editingRecord._id,
      updatedData: payload,
    });
  };

  const handleDonorMapped = (record) => {
    const params = new URLSearchParams({
      page: pagination.page,
      category: categoryTypeName,
      subCategory: subCategoryTypeName,
      filter: dropDownName,
      type: activeTab,
      dateTime: record.transactionDate,
      remark: record.bankNarration,
      amount: record.creditedAmount,
      sId: record._id,
      donorMapped: record.donorMapped,
      modeOfPayment: record.modeOfPayment,
    }).toString();
    history.push({
      pathname: "/donation/edit",
      search: `?${params}`,
      state: {
        record: {},
        isEdit: true,
        isFieldDisable: false,
      },
    });
  };
  const handleExpenseMapped = (record) => {
    const params = new URLSearchParams({
      page: pagination.page,
      expenseType: categoryTypeName,
      filter: dropDownName,
    }).toString();
    history.push({
      pathname: "/internal_expenses/add",
      search: `?${params}`,
      state: {
        isEdit: true,
        isFieldDisable: false,
        dateTime: record?.transactionDate ?? "",
        remark: record?.bankNarration ?? "",
        amount: record?.debitedAmount ?? "",
        sId: record?._id ?? "",
        donorMapped: record?.donorMapped ?? "",
        modeOfPayment: record?.modeOfPayment ?? "",
      },
    });
  };

  const columns = [
    {
      title: t("transactionDate"),
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY HH:mm") : "-"),
      width: 180,
      fixed: "left",
    },
    {
      title: t("bankNarration"),
      dataIndex: "bankNarration",
      key: "bankNarration",
      render: (text) => <div className="">{text}</div>,
      width: 400,
    },
    {
      title: t("suspense_credit"),
      dataIndex: "creditedAmount",
      key: "creditedAmount",
      width: 150,
    },
    {
      title: t("suspense_debit"),
      dataIndex: "debitedAmount",
      key: "debitedAmount",
      width: 150,
    },
    {
      title: t("suspense_mode_of_payment"),
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      render: (text) =>
        text ? text : <span className="d-flex justify-content-center">-</span>,
      width: 150,
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      width: 150,
      render: (text, record) => {
        const hasCredited =
          record?.creditedAmount !== null &&
          record?.creditedAmount !== undefined;
        const hasDebited =
          record?.debitedAmount !== null && record?.debitedAmount !== undefined;

        return (
          <Space>
            <Tooltip
              title="Move to Donation"
              color="#FF8744"
              disabled={hasDebited} // Disable tooltip when disabled
            >
              <img
                src={exchangeIcon}
                width={20}
                className={`cursor-pointer ${
                  hasDebited ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!hasDebited) handleDonorMapped(record);
                }}
              />
            </Tooltip>

            <Tooltip
              title="Move to Expense"
              color="#FF8744"
              disabled={hasCredited}
            >
              <img
                src={moveToExpense}
                width={20}
                className={`cursor-pointer ${
                  hasCredited ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!hasCredited) handleExpenseMapped(record);
                }}
              />
            </Tooltip>

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
        );
      },
    },
  ];
  const modeOfPaymentOptions = [
    { value: "", label: t("select_option") },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "online", label: "Online" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];
  const tableData = data?.result?.filter((item) => !item.donorMapped) ?? [];
  const totalItems = data?.total ?? 0;

  //** Possible Match record logic */

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <Flex gap="middle" vertical>
        {/* <Flex align="center" gap="middle">
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex> */}

        <Table
          className="commonListTable"
          rowSelection={rowSelection}
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
      </Flex>

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
          <Form.Item label={t("transaction_type")}>
            <Radio.Group
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <Radio value="credit" style={{ color: "#533810" }}>
                {t("suspense_credit")}
              </Radio>
              <Radio value="debit" style={{ color: "#533810" }}>
                {t("suspense_debit")}
              </Radio>
            </Radio.Group>
          </Form.Item>
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
            <Select>
              {modeOfPaymentOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
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
