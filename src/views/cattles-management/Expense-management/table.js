import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../../../components/partials/CustomDataTable";

const ExpenseTableWrapper = styled.div`
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

const ExpenseTable = ({ data = [] }) => {
  const { t } = useTranslation();
  const columns = [
    {
      name: t("cattle_purpose"),
      selector: (row) => row?.purpose,
    },
    {
      name: t("cattle_itemId"),
      selector: (row) => row?.itemId,
    },
    {
      name: t("cattle_expense_quantity"),
      selector: (row) => row?.quantity,
    },
    {
      name: t("cattle_expense_bill_invoice"),
      selector: (row) => row?.bill_invoice,
    },
  ];

  const expenseData = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        purpose: item?.purpose,
        itemId: item?.itemId,
        quantity: item?.quantity,
        bill_invoice: (
          <a
            href={item?.bill_invoice}
            style={{
              background: "#FF2C2C",
              color: "#ffffff",
              fontWeight: "bold",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            Invoice.pdf
          </a>
        ),
      };
    });
  });

  return (
    <ExpenseTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={expenseData} />
    </ExpenseTableWrapper>
  );
};

export default ExpenseTable;
