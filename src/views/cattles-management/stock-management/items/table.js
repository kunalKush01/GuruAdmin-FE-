import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { deleteItem } from "../../../../api/cattle/cattleStock";
import deleteIcon from "../../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";

const StockManagementItemTableWrapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;

const StockManagementItemTable = ({
  data = [],
  currentPage,
  currentFilter,
  maxHeight,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeleteItem = async (payload) => {
    return deleteItem(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteItem,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleStockManagementList"]);
      }
    },
  });

  const columns = [
    {
      name: t("Item ID"),
      selector: (row) => row?.itemId,
    },
    {
      name: t("Name"),
      selector: (row) => row?.name,
    },
    {
      name: t("Unit"),
      selector: (row) => row?.unit,
    },
    {
      name: t("Type"),
      selector: (row) => row?.unitType,
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

  const ItemData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemId: item?.itemId,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        unit: item?.unit,
        unitType: item?.unitType,
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => {
              history.push(
                `/cattle/management/items/${item?._id}?page=${currentPage}&filter=${currentFilter}`
              );
            }}
          />
        ),
        delete: (
          // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
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
                                        "cattle_item_delete"
                                      )}</h3>
                                      <p>${t("cattle_item_sure")}</p>
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
    <StockManagementItemTableWrapper>
      <CustomDataTable
        maxHeight={maxHeight}
        columns={columns}
        data={ItemData}
      />
    </StockManagementItemTableWrapper>
  );
};

export default StockManagementItemTable;
