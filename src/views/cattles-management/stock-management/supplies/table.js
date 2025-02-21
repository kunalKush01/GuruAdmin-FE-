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
import { Table } from "antd";
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
      title: t("cattle_itemId"),
      dataIndex: "itemID",
      key: "itemID",
      width: 100,
      fixed:"left"
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: t("cattle_expense_order_quantity"),
      dataIndex: "orderQuantity",
      key: "orderQuantity",
      width: 80,
    },
    {
      title: t("cattle_unit"),
      dataIndex: "unit",
      key: "unit",
      width: 80,
    },
    {
      title: t("cattle_last_update"),
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      width: 120,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 50,
      fixed:"right"
    }
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
                      `/stock-management/supplies/${item?.id}?page=${currentPage}&filter=${currentFilter}`
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
              )}
            </div>
          </div>
        ),
      };
    });
  });

  return (
    <div className="suppliestablewrapper">
      <Table
        columns={columns}
        dataSource={SupplyData}
        className="commonListTable"
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default SuppliesTable;
