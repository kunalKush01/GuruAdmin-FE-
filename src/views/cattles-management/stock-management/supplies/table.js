import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { deleteSupplies } from "../../../../api/cattle/cattleStock";
import deleteIcon from "../../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { DELETE, EDIT } from "../../../../utility/permissionsVariable";

import "../../../../assets/scss/viewCommon.scss";
const SuppliesTable = ({
  data = [],
  allPermissions,
  subPermission,
  currentPage,
  currentFilter,
  maxHeight,
  height,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeleteSupplies = async (payload) => {
    return deleteSupplies(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteSupplies,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleStockManagementList"]);
      }
    },
  });

  const columns = [
    {
      name: t("cattle_itemId"),
      selector: (row) => row?.itemID,
      width: "200px",
    },
    {
      name: t("name"),
      selector: (row) => row?.name,
      width: "200px",
    },
    {
      name: t("cattle_expense_order_quantity"),
      selector: (row) => row?.orderQuantity,
      width: "200px",
    },
    {
      name: t("cattle_unit"),
      selector: (row) => row?.unit,
      width: "200px",
    },
    {
      name: t("cattle_last_update"),
      selector: (row) => row?.lastUpdate,
      width: "300px",
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      width: "100px",
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
    },
  ];

  const SupplyData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemID: item?.itemId,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        orderQuantity: item?.orderQuantity,
        unit: item?.unit,
        lastUpdate: moment(item?.updatedAt).format("DD MMM YYYY"),
        edit:
          allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
            <img
              src={editIcon}
              width={35}
              className="cursor-pointer "
              onClick={() => {
                history.push(
                  `/stock-management/supplies/${item?.id}?page=${currentPage}&filter=${currentFilter}`
                );
              }}
            />
          ) : (
            ""
          ),
        delete:
          allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
            <img
              src={deleteIcon}
              width={35}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                Swal.fire({
                  title: `<img src="${confirmationIcon}"/>`,
                  html: `
                                      <h3 class="swal-heading mt-1">${t(
                                        "cattle_supplies_delete"
                                      )}</h3>
                                      <p>${t("cattle_supplies_sure")}</p>
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
                    deleteMutation.mutate(item.id);
                  }
                });
              }}
            />
          ) : (
            ""
          ),
      };
    });
  });

  return (
    <div className="suppliestablewrapper">
      <CustomDataTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={SupplyData}
      />
    </div>
  );
};

export default SuppliesTable;
