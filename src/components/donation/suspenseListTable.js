import { Table, Button, Space } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSuspense } from "../../api/suspenseApi";

function SuspenseListTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery(
    ["suspenseData", currentPage, pageSize],
    () => getAllSuspense(currentPage, pageSize),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching suspense data:", error);
      },
    }
  );
  const handleDownload = (record) => {
    if (record.file?.[0]?.presignedUrl) {
      window.open(record.file[0].presignedUrl, "_blank");
    } else {
      console.error("No presigned URL available for download.");
    }
  };

  const columns = [
    {
      title: "Transaction Date & Time",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) =>text? moment(text).format("DD-MMM-YYYY"):'-',
    },
    {
      title: "Bank Narration",
      dataIndex: "bankNarration",
      key: "bankNarration",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Mode of Payment",
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      render: (text) =>text? text:'-',
    },
    // Uncomment this if download functionality is required
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <Button type="default" onClick={() => handleDownload(record)}>
    //         Download
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  const tableData = data?.result || [];
  const totalItems = data?.total || 0;
  return (
    <Table
      className="donationListTable"
      columns={columns}
      dataSource={tableData}
      rowKey={(record) => record._id}
      loading={isLoading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: totalItems,
        onChange: (page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        },
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
      }}
      scroll={{ x: 1000, y: 400 }}
      sticky={{ offsetHeader: 64 }}
      bordered
    />
  );
}

export default SuspenseListTable;
