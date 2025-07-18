import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteCategoryDetail } from "../../api/categoryApi";
import { deleteExpensesDetail } from "../../api/expenseApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import "../../assets/scss/common.scss";
import { Table } from "antd";

export function ExpensesListTable({
  data,
  page,
  currentFilter,
  currentExpenseFilter,
  financeReport,
  subPermission,
  allPermissions,
  expenseTotalItem,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const handleDeleteExpenses = async (payload) => {
    return deleteExpensesDetail(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteExpenses,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Expenses"]);
      }
    },
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = [
    {
      title: t("news_label_Title"),
      dataIndex: "title",
      fixed: "left",
      width: 200,
    },
    {
      title: t("expence_description"),
      dataIndex: "description",
      width: 300,
    },
    {
      title: t("expenses_Date"),
      dataIndex: "date",
      width: 200,
    },
    {
      title: t("dashboard_Recent_DonorAmount"),
      dataIndex: "amount",
      width: 200,
    },
    {
      title: t("Payment_Mode"),
      dataIndex: "paymentMode",
      width: 200,
      render: (value) => {
        if (value === "bankAccount") return t("Bank Account");
        if (value === "cash") return t("Cash");
        return "-";
      },
    },
    
    {
      title: t("dashboard_Recent_DonorType"),
      dataIndex: "expenseType",
      width: 200,
    },
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      width: 200,
    },
    {
      title: t("action"),
      dataIndex: "action",
      fixed: "right",
      width: 100,
    },
  ];
  const categoriesList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item?.id,
      // id: `0${idx + 1}`,
      id:
        item?.serialNumber > 9 ? item?.serialNumber : `0${item?.serialNumber}`,
      title: ConverFirstLatterToCapital(item.title),
      description: (
        <div
          className="d-flex tableDes"
          dangerouslySetInnerHTML={{ __html: he?.decode(item.description) }}
        />
      ),
      // description:item?.description ?? "" ,
      date: moment(item?.expenseDate).format("DD MMM YYYY"),
      amount: `₹${item?.amount.toLocaleString("en-IN")}`,
      createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
      expenseType: item?.expenseType
        ? ConverFirstLatterToCapital(item?.expenseType?.toLowerCase() ?? "")
        : "-",
        paymentMode: item?.paymentMode ?? "-",
      action: (
        <div className="d-flex justify-content-center">
          {allPermissions?.name === "all" ||
          subPermission?.includes(EDIT) ||
          financeReport ? (
            <img
              src={editIcon}
              width={35}
              className={financeReport ? "d-none" : "cursor-pointer mr-2"}
              onClick={() => {
                if (!financeReport) {
                  navigate(
                    `/internal_expenses/edit/${item.id}?page=${currentPage}&expenseType=${currentExpenseFilter}&filter=${currentFilter}`
                  );
                }
              }}
              alt="Edit"
            />
          ) : null}

          {allPermissions?.name === "all" ||
          subPermission?.includes(DELETE) ||
          financeReport ? (
            <img
              src={deleteIcon}
              width={35}
              className={financeReport ? "d-none" : "cursor-pointer"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!financeReport) {
                  Swal.fire({
                    title: `<img src="${confirmationIcon}"/>`,
                    html: `
                    <h3 class="swal-heading">${t("expence_delete")}</h3>
                    <p>${t("expence_sure")}</p>
                  `,
                    showCloseButton: false,
                    showCancelButton: true,
                    confirmButtonText: `${t("confirm")}`,
                    cancelButtonText: `${t("cancel")}`,
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      deleteMutation.mutate(item.id);
                    }
                  });
                }
              }}
              alt="Delete"
            />
          ) : null}
        </div>
      ),
    }));
  }, [data]);

  return (
    <div className="recentdonationtablewrapper">
      {/* <CustomDataTable maxHeight={""} columns={columns} data={categoriesList} /> */}
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={categoriesList}
        rowKey="_Id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: expenseTotalItem,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
      />
    </div>
  );
}
