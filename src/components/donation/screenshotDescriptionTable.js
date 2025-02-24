import React from "react";
import { Descriptions } from "antd";
import moment from "moment";

const ScreenshotDescriptionTable = ({ record, data }) => {
  console.log("Extracted Data:", data);
  if (!record) return null; // Handle cases where data or record is undefined

  // Format the timestamp properly
  const formattedTimestamp = data.timestamp
    ? moment(data.timestamp, "hh:mm A, DD MMM YYYY").format("YYYY-MM-DD HH:mm:ss")
    : "N/A";
    console.log(data)

  const borderedItems = [
    {
      key: "1",
      label: "Name",
      children: data?.from?.name || record?.donarName || "N/A",
    },
    {
      key: "2",
      label: "Amount",
      children: `₹${data?.amount || record?.amount || "0.00"}`,
    },
    {
      key: "3",
      label: "Transaction ID",
      children: data?.upiRefNumber || "N/A",
    },
    {
      key: "4",
      label: "Transaction Date & Time",
      children: data?.timestamp || "N/A",
    },
    {
      key: "5",
      label: "Status",
      children: record?.paidStatus || "N/A",
    },
  ];

  return (
    <div>
      <Descriptions bordered size="small" items={borderedItems} />
    </div>
  );
};

export default ScreenshotDescriptionTable;
