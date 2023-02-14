import { DateProfileGenerator } from "@fullcalendar/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import CustomDataTable from "../partials/CustomDataTable";

export default function DonationBoxListTable({ data }) {
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
    },
    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.dateTime,
    },
    {
      name: t("remarks_financial_donationBox"),
      selector: (row) => row.remarks,
    },

    {
      name: t(""),
      selector: (row) => row.edit,
    },
  ];

  const donatioBoxList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      amount:`₹${item.amount}`,
      remarks:<div className="d-flex tableDes" dangerouslySetInnerHTML={{__html:he.decode(item?.remarks??"")}} /> ,
      dateTime:moment(item?.collectionDate).utcOffset(0).format("h:mm A, DD MMM YYYY"),
      edit: (
        <img
          src={editIcon}
          width={35}
          className="cursor-pointer"
          onClick={() =>
            history.push(`/Hundi/edit/${item.id}`)
          }
        />
      ),
    }));
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    /* margin-right: 20px; */
    font: normal normal bold 15px/23px Noto Sans;

    .tableDes p{
      margin-bottom: 0;
    }
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={donatioBoxList}
      />
    </RecentDonationTableWarper>
  );
}
