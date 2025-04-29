import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Table } from "antd";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import backIcon from "../../../src/assets/images/icons/arrow-left.svg";
import "../../../src/assets/scss/common.scss";

const BalanceSheetTable = () => {
  const history = useHistory();
  const { state } = useLocation();
  const [entries, setEntries] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (state) {
      setEntries(state?.state?.entries || []);
      setCategory(state?.state?.category || "");
    }
  }, [state]);

  // Flatten lines so each debit/credit line appears as a separate row
  const dataSource = entries.flatMap((entry) =>
    (entry.lines || []).map((line, index) => ({
      key: `${entry._id}-${index}`,
      date: moment(entry.date).format("DD MMM YYYY"), // <-- formatted date
      narration: entry.narration,
      // sourceType: entry.sourceType,
      accountName: line.accountName,
      type: line.type,
      debit: line.type === "debit" ? line.amount : null,
      credit: line.type === "credit" ? line.amount : null,
    }))
  );
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Account",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (value) => (value ? `₹${value.toLocaleString()}` : "-"),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      render: (value) => (value ? `₹${value.toLocaleString()}` : "-"),
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center gap-1 mb-1">
        <img
          src={backIcon}
          width={25}
          className="cursor-pointer"
          onClick={() => history.push("/reports")}
          alt="Back"
        />
        <h2 className="commonFont commonFontFamily mb-0">
          {ConverFirstLatterToCapital(category)} Entries
        </h2>
      </div>

      <Table
        className="commonListTable"
        dataSource={dataSource}
        columns={columns}
        rowKey="key"
        pagination
        bordered
        scroll={{ x: 1000, y: 400 }}
      />
    </div>
  );
};

export default BalanceSheetTable;
