import moment from "moment/moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";

import "../../../../assets/scss/viewCommon.scss";
const StockManagementTable = ({ data = [], maxHeight, height }) => {
  const { t } = useTranslation();
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
      name: t("cattle_expense_current_quantity"),
      selector: (row) => row?.currentQuantity,
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
      width: "200px",
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
      <CustomDataTable
        maxHeight={maxHeight}
        height={height}
        columns={columns}
        data={StockData}
      />
    </div>
  );
};

export default StockManagementTable;
