import { useTranslation, Trans } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { deleteExpensesDetail } from "../../api/expenseApi";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg"
export default function RecentDonationTable({ data }) {
  const handleDeleteExpenses = async (payload) => {
    return deleteExpensesDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteExpenses,
    onSuccess: (data) => {      
      if (!data.error) {        
        queryCient.invalidateQueries(["Expenses"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("commitment_Username"),
      selector: (row) => row.username,
      style: {
        font: "normal normal bold 10px/20px noto sans !important ",
      },
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorName"),
      selector: (row) => row.donarName,
      // width:"150px",
    },

    {
      name: t("category"),
      selector: (row) => row.category,
      // width:"150px",
    },

    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.date_time,
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
    },
    {
        name: t("dashboard_Recent_DonorCommitId"),
        selector: (row) => row.commitmentID,
      },
  ];

  const recent_Donation=useMemo(()=>{
    return data?.map((item,idx)=>{
      return {
        id:idx+1 ,
        username: (
          <div className="d-flex align-items-center ">
            <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
            <div>{item?.user?.name??""}</div>
          </div>
        ),
        mobileNumber: `+91-${item?.user?.mobileNumber}`,
        donarName: item?.donarName??item.user?.name,
        category: <div>{item?.masterCategory?.name}{item?.subCategory&&`(${item?.subCategory.name})`}</div>,
        date_time:"03:02 PM, 21 Aug 2022",
        amount:item?.amount,
        commitmentID:`${item?.commitmentId??"-"}`,
      }
    })
  },[data])
    
  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;

    .DonationViewAll{
      color: #FF8744;
      cursor: pointer;
    }
  `;

  return (
    <RecentDonationTableWarper>
       <div className="d-flex listHeading justify-content-between" >
            <p><Trans i18nKey={"dashboard_Recent_DonationCommitment"} /></p>
            <p 
              onClick={()=>history.push("/donation")}
            className="DonationViewAll">
              <Trans i18nKey={"dashboard_viewAll"} /></p> 
        </div>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={recent_Donation}
      />
    </RecentDonationTableWarper>
  );
}
