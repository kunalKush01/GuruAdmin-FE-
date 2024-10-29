import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { If } from "react-if-else-switch";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import "../../assets/scss/common.scss";
import { Table, Tooltip } from "antd";
import disputeResolve from "../../assets/images/icons/dispute-resolve.svg";
import classNames from "classnames";
import { updateDisputeStatus } from "../../api/reportDisputeApi";
import Swal from "sweetalert2";

const ReportTable = ({ data }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();

  // Use useMutation to handle the dispute status update API call
  const { mutate: markAsResolved } = useMutation(updateDisputeStatus, {
    onSuccess: () => {
      // Invalidate and refetch data after successful mutation
      queryClient.invalidateQueries("reportUser");
    },
  });

  const handleMarkAsResolved = (disputeId) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to mark this dispute as resolved?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, resolve it!"),
      cancelButtonText: t("No, cancel!"),
    }).then((result) => {
      if (result.isConfirmed) {
        markAsResolved(disputeId);
      }
    });
  };
  // table colum and heading
  const columns = [
    {
      title: t("report_report_against"),
      dataIndex: "name",
      key: "name",
      width: 120,
      fixed: "left",
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      width: 120,
    },
    {
      title: t("dashboard_Recent_DonorNumber"),
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 120,
    },
    {
      title: t("subscribed_user_email"),
      dataIndex: "email",
      key: "email",
      width: 120,
    },
    {
      title: t("report_Transaction_IDs"),
      dataIndex: "transactionIds",
      key: "transactionIds",
      width: 120,
    },
    {
      title: t("dashboard_Recent_DonorStatus"),
      dataIndex: "status",
      key: "status",
      width: 120,
    },
    {
      title: t("Actions"),
      dataIndex: "action",
      key: "action",
      width: 50,
      fixed:"right"
    },
  ];

  const reportData = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        name: (
          <div className="d-flex align-items-center">
            <img
              src={
                item?.profileImage && item?.profileImage !== ""
                  ? item?.profileImage
                  : avtarIcon
              }
              className="cursor-pointer"
              style={{
                marginRight: "5px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
              }}
            />
            <div>{ConverFirstLatterToCapital(item?.name ?? "-")}</div>
          </div>
        ),
        mobileNumber:
          `+${item?.countryCode ?? "91"} ${item?.mobileNumber}` ?? "-",
        email: item?.email ?? "-",
        transactionIds: item?.transactionId ?? "-",
        status: (
          <div
            className={`${
              item.disputeStatus == "pending" ? "pending" : "reSolved"
            }`}
          >
            {ConverFirstLatterToCapital(item?.disputeStatus)}
          </div>
        ),
        description: item?.description ?? "",
        action: (
          <Tooltip title="Mark as resolved">
            <img
              src={disputeResolve}
              width={25}
              onClick={() => handleMarkAsResolved(item.id)}
              className={classNames("cursor-pointer", {
                "opacity-50": item.disputeStatus === "completed",
                "pointer-events-none": item.disputeStatus === "completed",
              })}
              alt="Edit"
            />
          </Tooltip>
        ),
      };
    });
  });
  return (
    <div className="reportwrapper">
      {/* <CustomDataTable maxHeight={""} columns={column} data={reportData} /> */}
      <Table
        columns={columns}
        dataSource={reportData}
        className="donationListTable"
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
      />
    </div>
  );
};

export default ReportTable;
