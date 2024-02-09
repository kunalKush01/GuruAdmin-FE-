import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { deleteUsage } from "../../../../api/cattle/cattleUsage";
import deleteIcon from "../../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../../components/partials/CustomDataTable";

const UsageManagementTableWrapper = styled.div`
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

const UsageManagementTable = ({
  data = [],
  currentFilter,
  currentPage,
  maxHeight,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleDeleteUsage = async (payload) => {
    return deleteUsage(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteUsage,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["cattleStockManagementList"]);
      }
    },
  });

  const columns = [
    {
      name: t("cattle_itemId"),
      selector: (row) => row?.itemId,
    },
    {
      name: t("expenses_Date"),
      selector: (row) => row?.date,
    },
    {
      name: t("cattle_expense_quantity"),
      selector: (row) => row?.quantity,
    },
    {
      name: t("cattle_unit"),
      selector: (row) => row?.unit,
    },
    {
      name: t("cattle_purpose"),
      selector: (row) => row?.purpose,
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

  const usageData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemId: item?.itemId,
        date: moment(item?.date).format("DD MMM YYYY"),
        quantity: item?.quantity,
        unit: item?.unit,
        purpose: item?.purpose,
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer "
            onClick={() => {
              history.push(
                `/cattle/management/usage/${item?._id}?page=${currentPage}&filter=${currentFilter}`
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
                                        "cattle_usage_delete"
                                      )}</h3>
                                      <p>${t("cattle_usage_sure")}</p>
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
    <UsageManagementTableWrapper>
      <CustomDataTable
        maxHeight={maxHeight}
        columns={columns}
        data={usageData}
      />
    </UsageManagementTableWrapper>
  );
};

export default UsageManagementTable;
