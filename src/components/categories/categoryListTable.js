import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteCategoryDetail } from "../../api/categoryApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import '../../../src/styles/common.scss';

const CategoryTableWarapper = styled.div``;
;

export function CategoryListTable({
  data,
  page,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
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
      width: "200px",
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
    },
    {
      name: t("name"),
      selector: (row) => row.subCategory,
      width: "220px",
    },
    {
      name: t("categories_master_category"),
      selector: (row) => row.masterCategory,

      width:
        window.screen.width < "700"
          ? "250px"
          : window.screen.width > "700" && window.screen.width < "900"
          ? "350px"
          : window.screen.width > "900" && window.screen.width < "1200"
          ? "675px"
          : window.screen.width > "1200" && window.screen.width < "1450"
          ? "675px"
          : "675px",
    },

    {
      name: "",
      selector: (row) => row.addLanguage,
      width: "230px",
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

  const langList = useSelector((state) => state.auth.availableLang);

  const categoriesList = useMemo(() => {
    return data.map((item) => ({
      _Id: item.id,
      id:
        item?.serialNumber > 9 ? item?.serialNumber : `0${item?.serialNumber}`,
      masterCategory: ConverFirstLatterToCapital(item.masterCategory.name),
      subCategory: ConverFirstLatterToCapital(item.name),
      addLanguage:
        allPermissions?.name === "all" || subPermission?.includes(WRITE) ? (
          <Button
            outline
            className={
              langList?.length === item?.languages?.length &&
              "opacity-50 disabled"
            }
            onClick={() =>
              history.push(
                `/configuration/categories/add-language/${item.id}?page=${currentPage}&filter=${currentFilter}`
              )
            }
            color="primary"
            style={{ padding: "5px 20px" }}
          >
            {"Add Language"}
          </Button>
        ) : (
          ""
        ),
      editCategory:
        allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
          <img
            className="cursor-pointer"
            src={editIcon}
            width={35}
            onClick={() =>
              history.push(
                `/configuration/categories/edit/${item.id}?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
        ) : (
          ""
        ),
      deleteCategory:
        allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <img
            className="cursor-pointer"
            src={deleteIcon}
            width={35}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Swal.fire("Oops...", "Something went wrong!", "error");
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
                html: `
                                  <h3 class="swal-heading mt-1">${t(
                                    "category_delete"
                                  )}</h3>
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
        ) : (
          ""
        ),
    }));
  }, [data]);

  return (
    <div className="categorytablewarapper">
      <CustomDataTable
        // minWidth="fit-content"
        maxHeight={""}
        columns={columns}
        data={categoriesList}
      />
    </div>
  );
}
