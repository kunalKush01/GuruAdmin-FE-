import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";

export default function RecentDonationTable({ data }) {
  // const handleDeleteExpenses = async (payload) => {
  //   return deleteExpensesDetail(payload);
  // };
  const queryClient = useQueryClient();
  // const deleteMutation = useMutation({
  //   mutationFn: handleDeleteExpenses,
  //   onSuccess: (data) => {
  //     if (!data.error) {
  //       queryClient.invalidateQueries(["Expenses"]);
  //     }
  //   },
  // });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("commitment_Username"),
      selector: (row) => row.username,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorName"),
      selector: (row) => row.donarName,
      width: "150px",
    },

    {
      name: t("category"),
      selector: (row) => row.category,
      width: "150px",
    },

    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.date_time,
      // width:"auto"
      width: "200px",
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorCommitId"),
      selector: (row) => row.commitmentID,
    },
  ];

  const recent_Donation = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        username: (
          <div className="d-flex align-items-center ">
            <img
              src={
                item?.user?.profilePhoto !== "" && item?.user?.profilePhoto
                  ? item?.user?.profilePhoto
                  : avtarIcon
              }
              style={{
                marginRight: "5px",
                width: "30px",
                objectFit: "cover",
                height: "30px",
              }}
              className="rounded-circle"
            />
            <div>{ConverFirstLatterToCapital(item?.user?.name ?? "")}</div>
          </div>
        ),
        mobileNumber: `+${item?.user?.countryCode?.replace("+", "") ?? "91"} ${
          item?.user?.mobileNumber
        }`,
        donarName: ConverFirstLatterToCapital(
          item?.donarName ?? item.user?.name
        ),
        category: (
          <div>
            {item?.masterCategory?.name}
            {item?.subCategory && `(${item?.subCategory.name})`}
          </div>
        ),
        date_time: moment(item?.createdAt)
          .utcOffset(0)
          .format(" DD MMM YYYY,h:mm A"),
        amount: <div>₹{item?.amount.toLocaleString("en-IN")}</div>,
        commitmentID: item.commitmentId
          ? item.commitmentId < 10
            ? `0${item.commitmentId}`
            : `${item.commitmentId}`
          : "_",
      };
    });
  }, [data]);

  const RecentDonationTableWrapper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 20px/23px Noto Sans !important;
    .DonationViewAll {
      color: #ff8744;
      cursor: pointer;
    }
    .recentDonationHeading {
      font: normal normal bold 20px/23px Noto Sans;
    }
  `;

  return (
    <RecentDonationTableWrapper>
      <div className="d-flex listHeading justify-content-between">
        <p className="recentDonationHeading">
          <Trans i18nKey={"dashboard_Recent_DonationCommitment"} />
        </p>
        <p
          onClick={() => history.push("/donation")}
          className="DonationViewAll"
        >
          <Trans i18nKey={"dashboard_viewAll"} />
        </p>
      </div>
      <CustomDataTable
        maxHeight={100}
        columns={columns}
        data={recent_Donation}
      />
    </RecentDonationTableWrapper>
  );
}
