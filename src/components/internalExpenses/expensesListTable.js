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
import he from "he"

export function ExpensesListTable({ data }) {
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

  const columns = [
    {
      name: t("categories_serial_number"),
      selector: (row) => row.id,
      style: {
        font: "normal normal bold 10px/20px noto sans !important ",
      },
    },
    {
      name: t("news_label_Title"),
      selector: (row) => row.title,
    },
    {
      name: t("expence_description"),
      selector: (row) => row.description,
    },

    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.dateTime,
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
    },
    {
        name: t(""),
        selector: (row) => row.edit,
      },
    {
      name: "",
      selector: (row) => row.delete,
    },
  ];

  const categoriesList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      title: item.title,
      description:<div dangerouslySetInnerHTML={{__html:he.decode(item.description)}} /> ,
      dateTime:item.expenseDate,
        amount:`₹${item.amount}`,
      edit: (
        <img
          src={editIcon}
          width={35}
          className="cursor-pointer"
          onClick={() =>
            history.push(`/internal_expenses/edit/${item.id}`)
          }
        />
      ),
      delete: (
        <img
          src={deleteIcon}
          width={35}
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Swal.fire("Oops...", "Something went wrong!", "error");
            Swal.fire({
              title: `<img src="${comfromationIcon}"/>`,
              html: `
                                  <h3 class="swal-heading">Delete Expense</h3>
                                  <p>Are you sure you want to permanently delete the selected expense ?</p>
                                  `,
              showCloseButton: false,
              showCancelButton: true,
              focusConfirm: true,
              cancelButtonText: "Cancel",
              cancelButtonAriaLabel: "Cancel",

              confirmButtonText: "Confirm Delete",
              confirmButtonAriaLabel: "Confirm",
            }).then(async (result) => {
              if (result.isConfirmed) {
                deleteMutation.mutate(item.id);
              }
            });
          }}
        />
      ),
    }));
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;
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
