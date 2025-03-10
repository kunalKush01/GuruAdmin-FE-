import moment from "moment/moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";

import "../../../../assets/scss/viewCommon.scss";
import { Table } from "antd";
const StockManagementTable = ({
  data = [],
  maxHeight,
  height,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("cattle_itemId"),
      dataIndex: "itemID",
      key: "itemID",
      width: 120,
      fixed: "left",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: t("cattle_expense_current_quantity"),
      dataIndex: "currentQuantity",
      key: "currentQuantity",
      width: 120,
    },
    {
      title: t("cattle_unit"),
      dataIndex: "unit",
      key: "unit",
      width: 120,
    },
    {
      title: t("cattle_last_update"),
      dataIndex: "lastUpdate",
      key: "lastUpdate",
      width: 120,
      fixed: "right",
    },
  ];

  const StockData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemID: item?.itemId,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        orderQuantity: item?.orderQuantity,
        currentQuantity: item?.currentQuantity,
        unit: item?.unit,
        lastUpdate: moment(item?.updatedAt).format("DD MMM YYYY"),
      };
    });
  });

  return (
    <div className="stockmanagementtablewrapper">
      <Table
        columns={columns}
        dataSource={StockData}
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

export default StockManagementTable;
