import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

import { deleteUsage } from "../../../../api/cattle/cattleUsage";
import deleteIcon from "../../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../../assets/images/icons/category/editIcon.svg";
import confirmationIcon from "../../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";
import { DELETE, EDIT } from "../../../../utility/permissionsVariable";

import "../../../../assets/scss/viewCommon.scss";
import { Table } from "antd";
const UsageManagementTable = ({
  data = [],
  currentFilter,
  // currentPage,
  maxHeight,
  allPermissions,
  subPermission,
  height,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      title: t("cattle_itemId"),
      dataIndex: "itemId",
      key: "itemId",
      width: 100,
      fixed: "left",
    },
    {
      title: t("cattle_itemName"),
      dataIndex: "itemName",
      key: "itemName",
      width: 120,
    },
    {
      title: t("expenses_Date"),
      dataIndex: "date",
      key: "date",
      width: 80,
    },
    {
      title: t("cattle_expense_quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
    },
    {
      title: t("cattle_unit"),
      dataIndex: "unit",
      key: "unit",
      width: 80,
    },
    {
      title: t("cattle_purpose"),
      dataIndex: "purpose",
      key: "purpose",
      width: 120,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 50,
      fixed: "right",
    },
  ];

  const usageData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemId: item?.itemId,
        itemName: ConverFirstLatterToCapital(item?.itemName ?? "-"),
        date: moment(item?.date).format("DD MMM YYYY"),
        quantity: item?.quantity,
        unit: item?.unit,
        purpose: ConverFirstLatterToCapital(
          item?.purpose?.replace("_", " ")?.toLowerCase() ?? ""
        ),
        action: (
          <div className="d-flex align-items-center">
            <div>
              {allPermissions?.name === "all" ||
              subPermission?.includes(EDIT) ? (
                <img
                  src={editIcon}
                  width={35}
                  className="cursor-pointer "
                  onClick={() => {
                    navigate(
                      `/stock-management/usage/${item?._id}?page=${currentPage}&filter=${currentFilter}`
                    );
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <div>
              {allPermissions?.name === "all" ||
              subPermission?.includes(DELETE) ? (
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
              ) : (
                ""
              )}
            </div>
          </div>
        ),
      };
    });
  }, [data]);

  return (
    <div className="usagemanagementtablewrapper">
      <Table
        columns={columns}
        dataSource={usageData}
        className="commonListTable"
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        bordered
      />
    </div>
  );
};

export default UsageManagementTable;
