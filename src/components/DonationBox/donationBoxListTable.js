import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import "../../assets/scss/common.scss";
import { Table } from "antd";

export default function DonationBoxListTable({
  data,
  financeReport,
  boxCollectionTotalItem,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  // const handleDeleteDonationBox = async (payload) => {
  //   return deleteExpensesDetail(payload);
  // };
  // const queryClient = useQueryClient();
  // const deleteMutation = useMutation({
  //   mutationFn: handleDeleteDonationBox,
  //   onSuccess: (data) => {
  //     if (!data.error) {
  //       queryClient.invalidateQueries(["Collections"]);
  //     }
  //   },
  // });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      title: t("dashboard_Recent_DonorAmount"),
      dataIndex: "amount",
      key: "amount",
      width: 150,
      fixed: "left",
      render: (text) => <span style={{ fontWeight: 700 }}>{text}</span>, // Applying bold styling
    },
    {
      title: t("dashboard_Recent_DonorDate"),
      dataIndex: "dateTime",
      key: "dateTime",
      width: 180,
    },
    {
      title: t("remarks_financial_donationBox"),
      dataIndex: "remarks",
      key: "remarks",
      width: 200,
    },
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center", // Equivalent to `center: true`
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "edit",
      key: "edit",
      align: "center",
      width: 100,
    },
  ];

  const donatioBoxList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      amount: `₹${item?.amount.toLocaleString("en-IN")}`,
      remarks: (
        <div
          className="d-flex tableDes"
          dangerouslySetInnerHTML={{ __html: he?.decode(item?.remarks ?? "") }}
        />
      ),
      createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
      dateTime: moment(item?.collectionDate).format("DD MMM YYYY, h:mm A "),
      edit: (
        <img
          src={editIcon}
          width={35}
          className={financeReport ? "d-none" : "cursor-pointer "}
          onClick={() => {
            financeReport ? "" : history.push(`/hundi/edit/${item.id}`);
          }}
        />
      ),
    }));
  }, [data]);

  return (
    <div className="recentdonationtablewrapper">
      <Table
        columns={columns}
        dataSource={donatioBoxList}
        className="commonListTable"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: boxCollectionTotalItem,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
      />
    </div>
  );
}
