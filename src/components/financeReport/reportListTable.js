import React from "react";
import { useTranslation } from "react-i18next";
import CommitmentListTable from "../commitments/commitmentListTable";
import DonationList from "../donation/donationList";
import DonationBoxListTable from "../DonationBox/donationBoxListTable";
import { ExpensesListTable } from "../internalExpenses/expensesListTable";

export default function ReportListTable({
  activeReportTab,
  data,
  page,
  setPagination,
  expenseTotalItem,
  donationTotalItem,
  commitmentTotalItem,
  boxCollectionTotalItem,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const { t } = useTranslation();

  const getTable = () => {
    switch (activeReportTab.name) {
      case t("report_expences"):
        return (
          <ExpensesListTable
            data={data}
            page={page}
            financeReport
            expenseTotalItem={expenseTotalItem}
            currentPage={currentPage}
            pageSize={pageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
          />
        );
      case t("donation_Donation"):
        return (
          <DonationList
            data={data}
            donationTotalItem={donationTotalItem}
            currentPage={currentPage}
            pageSize={pageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
          />
        );
      case t("report_commitment"):
        return (
          <CommitmentListTable
            data={data}
            financeReport
            commitmentTotalItem={commitmentTotalItem}
            currentPage={currentPage}
            pageSize={pageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
          />
        );
      case t("report_donation_box"):
        return (
          <DonationBoxListTable
            data={data}
            financeReport
            boxCollectionTotalItem={boxCollectionTotalItem}
            currentPage={currentPage}
            pageSize={pageSize}
            onChangePage={onChangePage}
            onChangePageSize={onChangePageSize}
          />
        );
      default:
        return [];
    }
  };
  return <div>{getTable()}</div>;
}
