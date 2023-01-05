import React, {useMemo} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { If } from "react-if-else-switch";
import {ConverFirstLatterToCapital} from "../../utility/formater";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const ReportWaraper = styled.div`
  color: #583703 !important;
  /* margin-right: 20px; */
  font: normal normal bold 15px/23px Noto Sans;
  .pending{
    color: #F8450D;
    font: normal normal bold 13px/23px Noto Sans;
  }
  .reSolved{
    color: #24C444;
    font: normal normal bold 13px/23px Noto Sans;
  }
`;
const ReportTable = ({data}) => {
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    // mutationFn: handleDeleteSubscribedUser,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["reportUser"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();
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

  const reportData = useMemo (()=>{
    return data.map((item,idx)=>{
      return{
        id:idx+1,
        name: (
            <div className="d-flex align-items-center ">
              <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
              <div>{ConverFirstLatterToCapital(item?.name??"-")}</div>
            </div>
        ),
        mobileNumber:item?.mobileNumber??"-",
        email:item?.email??"-",
        transactionIds: item?.transactionId??"-",
        status:<div className={`${item.disputeStatus == 'pending' ? "pending" : "reSolved"}`}>{ConverFirstLatterToCapital(item?.disputeStatus)}</div>
      }
    })
  })
  return (
    <ReportWaraper>
      <CustomDataTable 
          maxHieght={"470px"} 
          columns={column} 
          data={reportData} 
        />
    </ReportWaraper>
  );
};

export default ReportTable;
