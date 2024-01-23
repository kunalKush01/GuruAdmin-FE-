import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../components/partials/CustomDataTable";

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

const UsageManagementTable = ({ data = [] }) => {
  const { t } = useTranslation();

  const columns = [
    {
      name: t("itemID"),
      selector: (row) => row?.itemId,
    },
    {
      name: t("date"),
      selector: (row) => row?.Date,
    },
    {
      name: t("quantity"),
      selector: (row) => row?.quantity,
    },
    {
      name: t("unit"),
      selector: (row) => row?.unit,
    },
    {
      name: t("purpose"),
      selector: (row) => row?.purpose,
    },
  ];

  const usageData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        itemId: item?.itemId,
        date: item?.date,
        quantity: item?.quantity,
        unit: item?.unit,
        purpose: item?.purpose,
      };
    });
  }, [data]);

  return (
    <UsageManagementTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={usageData} />
    </UsageManagementTableWrapper>
  );
};

export default UsageManagementTable;
