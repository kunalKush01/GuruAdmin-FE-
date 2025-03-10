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
import { DELETE, EDIT } from "../../../../utility/permissionsVariable";

import "../../../../assets/scss/viewCommon.scss";
import { Table } from "antd";
const StockManagementItemTable = ({
  data = [],
  // currentPage,
  currentFilter,
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
      title: t("Item ID"),
      dataIndex: "itemId",
      key: "itemId",
      width: 100,
      fixed: "left",
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: t("Unit"),
      dataIndex: "unit",
      key: "unit",
      width: 100,
    },
    {
      title: t("Type"),
      dataIndex: "unitType",
      key: "unitType",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 50,
      fixed: "right",
    },
  ];

  const ItemData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemId: item?.itemId,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        unit: item?.unit,
        unitType: ConverFirstLatterToCapital(
          item?.unitType?.toLowerCase() ?? "  "
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
                    history.push(
                      `/stock-management/item/${item?._id}?page=${currentPage}&filter=${currentFilter}`
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
    <div className="stockmanagementitemtablewrapper">
      <Table
        columns={columns}
        dataSource={ItemData}
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

export default StockManagementItemTable;
