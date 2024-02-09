import moment from "moment/moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../../utility/formater";

const StockManagementTableWrapper = styled.div`
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

const StockManagementTable = ({ data = [],  maxHeight }) => {
  const { t } = useTranslation();
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
      name: t("cattle_expense_current_quantity"),
      selector: (row) => row?.currentQuantity,
    },
    {
      name: t("cattle_unit"),
      selector: (row) => row?.unit,
    },
    {
      name: t("cattle_last_update"),
      selector: (row) => row?.lastUpdate,
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
    <StockManagementTableWrapper>
      <CustomDataTable maxHeight={maxHeight} columns={columns} data={StockData} />
    </StockManagementTableWrapper>
  );
};

export default StockManagementTable;
