import React, { useState } from "react";
import { DatePicker, Table } from "antd";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";

import { useQuery } from "@tanstack/react-query";
import { getAllBalanceSheetRecord } from "../../api/profileApi";
import moment from "moment";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;
import backIcon from "../../../src/assets/images/icons/arrow-left.svg";
import * as XLSX from "xlsx";
import { Button } from "reactstrap";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BalanceSheetTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const trustId = localStorage.getItem("trustId");

  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 1000,
  });

  const { data } = useQuery(
    ["Reports", pagination.page, pagination.limit, dateRangeFilter],
    () =>
      getAllBalanceSheetRecord({
        ...pagination,
        sort: "desc",
        trustId,
        asOfDate: dateRangeFilter?.endDate,
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching report data:", error);
      },
    }
  );

  const transformToTreeData = (data) => {
    const result = [];

    Object.entries(data || {}).forEach(([type, typeData]) => {
      if (!typeData.accounts) return;

      const typeNode = {
        key: type,
        name: ConverFirstLatterToCapital(type),
        total: typeData.total,
        children: [],
      };

      Object.entries(typeData.accounts).forEach(([categoryKey, category]) => {
        const categoryNode = {
          key: `${type}-${categoryKey}`,
          name: ConverFirstLatterToCapital(category.name.replace("_", " ")),
          total: category.total,
          children: [],
        };

        Object.entries(category.accounts).forEach(([accId, acc]) => {
          categoryNode.children.push({
            key: accId,
            code: acc.code,
            name: acc.name,
            total: acc.balance,
          });
        });

        typeNode.children.push(categoryNode);
      });

      result.push(typeNode);
    });

    return result;
  };

  const treeData = transformToTreeData(data);
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
  ];

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Add headers to the Excel Sheet
    ws_data.push([
      "Category",
      "Subcategory",
      "Account Code",
      "Account Name",
      "Balance",
    ]);

    // Function to process account data within categories
    const processCategoryData = (categoryData, categoryType) => {
      let categoryTotal = 0; // Track total for each category

      // Add the category name only once
      ws_data.push([categoryType, "", "", "", ""]);

      // Loop through each account type (e.g., 'bank', 'petty_cash', 'corpus')
      Object.keys(categoryData.accounts).forEach((accountType) => {
        const accountTypeData = categoryData.accounts[accountType];

        // Add the subcategory name (account type)
        ws_data.push([categoryType, accountTypeData.name, "", "", ""]);

        // Loop through the accounts under each account type
        Object.values(accountTypeData.accounts).forEach((acc) => {
          // Add account details to the sheet
          const row = [
            "", // Empty for category
            "", // Empty for subcategory
            acc.code, // Account Code
            acc.name, // Account Name
            acc.balance, // Balance
          ];
          ws_data.push(row);

          // Add balance to category total
          categoryTotal += acc.balance || 0;
        });
      });

      // Add the total for this category at the bottom
      ws_data.push([categoryType, "", "", "Total", categoryTotal]);
    };

    // Process each category (Assets, Liabilities, Equity)
    if (data.assets) processCategoryData(data.assets, "Assets");
    if (data.liabilities) processCategoryData(data.liabilities, "Liabilities");
    if (data.equity) processCategoryData(data.equity, "Equity");

    // Create a worksheet from the array of data
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Write the workbook to an Excel file
    XLSX.writeFile(wb, "balance-sheet-report.xlsx");
  };

  return (
    <div className="listviewwrapper">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-1">
          <img
            src={backIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => navigate("/reports")}
            alt="Back"
          />
          <span className="commonFont">{t("Balance Sheet")}</span>
        </div>
        <div className="d-flex align-items-center mb-1">
          <RangePicker
            id="dateRangePickerANTD"
            format="DD MMM YYYY"
            allowClear
            value={
              dateRangeFilter
                ? [
                    dayjs(dateRangeFilter.startDate),
                    dayjs(dateRangeFilter.endDate),
                  ]
                : null
            }
            placeholder={[t("Start Date"), t("End Date")]}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                setDateRangeFilter({
                  startDate: dayjs(start).startOf("day").format("YYYY-MM-DD"),
                  endDate: dayjs(end).endOf("day").format("YYYY-MM-DD"),
                });
              } else {
                // If cleared, reset to current month
                setDateRangeFilter(null);
              }
            }}
          />
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
          style={{ maxWidth: 800, margin: "0 auto" }}
          columns={mainColumns}
          dataSource={treeData}
          pagination
          rowKey="key"
          bordered
          expandable={{
            rowExpandable: (record) => record.children?.length > 0,
          }}
          // summary={() => {
          //   const balance = data?.grandTotal ?? 0;
          //   return (
          //     <Table.Summary fixed>
          //       <Table.Summary.Row>
          //         <Table.Summary.Cell index={0}>
          //           <span className="commonSmallFont commonFontFamily">
          //             Balance
          //           </span>
          //         </Table.Summary.Cell>
          //         <Table.Summary.Cell index={1}>
          //           <span className="commonSmallFont commonFontFamily">
          //             ₹{balance.toLocaleString()}
          //           </span>
          //         </Table.Summary.Cell>
          //       </Table.Summary.Row>
          //     </Table.Summary>
          //   );
          // }}
        />
      </div>
    </div>
  );
};

export default BalanceSheetTable;
