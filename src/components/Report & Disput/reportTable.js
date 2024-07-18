import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { If } from "react-if-else-switch";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import '../../../src/styles/common.scss';

const ReportWrapper = styled.div``;
;
const ReportTable = ({ data }) => {
  const { t } = useTranslation();

  // table colum and heading
  const column = [
    {
      name: t("report_report_against"),
      selector: (row) => row.name,
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
        // font: "normal normal bold 10px/20px noto sans !important ",
      },
      width: "250px",
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
      width: "250px",
    },
    {
      name: t("subscribed_user_email"),
      selector: (row) => row.email,
      width: "200px",
    },
    {
      name: t("report_Transaction_IDs"),
      selector: (row) => row.transactionIds,
      width: "220px",
    },
    {
      name: t("dashboard_Recent_DonorStatus"),
      selector: (row) => row.status,
      width: "210px",
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
      };
    });
  });
  return (
    <div className="reportwrapper">
      <CustomDataTable maxHeight={""} columns={column} data={reportData} />
    </div>
  );
};

export default ReportTable;
