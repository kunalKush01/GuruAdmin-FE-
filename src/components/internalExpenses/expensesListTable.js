import { useTranslation, Trans } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { deleteCategoryDetail } from "../../api/categoryApi";
import { deleteExpensesDetail } from "../../api/expenseApi";
import he from "he";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";

export function ExpensesListTable({
  data,
  page,
  currentFilter,
  currentPage,
  financeReport,
}) {
  const handleDeleteExpenses = async (payload) => {
    return deleteExpensesDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteExpenses,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Expenses"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  let columns = [
    {
      name: t("categories_serial_number"),
      selector: (row) => row.id,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
      width: "180px",
    },
    {
      name: t("news_label_Title"),
      selector: (row) => row.title,
      width: "230px",
    },
    {
      name: t("expence_description"),
      selector: (row) => row.description,
      width: "300px",
    },

    {
      name: t("expenses_Date"),
      selector: (row) => row.date,
      width: "200px",
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      width: "200px",
    },

    {
      name: t(""),
      center: true,
      selector: (row) => row.edit,
    },
    {
      name: "",
      center: true,
      selector: (row) => row.delete,
    },
  ];

  if (financeReport) {
    columns = [
      ...columns,
      {
        name: "",
        center: true,
        selector: (row) => row.viewLogs,
      },
    ];
  }
  const categoriesList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      // id: `0${idx + 1}`,
      id:
        idx > 8 || page.page != 1
          ? `${(page.page - 1) * page.limit + idx + 1}`
          : `0${(page.page - 1) * page.limit + idx + 1}`,
      title: ConverFirstLatterToCapital(item.title),
      description: (
        <div
          className=" d-flex tableDes"
          dangerouslySetInnerHTML={{ __html: he.decode(item.description) }}
        />
      ),
      // description:item?.description ?? "" ,
      date: moment(item?.expenseDate).utcOffset(0).format("DD MMM YYYY"),
      amount: `₹${item.amount}`,
      edit: (
        <img
          src={editIcon}
          width={35}
          className={
            financeReport ? "cursor-disabled opacity-50" : "cursor-pointer "
          }
          onClick={() => {
            financeReport
              ? ""
              : history.push(
                  `/internal_expenses/edit/${item.id}?page=${currentPage}&filter=${currentFilter}`
                );
          }}
        />
      ),
      delete: (
        <img
          src={deleteIcon}
          width={35}
          className={
            financeReport ? "cursor-disabled opacity-50" : "cursor-pointer "
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Swal.fire("Oops...", "Something went wrong!", "error");
            financeReport
              ? ""
              : Swal.fire({
                  title: `<img src="${comfromationIcon}"/>`,
                  html: `
                                  <h3 class="swal-heading">${t(
                                    "expence_delete"
                                  )}</h3>
                                  <p>${t("expence_sure")}</p>
                                  `,
                  showCloseButton: false,
                  showCancelButton: true,
                  focusConfirm: true,
                  cancelButtonText: `${t("cancel")}`,
                  cancelButtonAriaLabel: `${t("cancel")}`,

                  confirmButtonText: `${t("confirm")}`,
                  confirmButtonAriaLabel: "Confirm",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    deleteMutation.mutate(item.id);
                  }
                });
          }}
        />
      ),
      viewLogs: (
        <div
          className={`cursor-pointer viewLogs ${
            financeReport ? "d-block" : "d-none"
          }`}
          onClick={() =>
            history.push(`/financial_reports/Expenses/Logs/${item.id}`, item.id)
          }
        >
          <Trans i18nKey={"viewLogs"} />
        </div>
      ),
    }));
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    /* margin-right: 20px; */
    font: normal normal bold 15px/23px Noto Sans;
    .tableDes p {
      margin-bottom: 0;
    }
    .viewLogs {
      font: normal normal bold 15px/33px Noto Sans;
      color: #ff8744;
    }
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={categoriesList}
      />
    </RecentDonationTableWarper>
  );
}
