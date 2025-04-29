import React from "react";
import { Table } from "antd";
import { useHistory } from "react-router-dom";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import "../../assets/scss/common.scss";

const ReportTable = ({ data }) => {
  console.log(data);
  const history = useHistory();
  const categoryTotals = (data && data.categoryTotals) || {};

  // Prepare the main category rows
  const mainDataSource = Object.entries(categoryTotals).map(
    ([categoryKey, categoryValue]) => ({
      key: categoryKey,
      name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
      total: categoryValue.total,
      accounts: Object.entries(categoryValue.accounts).map(
        ([accountKey, accountValue]) => ({
          key: accountKey,
          ...accountValue,
        })
      ),
    })
  );

  // Main category columns with View button
  const mainColumns = [
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value) => value && `₹${value.toLocaleString()}`,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      // fixed:"right",
      render: (text, record) => (
        <img
          src={eyeIcon}
          width={25}
          onClick={() => {
            const entries =
              record.key === "donation"
                ? data.donationEntries
                : data.expenseEntries;

            history.push(`/bankTransactions/${record.key}`, {
              state: {
                category: record.key,
                entries: entries || [],
              },
            });
          }}
          className="cursor-pointer"
          alt="View"
        />
      ),
    },
  ];

  // Child rows (account level)
  const accountColumns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 134,
      render: (value) => (value ? `₹${value.toLocaleString()}` : "-"),
    },
  ];

  const expandedRowRender = (record) => (
    <div style={{ padding: "15px 0px 15px 32px" }}>
      <Table
        className="noBoxShadowTable"
        style={{ boxShadow: "none !important" }}
        columns={accountColumns}
        dataSource={record.accounts}
        pagination={false}
        rowKey="key"
        bordered
        size="small"
      />
    </div>
  );

  return (
    <Table
      className="commonListTable"
      columns={mainColumns}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) =>
          record.accounts && record.accounts.length > 0,
      }}
      dataSource={mainDataSource}
      pagination
      rowKey="key"
      bordered
      scroll={{ x: 1000, y: 400 }}
      sticky={{
        offsetHeader: 64,
      }}
      summary={() => {
        const balance = data?.grandTotal ?? 0;
        return (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} />
              <Table.Summary.Cell index={1}>
                <span className="commonSmallFont commonFontFamily">
                  Balance
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <span className="commonSmallFont commonFontFamily">
                  ₹{balance.toLocaleString()}
                </span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default ReportTable;
