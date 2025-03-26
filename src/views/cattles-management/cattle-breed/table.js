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
import { Table } from "antd";
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
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 30,
      fixed: "right",
    },
  ];

  const BreedList = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        category: ConverFirstLatterToCapital(
          item?.category?.name ?? " - "
        ),
        action: (
          <div>
            <img
              src={editIcon}
              width={35}
              className="cursor-pointer "
              onClick={() => toggle({ addBreed: false, ...item })}
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
          </div>
        ),
      };
    });
  }, [data]);

  return (
    <div className="cattlebreedtablewrapper">
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={BreedList}
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

export default CattleBreedTable;
