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

export function CategoryListTable({ data }) {
  const handleDeleteCategory = async (payload) => {
    return deleteCategoryDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCategory,
    onSuccess: (data) => {
      console.log("dataError=", data.error);
      if (!data.error) {
        console.log("invaldating");
        queryCient.invalidateQueries(["Categories"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("categories_serial_number"),
      selector: (row) => row.id,
      width:"200px",
      style: {
        font: "normal normal bold 10px/20px noto sans !important ",
      },
    },
    {
      name: t("categories_master_category"),
      selector: (row) => row.masterCategory,
      width:"220px",
    },
    {
      name: t("categories_sub_category"),
      selector: (row) => row.subCategory,
      width:"675px"
    },

    {
      name: "",
      selector: (row) => row.addLanguage,
      width:"250px"
    },
    {
      name: "",
      selector: (row) => row.editCategory,
      width:"120px"
    },
    {
      name: "",
      selector: (row) => row.deleteCategory,
    },
  ];

  const categoriesList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      masterCategory: item.masterCategory.name,
      subCategory: item.name,
      addLanguage: (
        <Button
          outline
          onClick={() =>
            history.push(`/configuration/categories/add-language/${item.id}`)
          }
          color="primary"
          style={{ padding: "5px 20px" }}
        >
          {"Add Language"}
        </Button>
      ),
      editCategory: (
        <img
          src={editIcon}
          width={35}
          onClick={() =>
            history.push(`/configuration/categories/edit/${item.id}`)
          }
        />
      ),
      deleteCategory: (
        <img
          src={deleteIcon}
          width={35}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Swal.fire("Oops...", "Something went wrong!", "error");
            Swal.fire({
              title: `<img src="${comfromationIcon}"/>`,
              html: `
                                  <h3 class="swal-heading">Delete Category</h3>
                                  <p>Are you sure you want to permanently delete the selected category ?</p>
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
