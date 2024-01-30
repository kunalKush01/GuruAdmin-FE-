import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
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

const StockManagementItemTable = ({ data = [] }) => {
  const { t } = useTranslation();
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
  ];

  const ItemData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemId: item?.itemId,
        name: ConverFirstLatterToCapital(item?.name ?? ""),
        unit: item?.unit,
        unitType: item?.unitType,
      };
    });
  }, [data]);

  return (
    <StockManagementItemTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={ItemData} />
    </StockManagementItemTableWrapper>
  );
};

export default StockManagementItemTable;
