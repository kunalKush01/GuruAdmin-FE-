import { Table } from "antd";
import React from "react";
import "../../assets/scss/common.scss";

function AccountsTable() {
  // Sample static data
  const dataSource = [
    {
      key: "1",
      accountHolderName: "SevaEnabledTest Trust",
      accountNumber: "123456789012",
      bankName: "HDFC Bank",
      ifsc: "HDFC0000123",
    },
    {
      key: "2",
      accountHolderName: "Example Trust",
      accountNumber: "987654321098",
      bankName: "SBI",
      ifsc: "SBIN0000456",
    },
  ];

  const columns = [
    {
      title: "Account Holder Name",
      dataIndex: "accountHolderName",
      key: "accountHolderName",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "IFSC Code",
      dataIndex: "ifsc",
      key: "ifsc",
    },
  ];

  return (
    <div className="">
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        pagination={
          {
            //   current: currentPage,
            //   pageSize: pageSize,
            //   total: totalItems,
            //   onChange: onChangePage,
            //   onShowSizeChange: (current, size) => onChangePageSize(size),
            //   showSizeChanger: true,
          }
        }
        bordered
      />
    </div>
  );
}

export default AccountsTable;
