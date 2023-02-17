import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import CustomDataTable from "../partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { utils, writeFile } from "xlsx";
import ReactToPdf from "react-to-pdf";
import donationReceiptIcon from "../../assets/images/icons/donationReceipt.svg";
import Swal from "sweetalert2";
import templeImage from "../../assets/images/pages/login-v2.png";
import { useSelector } from "react-redux";
import { Icons } from "react-toastify";

export default function DonationListTable({ data, topdf }) {
  const { t } = useTranslation();
  const history = useHistory();
  const ref = useRef();
  const pdfRef = useRef();
    const options = {
      orientation: 'portrait',
      unit: 'in',
      format: [5,7]
  };

  const loggedTemple = useSelector((state) => state.auth.trustDetail);
  const columns = [
    {
      name: t("commitment_Username"),
      selector: (row) => row.username,
      cellExport: (row) => row.username,
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
      },
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
      cellExport: (row) => row.mobileNumber,
    },
    {
      name: t("dashboard_Recent_DonorName"),
      selector: (row) => row.donarName,
      cellExport: (row) => row.donarName,
    },

    {
      name: t("category"),
      selector: (row) => row.category,
      cellExport: (row) => row.category,
    },

    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.dateTime,
      cellExport: (row) => row.dateTime,
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      cellExport: (row) => row.amount,
    },
    {
      name: t("dashboard_Recent_DonorCommitId"),
      selector: (row) => row.commitmentID,
      cellExport: (row) => row.commitmentID,
    },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: (row) => row.receipt,
    },
  ];

  const Donatio_data = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        username: (
          <div className="d-flex align-items-center ">
            <img
              src={avtarIcon}
              style={{ marginRight: "5px", width: "25px" }}
            />
            <div>{ConverFirstLatterToCapital(item?.user?.name ?? "")}</div>
          </div>
        ),
        mobileNumber: item?.user?.mobileNumber,
        donarName: ConverFirstLatterToCapital(
          item?.donarName ?? item.user?.name
        ),
        category: (
          <div>
            {ConverFirstLatterToCapital(item?.masterCategory?.name)}
            {item?.subCategory && `(${item?.subCategory?.name ?? ""})`}
          </div>
        ),
        dateTime: moment(item.createdAt ?? item?.updatedAt).format(
          " DD MMM YYYY,hh:mm A"
        ),
        amount: <div>₹&nbsp;{item?.amount}</div>,
        commitmentID: item.commitmentId
          ? item.commitmentId < 10
            ? `0${item.commitmentId}`
            : `${item.commitmentId}`
          : "_",
        receipt: (
          <img
            src={receiptIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => {
              Swal.fire({
                width: 500,
                padding: "2em",
                title: `<img src="${donationReceiptIcon}" style="width:130px;"/>`,
                html: ` <div class="d-flex align-items-center" style="background:#FFF7E8;height:80px;border-radius:8px">
                          <img src=${templeImage} style="width:80px;height:80px; border-radius:8px" />
                          <div style="padding: 25px">
                            <div class="ms-2" style="font-size:17px;font-weight:bold;color:#583703">${
                              loggedTemple?.name
                            }</div>
                            <div class="ms-2" style="font-size:13px;color:#583703;text-align:left;">${"Ranakpur, Rajasthan"}</div>
                          </div>
                        </div>
                        <div style=" font: normal normal bold 16px/27px Noto Sans;
                        letter-spacing: 0px;
                        padding-top: 27px;
                        padding-bottom:25px;
                        color: #583703;">With each donation we receive, we become all that much closer to our goal. Thank you for making a difference through your compassion and generosity</div>
                        <div style="text-align:left;margin-top:5px;color: #583703;"><span style=" font: normal normal bold 16px/27px Noto Sans; ">Amount :</span> ${
                          item?.amount
                        } Rs</div>
                        <div style="text-align:left;margin-top:5px;color: #583703;"><span style=" font: normal normal bold 16px/27px Noto Sans; ">Mode of Payment :</span> ${"In Cash"}</div>
                        <div style="text-align:left;margin-top:5px;color: #583703;"><span style=" font: normal normal bold 16px/27px Noto Sans; ">Donor Name :</span> ${ConverFirstLatterToCapital(
                          item?.donarName ?? item.user?.name
                        )}</div>
                        <div style="text-align:left;margin-top:5px;color: #583703;"><span style=" font: normal normal bold 16px/27px Noto Sans; ">Date & Time :</span> ${moment(
                          item.createdAt ?? item?.updatedAt
                        ).format(" DD MMM YYYY,hh:mm A")}</div>
                        `,
                confirmButtonText: ` ${t("downloadReceipt")}`,
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  pdfRef.current.click();
                  // deleteMutation.mutate(item.id);
                }
              });
            }}
          />
        ),
      };
    });
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    font: normal normal bold 15px/23px Noto Sans;

    .tableDes p {
      margin-bottom: 0;
    }
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable maxHieght={""} columns={columns} data={Donatio_data} />
      <ReactToPdf targetRef={ref} filename="Donation-Receipt.pdf" options={options}>
        {({ toPdf }) => (
          <button onClick={toPdf} ref={pdfRef}>
            Generate pdf
          </button>
        )}
      </ReactToPdf>
      <div
        ref={ref}
        style={{ width: "479px", height: "100%", textAlign: "center", padding:"80px 40px" }}
      >
        <img src={donationReceiptIcon} style={{ width: "130px" }} />
        <div
          className="d-flex align-items-center"
          style={{ background: "#FFF7E8", height: "80px", borderRadius: "8px" ,marginTop:"20px" }}
        >
          <img
            src={templeImage}
            style={{ width: "80px", height: "80px", borderRadius: "8px" }}
          />
          <div style={{ padding: "25px" }}>
            <div
              className="ms-2"
              style={{ fontSize: "17px", fontWeight: "bold", color: "#583703" }}
            >
              {loggedTemple?.name}
            </div>
            <div
              class="ms-2"
              style={{ fontSize: "13px", color: "#583703", textAlign: "left" }}
            >
              {"Ranakpur, Rajasthan"}
            </div>
          </div>
        </div>
        <div
          style={{
            font: "normal normal bold 16px/27px Noto Sans",
            letterSpacing: "0px",
            paddingTop: "27px",
            paddingBottom: "25px",
            color: "#583703",
          }}
        >
          With each donation we receive, we become all that much closer to our
          goal. Thank you for making a difference through your compassion and
          generosity
        </div>

        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Amount :
          </span>{" "}
          {2000} Rs
        </div>
        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Mode of Payment :
          </span>{" "}
          {"In Cash"}
        </div>
        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Donor Name :
          </span>{" "}
          {"Sanjana Jain"}
        </div>
        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Date & Time :
          </span>{" "}
          {"05:53 PM, 11 Aug 2022"}
        </div>

        {/* {data.map((item)=>{
          return(
<>
<div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Amount :
          </span>{" "}
          {item?.amount} Rs
        </div>
        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Mode of Payment :
          </span>{" "}
          {"In Cash"}
        </div>
        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Donor Name :
          </span>{" "}
          {ConverFirstLatterToCapital(item?.donarName ?? item.user?.name)}
        </div>
        <div style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}>
          <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
            Date & Time :
          </span>{" "}
          {moment(item.createdAt ?? item?.updatedAt).format(
            " DD MMM YYYY,hh:mm A"
          )}
        </div>

</>
          )
        })} */}
      </div>
      {/* </div> */}
    </RecentDonationTableWarper>
  );
}
