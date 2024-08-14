import { Table, Button, Space } from "antd";
import moment from "moment";
import React, { useMemo } from "react";
import { getAllSuspense } from "../../api/suspenseApi";
import { useQuery } from "@tanstack/react-query";

function SuspenseListTable() {
  const dataSource = [].map((item, index) => ({
    key: index + 1,
    id: item._id,
    fileName: item.file[0]?.name,
    uploadedAt: moment(item.uploadedAt).format("DD MMM YYYY"),
    // status: item.status,
  }));

  const handleView = (record) => {
    console.log("View File:", record);
    // Implement logic to fetch and display file data based on targetFields matching the S3 file headers
  };

  const handleDownload = (record) => {
    window.open(record.file[0].presignedUrl, "_blank");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Date of Upload",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record)}>
            View
          </Button>
          <Button type="default" onClick={() => handleDownload(record)}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="donationListTable"
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 1000, y: 400 }}
      sticky={{ offsetHeader: 64 }}
      bordered
    />
  );
}

export default SuspenseListTable;
