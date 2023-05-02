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

export default function DonationBoxListTable({ data, financeReport }) {
  const handleDeleteDonationBox = async (payload) => {
    return deleteExpensesDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteDonationBox,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Collections"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
      width: "350px",
    },
    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.dateTime,
      width: "350px",
    },
    {
      name: t("remarks_financial_donationBox"),
      selector: (row) => row.remarks,
      width: "350px",
    },
    {
      name: t("created_by"),
      center: true,
      selector: (row) => row.createdBy,
    },
    {
      name: t(""),
      center: true,
      selector: (row) => row.edit,
    },
    // {
    //   name: t(""),
    //   center: true,
    //   selector: (row) => row.viewLogs,
    // },
  ];

  const donatioBoxList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      amount: `₹${item.amount}`,
      remarks: (
        <div
          className="d-flex tableDes"
          dangerouslySetInnerHTML={{ __html: he.decode(item?.remarks ?? "") }}
        />
      ),
      createdBy:ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
      dateTime: moment(item?.collectionDate)
        .format("DD MMM YYYY, h:mm A "),
      edit: (
        <img
          src={editIcon}
          width={35}
          className={
            financeReport ? "d-none" : "cursor-pointer "
          }
          onClick={() => {
            financeReport ? "" : history.push(`/donation_box/edit/${item.id}`);
          }}
        />
      ),
      // viewLogs: (
      //   <div
      //     className="cursor-pointer viewLogs"
      //     onClick={() =>
      //       history.push(`/financial_reports/Hundi/Logs/${item.id}`, item._id)
      //     }
      //   >
      //     <Trans i18nKey={"viewLogs"} />
      //   </div>
      // ),
    }));
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    /* margin-right: 20px; */
    font: normal normal bold 15px/23px Noto Sans;
    .tableDes p {
      margin-bottom: 0;
    }
    .viewLogs {
      font: normal normal bold 15px/33px Noto Sans;
      color: #ff8744;
    }
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable maxHieght={""} columns={columns} data={donatioBoxList} />
    </RecentDonationTableWarper>
  );
}
