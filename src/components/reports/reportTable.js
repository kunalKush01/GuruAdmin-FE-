import React, { useState } from "react";
import { Table, Button } from "antd";
import { useHistory } from "react-router-dom"; // Import useHistory
import "react-pivottable/pivottable.css";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";

// Sample data structure
const ReportTable = ({ data }) => {
  const history = useHistory(); // Initialize useHistory

  // Account Summary Columns
  const accountSummaryColumns = [
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <img src={eyeIcon} width={25} onClick={() => handleView(record)} className="cursor-pointer" />
      ),
    },
  ];

  // Filter entries by accountId
  const handleView = (record) => {
    const accountId = record.key;
    const filtered = data.entries.filter((entry) =>
      entry.lines.some((line) => line.accountId === accountId)
    );

    // Prepare pivot data
    const pivotData = filtered
      .map((entry) => {
        return entry.lines.map((line) => ({
          ...line,
          date: new Date(entry.date).toLocaleDateString(),
          narration: entry.narration,
          sourceType: entry.sourceType,
        }));
      })
      .flat(); // Flatten array to have a single level of data

    // Navigate to /bankTransactions/:id and pass the pivot data via state
    history.push({
      pathname: `/bankTransactions/${accountId}`,
      state: { pivotData }, // Pass the pivot data in the state
    });
  };

  // Prepare dataSource for the account summary table
  const accountSummaryDataSource = data
    ? Object.keys(data.accountSummary).map((key) => ({
        ...data.accountSummary[key],
        key,
      }))
    : [];

  return (
    <div>
      <Table
        className="commonListTable"
        scroll={{
          x: 1500,
          y: 430,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
        dataSource={accountSummaryDataSource} // Use the pre-calculated dataSource
        columns={accountSummaryColumns}
        rowKey="key"
        pagination={false}
      />
    </div>
  );
};

export default ReportTable;
