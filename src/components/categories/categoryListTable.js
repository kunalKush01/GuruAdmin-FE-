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
import { ConverFirstLatterToCapital } from "../../utility/formater";

export function CategoryListTable({ data,page ,currentPage, currentFilter}) {
  const handleDeleteCategory = async (payload) => {
    return deleteCategoryDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCategory,
    onSuccess: (data) => {
      if (!data.error) {
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
        font: "normal normal 700 13px/20px noto sans !important ",
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
      width:"230px"
    },
    {
      name: "",
      selector: (row) => row.editCategory,
      // width:"120px"
    },
    {
      name: "",
      selector: (row) => row.deleteCategory,
    },
  ];


  const categoriesList = useMemo(() => {
    return data.map((item) => ({
      _Id: item.id,
      id:item?.serialNumber > 9 ? item?.serialNumber : `0${item?.serialNumber}`  ,
      masterCategory: ConverFirstLatterToCapital(item.masterCategory.name),
      subCategory: ConverFirstLatterToCapital(item.name),
      addLanguage: (
        <Button
          outline
          onClick={() =>
            history.push(`/configuration/categories/add-language/${item.id}?page=${currentPage}&filter=${currentFilter}`)
          }
          color="primary"
          style={{ padding: "5px 20px" }}
        >
          {"Add Language"}
        </Button>
      ),
      editCategory: (
        <img
          className="cursor-pointer"
          src={editIcon}
          width={35}
          onClick={() =>
            history.push(`/configuration/categories/edit/${item.id}?page=${currentPage}&filter=${currentFilter}`)
          }
        />
      ),
      deleteCategory: (
        <img
          className="cursor-pointer"
          src={deleteIcon}
          width={35}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Swal.fire("Oops...", "Something went wrong!", "error");
            Swal.fire({
              title: `<img src="${comfromationIcon}"/>`,
              html: `
                                  <h3 class="swal-heading mt-1">${t("category_delete")}</h3>
                                  <p>${t("category_sure")}</p>
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
    }));
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
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
