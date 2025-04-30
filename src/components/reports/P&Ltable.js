import React, { useState } from "react";
import { DatePicker, Table } from "antd";
import { useHistory } from "react-router-dom";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";

import { useQuery } from "@tanstack/react-query";
import { getAllProfitLossRecord } from "../../api/profileApi";
import moment from "moment";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;
import backIcon from "../../../src/assets/images/icons/arrow-left.svg";
import * as XLSX from "xlsx";
import { Button } from "reactstrap";

const PLtable = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const trustId = localStorage.getItem("trustId");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1000,
  });

  const { data } = useQuery(
    ["Reports", pagination.page, pagination.limit, dateRangeFilter],
    () =>
      getAllProfitLossRecord({
        ...pagination,
        sort: "desc",
        trustId: trustId,
        startDate: dateRangeFilter?.startDate,
        endDate: dateRangeFilter?.endDate,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching report data:", error);
      },
    }
  );
  const categoryTotals = (data && data.categoryTotals) || {};

  // Prepare the main category rows
  const mainDataSource = Object.entries(categoryTotals).map(
    ([categoryKey, categoryValue]) => ({
      key: categoryKey,
      name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
      total: categoryValue.total,
      accounts: Object.entries(categoryValue.accounts).map(
        ([accountKey, accountValue]) => ({
          key: accountKey,
          ...accountValue,
        })
      ),
    })
  );

  // Main category columns with View button
  const mainColumns = [
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 216,
      render: (value) => value && `₹${value.toLocaleString()}`,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   width: 150,
    //   // fixed:"right",
    //   render: (text, record) => (
    //     <img
    //       src={eyeIcon}
    //       width={25}
    //       onClick={() => {
    //         const entries =
    //           record.key === "donation"
    //             ? data.donationEntries
    //             : data.expenseEntries;

    //         history.push(`/bankTransactions/${record.key}`, {
    //           state: {
    //             category: record.key,
    //             entries: entries || [],
    //           },
    //         });
    //       }}
    //       className="cursor-pointer"
    //       alt="View"
    //     />
    //   ),
    // },
  ];

  // Child rows (account level)
  const accountColumns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 200,
      render: (value) => (value ? `₹${value.toLocaleString()}` : "-"),
    },
  ];

  const expandedRowRender = (record) => (
    <div style={{ padding: "15px 0px 15px 32px" }}>
      <Table
        className="noBoxShadowTable"
        style={{ boxShadow: "none !important" }}
        columns={accountColumns}
        dataSource={record.accounts}
        pagination={false}
        rowKey="key"
        bordered
        size="small"
      />
    </div>
  );

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Headers
    ws_data.push(["Category", "Total"]);

    let rowIndex = 2; // Start from second row (after header)

    mainDataSource.forEach((category) => {
      // Add bold parent category row
      ws_data.push([category.name, category.total]);

      // Add account rows (with code)
      category.accounts.forEach((account) => {
        const accountLabel = `(${account.code}) ${account.name}`;
        ws_data.push([accountLabel, account.total]);
      });

      rowIndex += category.accounts.length + 1;
    });

    // Add grand total as the last row
    const grandTotal = data?.grandTotal ?? 0;
    ws_data.push(["Grand Total", `₹${grandTotal.toLocaleString()}`]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Apply bold to Donation / Expense rows
    let currentRow = 2;
    mainDataSource.forEach((category) => {
      const cellA = ws[`A${currentRow}`];
      const cellB = ws[`B${currentRow}`];

      if (cellA) cellA.s = { font: { bold: true } };
      if (cellB) cellB.s = { font: { bold: true } };

      currentRow += category.accounts.length + 1;
    });

    // Apply bold to Grand Total row
    const grandTotalRow = ws_data.length;
    const grandTotalCellA = ws[`A${grandTotalRow}`];
    const grandTotalCellB = ws[`B${grandTotalRow}`];
    if (grandTotalCellA) grandTotalCellA.s = { font: { bold: true } };
    if (grandTotalCellB) grandTotalCellB.s = { font: { bold: true } };

    // Append sheet and export
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx", { cellStyles: true });
  };

  return (
    <div className="listviewwrapper">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-1">
          <img
            src={backIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => history.push("/reports")}
            alt="Back"
          />
          <span className="commonFont">{t("Profit & Loss")}</span>
        </div>
        <div className="d-flex align-items-center mb-1">
          <div>
            <RangePicker
              id="dateRangePickerANTD"
              format="DD MMM YYYY"
              // value={[
              //   moment(dateRangeFilter.startDate),
              //   moment(dateRangeFilter.endDate),
              // ]}
              placeholder={[t("Start Date"), t("End Date")]}
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  const [start, end] = dates;
                  setDateRangeFilter({
                    startDate: moment(start)
                      .startOf("day")
                      .format("YYYY-MM-DD"),
                    endDate: moment(end).endOf("day").format("YYYY-MM-DD"),
                  });
                } else {
                  setDateRangeFilter({
                    startDate: moment().startOf("month").format("YYYY-MM-DD"),
                    endDate: moment().endOf("month").format("YYYY-MM-DD"),
                  });
                }
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div className="ms-1">
            <Button
              onClick={handleDownloadExcel}
              color="primary"
              className="secondaryAction-btn"
            >
              {t("Download Report")}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Table
          className="commonListTable"
          style={{
            maxWidth: 800, // adjust this width as needed
            margin: "0 auto", // center the table
          }}
          columns={mainColumns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) =>
              record.accounts && record.accounts.length > 0,
          }}
          dataSource={mainDataSource}
          pagination
          rowKey="key"
          bordered
          //   scroll={{ x: 1000, y: 400 }}
          //   sticky={{
          //     offsetHeader: 64,
          //   }}
          summary={() => {
            const balance = data?.grandTotal ?? 0;
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} />
                  <Table.Summary.Cell index={1}>
                    <span className="commonSmallFont commonFontFamily">
                      Balance
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <span className="commonSmallFont commonFontFamily">
                      ₹{balance.toLocaleString()}
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PLtable;
