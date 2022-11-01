import { useTranslation,Trans } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";

export function RecentDonationTable() {
  const { t } = useTranslation();

  const columns = [
    {
      name: t("dashboard_Recent_DonorName"),
      selector: (row) => row.name,
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobile,
    },
    {
      name: t("dashboard_Recent_DonorType"),
      selector: (row) => row.type,
    },
    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.date,
    },
    {
      name: t("dashboard_Recent_DonorStatus"),
      selector: (row) => row.status,
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
    },
    {
      name: t("dashboard_Recent_DonorCommitId"),
      selector: (row) => row.commitment,
    },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: (row) => row.receipt,
    },
    {
      selector: (row) => row.action,
    },
  ];

  const data = [
    {
      id: 1,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 2,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 3,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 4,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 5,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 6,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 7,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 8,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 9,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 10,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 11,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 12,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 13,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 14,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 15,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 16,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 17,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 18,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },

    {
      id: 19,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 20,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
  ];

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;
  `;

  return (
    <RecentDonationTableWarper>
      <div className="d-flex justify-content-between  ">
        <p><Trans i18nKey={"dashboard_Recent_DonationCommitment"} /></p>
        <Link><Trans i18nKey={"dashboard_viewAll"} /></Link>
      </div>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={"470px"}
        columns={columns}
        data={data}
      />
    </RecentDonationTableWarper>
  );
}
