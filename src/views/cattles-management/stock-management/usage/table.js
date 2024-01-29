import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
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

const UsageManagementTable = ({ data = [] }) => {
  const { t } = useTranslation();

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
