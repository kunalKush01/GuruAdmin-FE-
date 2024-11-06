import React, { useState } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getAllFileUploaded } from "../../api/suspenseApi";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import downloadIcon from "../../assets/images/icons/file-download.svg";
import { useTranslation } from "react-i18next";
import SuspenseImportHistoryView from "./suspenseImportHistoryView";

const SuspenseHistoryTable = () => {
  const { t } = useTranslation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery(
    ["suspenseDataHistory", currentPage, pageSize],
    () => getAllFileUploaded(currentPage, pageSize),
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
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const handleDownload = (record) => {
    const { file } = record;
    if (file && file[0] && file[0].presignedUrl) {
      window.open(file[0].presignedUrl, "_blank");
    } else {
      console.error("File or presignedUrl not found");
    }
  };

  const columns = [
    {
      title: t("suspense_id"),
      dataIndex: "_id",
      key: "importId",
      width: 220,
    },
    {
      title: t("start_date_time"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (text) => moment(text).format("DD MMM YYYY HH:mm:ss"), // Format date
    },
    {
      title: t("end_date_time"),
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: 220,
      render: (text) => moment(text).format("DD MMM YYYY HH:mm:ss"), // Format date
    },
    {
      title: t("suspense_status"),
      dataIndex: "status",
      key: "status",
      width: 220,
      render: (status) => (
        <div
          style={{
            color: status == "completed" ? "var(--green)" : "var(--red)",
          }}
        >
          <label>{ConverFirstLatterToCapital(status)}</label>
        </div>
      ),
    },
    {
      title: t('action'),
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
          <img
            src={downloadIcon}
            style={{ width: "20px", cursor: "pointer" }}
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
        <SuspenseImportHistoryView
          isOpen={isFormOpen}
          toggle={() => setIsFormOpen(false)}
          details={selectedRecord}
        />
      )}
    </>
  );
};

export default SuspenseHistoryTable;
