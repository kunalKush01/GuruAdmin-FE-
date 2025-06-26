import React from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss";

const ReportTable = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const dataSource = [
    {
      key: "1",
      name: "Profit and Loss Report",
      route: "/profitlossReport",
    },
    {
      key: "2",
      name: "Balance Sheet",
      route: "/balancesheet",
    },
  ];

  const handleRowClick = (record) => {
    navigate(record.route);
  };

  return (
    <Table
      className="commonListTable"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
        style: { cursor: "pointer" },
      })}
      bordered
    />
  );
};

export default ReportTable;
