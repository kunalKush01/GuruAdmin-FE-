import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import CustomDataTable from "../partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { utils, writeFile } from 'xlsx';


export default function DonationListTable({ data  }) {
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("commitment_Username"),
      selector: row => row.username,
      cellExport: row => row.username,
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
      },
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: row => row.mobileNumber,
      cellExport: row => row.mobileNumber,
    },
    {
      name: t("dashboard_Recent_DonorName"),
      selector: row => row.donarName,
      cellExport: row => row.donarName,
    },

    {
      name: t("category"),
      selector: row => row.category,
      cellExport: row => row.category,
    },

    {
      name: t("dashboard_Recent_DonorDate"),
      selector: row => row.dateTime,
      cellExport: row => row.dateTime,

    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: row => row.amount,
      cellExport: row => row.amount,

    },
    {
        name: t("dashboard_Recent_DonorCommitId"),
        selector: row => row.commitmentID,
        cellExport: row => row.commitmentID,

      },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: row => row.receipt,
    },
  ];

  const Donatio_data=useMemo(()=>{
    return data.map((item,idx)=>{
      return {
        id:idx+1 ,
        username: (
          <div className="d-flex align-items-center ">
            <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
            <div>
              {ConverFirstLatterToCapital(item?.user?.name??"")}
            </div>
          </div>
        ),
        mobileNumber: item?.user?.mobileNumber,
        donarName:ConverFirstLatterToCapital (item?.donarName??item.user?.name),
        category: <div>{ConverFirstLatterToCapital(item?.masterCategory?.name)}{item?.subCategory&&`(${item?.subCategory?.name ?? ""})`}</div>,
        dateTime: moment(item.createdAt ?? item?.updatedAt).format(" DD MMM YYYY,hh:mm A"),
        amount:<div>₹&nbsp;{item?.amount}</div>,
        commitmentID:item.commitmentId?item.commitmentId<10?`0${item.commitmentId}`:`${item.commitmentId}`:"_",
        receipt: (
                <img
                  src={receiptIcon}
                  width={25}
                  className="cursor-pointer"
                  onClick={() =>
                    history.push(`/donation`)
                  }
                />
              ),
      }
    })
  },[data])

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    font: normal normal bold 15px/23px Noto Sans;

    .tableDes p{
      margin-bottom: 0;
    }
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        maxHieght={""}
        columns={columns}
        data={Donatio_data}
      />
    </RecentDonationTableWarper>
  );
}
