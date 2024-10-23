import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import "../../assets/scss/common.scss";
import { Table } from "antd";
export default function LogListTable({ data }) {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("logData_editedBy"),
      dataIndex: "editedBy",
      key: "editedBy",
    },
    {
      title: t("logData_createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: t("logData_timeDate"),
      dataIndex: "timeDate",
      key: "timeDate",
    },
    {
      title: t("logData_createdAmount"),
      dataIndex: "createdAmount",
      key: "createdAmount",
    },
    {
      title: t("logData_editedAmount"),
      dataIndex: "editedAmount",
      key: "editedAmount",
    },
  ];
  const logData = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        editedBy: item?.updatedUser?.name,
        createdBy: item?.createdUser?.name,
        timeDate: moment(item.createdAt).format(" DD MMM YYYY,hh:mm A"),
        createdAmount: item?.oldAmount,
        editedAmount: item?.amount,
      };
    });
  });

  return (
    <div className="loglisttablewrapper">
      {/* <CustomDataTable columns={columns} maxHeight="350px" data={logData} /> */}
      <Table
      className="donationListTable"
        columns={columns} 
        dataSource={logData} 
      />
    </div>
  );
}
