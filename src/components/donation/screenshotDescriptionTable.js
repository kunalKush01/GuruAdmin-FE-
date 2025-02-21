import React from "react";
import { Descriptions } from "antd";
import moment from "moment";

const ScreenshotDescriptionTable = ({ record }) => {
  if (!record) return null; // Handle cases where record is undefined

  const formattedDate = record.createdAt
    ? moment(record.createdAt).format("YYYY MM DD HH:mm:ss")
    : "N/A";

  const borderedItems = [
    {
      key: "1",
      label: "Name",
      children: record.donarName || "N/A",
    },
    {
      key: "2",
      label: "Amount",
      children: `₹${record.amount || "0.00"}`,
    },
    {
      key: "3",
      label: "Transaction ID",
      children: "",
    },
    {
      key: "4",
      label: "Transaction Date & Time",
      children: "",
    },
    {
      key: "5",
      label: "Status",
      children: record.paidStatus || "N/A",
    },
  ];

  return (
    <div>
      <Descriptions bordered size="small" items={borderedItems} />
    </div>
  );
};

export default ScreenshotDescriptionTable;
