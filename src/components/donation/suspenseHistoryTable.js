import React, { useState } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getAllSuspenseHistory } from "../../api/suspenseApi";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const SuspenseHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery(
    ["suspenseDataHistory", currentPage, pageSize],
    () => getAllSuspenseHistory(currentPage, pageSize),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching suspense data:", error);
      },
    }
  );
  const tableData = data?.result || [];
  const totalItems = data?.total || 0;

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "importId",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (timestamp) => moment(timestamp).format("DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "Finished On",
      dataIndex: "finishedOn",
      key: "finishedOn",
      render: (timestamp) => moment(timestamp).format("DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div
          style={{
            color: status == "completed" ? "#24C444" : "#FF0700",
            font: "normal normal 600 11px/20px Noto Sans",
          }}
        >
          {ConverFirstLatterToCapital(status)}
        </div>
      ),
    },
    // {
    //   title: "Progress",
    //   dataIndex: "progress",
    //   key: "progress",
    //   render: (progress) => `${progress}%`,
    // },
    // {
    //   title: "Failed Reason",
    //   dataIndex: "failedReason",
    //   key: "failedReason",
    //   width: 400,
    // },
  ];

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
      sticky={{ offsetHeader: 64 }}
      scroll={{ x: 1000, y: 400 }}
    />
  );
};

export default SuspenseHistoryTable;
