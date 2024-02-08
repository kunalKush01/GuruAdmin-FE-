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
import { DELETE } from "../../../../utility/permissionsVariable";

const SuppliesTableWrapper = styled.div`
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

const SuppliesTable = ({
  data = [],
  allPermissions,
  subPermission,
  currentPage,
  currentFilter,
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
    },
    {
      name: t("name"),
      selector: (row) => row?.name,
    },
    {
      name: t("cattle_expense_order_quantity"),
      selector: (row) => row?.orderQuantity,
    },
    {
      name: t("cattle_unit"),
      selector: (row) => row?.unit,
    },
    {
      name: t("cattle_last_update"),
      selector: (row) => row?.lastUpdate,
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
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => {
              history.push(
                `/cattle/management/supplies/${item?.id}?page=${currentPage}&filter=${currentFilter}`
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
        ),
        // ) : (
        // ""
        // ),
      };
    });
  });

  return (
    <SuppliesTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={SupplyData} />
    </SuppliesTableWrapper>
  );
};

export default SuppliesTable;
