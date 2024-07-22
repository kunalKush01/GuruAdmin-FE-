import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteCattleBreed } from "../../../api/cattle/cattleBreed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import Swal from "sweetalert2";
import "../../../assets/scss/viewCommon.scss";
const CattleBreedTable = ({ data = [], maxHeight, height, toggle }) => {
  const { t } = useTranslation();

  const handleDeleteCattleBreed = async (payload) => {
    return deleteCattleBreed(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCattleBreed,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleBreedList"]);
      }
    },
  });

  const columns = [
    {
      name: t("name"),
      selector: (row) => row.name,
      width: "20%",
    },
    {
      name: t("category"),
      selector: (row) => row.category,
      width: "67%",
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

  const BreedList = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        category: ConverFirstLatterToCapital(
          item?.cattleCategoryId?.name ?? " - "
        ),
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => toggle({ addBreed: false, ...item })}
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
                                        "cattle_breed_delete"
                                      )}</h3>
                                      <p>${t("cattle_breed_sure")}</p>
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
    <div className="cattlebreedtablewrapper">
      <CustomDataTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={BreedList}
      />
    </div>
  );
};

export default CattleBreedTable;
