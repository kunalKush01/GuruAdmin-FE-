import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteCattleCategory } from "../../../api/cattle/cattleCategory";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import "../../../assets/scss/viewCommon.scss";
const CattleCategoryTable = ({ data = [], maxHeight, height, toggle }) => {
  const { t } = useTranslation();

  const handleDeleteCattleCategory = async (payload) => {
    return deleteCattleCategory(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCattleCategory,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleCategoryList"]);
      }
    },
  });

  const columns = [
    {
      name: t("name"),
      selector: (row) => row.name,
      width: "87%",
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      width: "80px",
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
    },
  ];

  const CattleCategoryList = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => toggle({ addCattleCategory: false, ...item })}
          />
        ),
        delete: (
          // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
                cancelButtonText: ` ${t("cancel")}`,
                cancelButtonAriaLabel: ` ${t("cancel")}`,

                confirmButtonText: ` ${t("confirm")}`,
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate(item._id);
                }
              });
            }}
          />
        ),
      };
    });
  }, [data]);

  return (
    <div className="cattlecategorytablewrapper">
      <CustomDataTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={CattleCategoryList}
      />
    </div>
  );
};

export default CattleCategoryTable;
