import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
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
  currentPage,
  currentExpenseFilter,
  financeReport,
  subPermission,
  allPermissions,
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
  const history = useHistory();
  const columns = [
    {
      title: t("categories_serial_number"),
      dataIndex: "id",
      width: 180,
      fixed: "left",
    },
    {
      title: t("news_label_Title"),
      dataIndex: "title",
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
      render: (date) => {
        const formattedDate = moment(date)
          .local()
          .format("DD MMM YYYY");
    
        return formattedDate;
      },
    },
    {
      title: t("dashboard_Recent_DonorAmount"),
      dataIndex: "amount",
      width: 200,
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
      title: t("Actions"),
      dataIndex: "action",
      fixed:"right"
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
      date: moment(item?.expenseDate).utcOffset(0).format("DD MMM YYYY"),
      amount: `₹${item?.amount.toLocaleString("en-IN")}`,
      createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
      expenseType: item?.expenseType
        ? ConverFirstLatterToCapital(item?.expenseType?.toLowerCase() ?? "")
        : "-",
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
                  history.push(
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
        className="donationListTable"
        columns={columns}
        dataSource={categoriesList}
        rowKey="_Id"
      />
    </div>
  );
}
