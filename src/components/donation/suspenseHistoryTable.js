import React, { useState } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getAllSuspenseHistory } from "../../api/suspenseApi";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { DownloadOutlined } from "@ant-design/icons";
import SuspenseImportHIstoryView from "./suspenseImportHIstoryView";

const SuspenseHistoryTable = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); // State to store selected record
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

  const handleView = (record) => {
    setSelectedRecord(record); // Set the selected record
    setIsFormOpen(true); // Open the modal
  };

  const handleDownload = (record) => {
    const { file } = record;
    if (file && file[0] && file[0].presignedUrl) {
      window.open(file[0].presignedUrl, '_blank');
    } else {
      console.error('File or presignedUrl not found');
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "importId",
      width: 220,
    },
    {
      title: "Start Date Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (text) => moment(text).format("DD MMM YYYY HH:mm:ss"), // Format date
    },
    {
      title: "End Date Time",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: 220,
      render: (text) => moment(text).format("DD MMM YYYY HH:mm:ss"), // Format date
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 220,
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
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (text, record) => (
        <div className="d-flex gap-2">
          <img
            src={eyeIcon}
            style={{ width: "20px", cursor: "pointer" }}
            onClick={() => handleView(record)}
          />
          <DownloadOutlined
            style={{ fontSize: "18px", cursor: "pointer" }}
            onClick={() => handleDownload(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
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
      {selectedRecord && (
        <SuspenseImportHIstoryView
          isOpen={isFormOpen}
          toggle={() => setIsFormOpen(false)}
          details={selectedRecord} // Pass the selected record details
        />
      )}
    </>
  );
};

export default SuspenseHistoryTable;
