import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Radio,
  Row,
  Col,
  Select,
  Switch,
  Tag,
} from "antd";
import React, { useState, useEffect, useMemo } from "react";
import "../../../assets/scss/common.scss";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import lockIcon from "../../../assets/images/icons/lock.svg";
import eyeIcon from "../../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { deleteAccount, updateAccount } from "../../../api/profileApi";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import moment from "moment";

function FundTransferTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const columns = [
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => (
        <Tag color={type === "fund_transfer" ? "green" : "blue"}>
          {type === "fund_transfer" ? "Fund Transfer" : "Bank Interest"}
        </Tag>
      ),
      width: 80,
      fixed: "left",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("DD MMM YYYY, hh:mm A"),
      width: 80,
    //   fixed: "left",
    },
    {
      title: "From Account",
      key: "fromAccount",
      render: (_, record) => {
        const fromEntry = record?.journalId?.entries?.find(
          (entry) => entry.type === "credit"
        );
        return fromEntry?.account?.name || "-";
      },
      width: 120,
    },
    {
      title: "To Account",
      key: "toAccount",
      render: (_, record) => {
        const toEntry = record?.journalId?.entries?.find(
          (entry) => entry.type === "debit"
        );
        return toEntry?.account?.name || "-";
      },
      width: 120,
    },

    {
      title: "Narration",
      key: "narration",
      render: (_, record) => record?.journalId?.narration || "-",
      width: 120,
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount.toLocaleString()}`,
      fixed: "right",
      width: 50,
    },
  ];
  const dataSource = data?.map((item) => ({
    ...item,
    key: item.id || item._id,
  }));

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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        bordered
      />
    </div>
  );
}

export default FundTransferTable;
