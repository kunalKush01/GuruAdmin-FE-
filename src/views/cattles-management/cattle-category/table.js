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
import { Table } from "antd";
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
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 30,
    },
  ];

  const CattleCategoryList = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        action: (
          <div>
            <img
              src={editIcon}
              width={35}
              className="cursor-pointer "
              onClick={() => toggle({ addCattleCategory: false, ...item })}
            />
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
          </div>
        ),
      };
    });
  }, [data]);

  return (
    <div className="cattlecategorytablewrapper">
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={CattleCategoryList}
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
};

export default CattleCategoryTable;
