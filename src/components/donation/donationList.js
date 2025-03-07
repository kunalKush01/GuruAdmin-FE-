import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import numberToWords from "number-to-words";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { Spinner } from "reactstrap";
import styled from "styled-components";
import { donationDownloadReceiptApi } from "../../api/donationApi";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import whatsappIcon from "../../assets/images/icons/whatsappIcon.svg";
import templeImage from "../../assets/images/pages/login-v2.png";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { EDIT } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import EditDonation from "./editDonation";
import { toast } from "react-toastify";
import "../../assets/scss/common.scss";
import { Table } from "antd";

export default function DonationList(
  {
    data,
    topdf,
    allPermissions,
    subPermission,
    financeReport,
    donationTotalItem,
    currentPage,
    pageSize,
    onChangePage,
    onChangePageSize,
  },
  args
) {
  const { t } = useTranslation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef();
  const pdfRef = useRef();
  const options = {
    orientation: "portrait",
    unit: "in",
    format: [5, 7],
  };

  const downloadReceipt = useMutation({
    mutationFn: donationDownloadReceiptApi,
    onSuccess: (data) => {
      if (!data.error) {
        setIsLoading(false);
        window.open(`${data?.result}`, "_blank");
      }
    },
  });

  const loggedTemple = useSelector((state) => state.auth.trustDetail);
  const [receipt, setReceipt] = useState();
  const [modal, setModal] = useState({
    modal: false,
    donationId: "",
    estimateAmount: "",
  });
  const toggle = (row) => {
    setModal({
      modal: !modal.modal,
      donationId: row?._id,
      estimateAmount: row?.amount,
    });
  };

  const columns = [
    {
      title: t("commitment_Username"),
      dataIndex: "username",
      key: "username",
      width: 150,
      fixed: "left",
    },
    {
      title: t("dashboard_Recent_DonorNumber"),
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorName"),
      dataIndex: "donarName",
      key: "donarName",
      width: 150,
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: t("categories_sub_category"),
      dataIndex: "subCategory",
      key: "subCategory",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorDate"),
      dataIndex: "dateTime",
      key: "dateTime",
      width: 180,
    },
    {
      title: t("original_amount"),
      dataIndex: "originalAmount",
      key: "originalAmount",
      width: 180,
    },
    {
      title: t("estimate_amount"),
      dataIndex: "amount",
      key: "amount",
      width: 180,
    },
    {
      title: t("dashboard_Recent_DonorCommitId"),
      dataIndex: "commitmentID",
      key: "commitmentID",
      width: 180,
    },
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
    },
    // {
    //   title: t("dashboard_Recent_DonorReceipt"),
    //   dataIndex: "receipt",
    //   key: "receipt",
    //   width: 150,
    // },
    // {
    //   title: t("action"),
    //   dataIndex: "edit",
    //   key: "action",
    //   width: 100,
    //   fixed:"right"
    // },
  ];

  const Donatio_data = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        username: (
          <div className="d-flex align-items-center">
            <img
              src={
                item?.user?.profilePhoto !== "" && item?.user?.profilePhoto
                  ? item?.user?.profilePhoto
                  : avtarIcon
              }
              style={{
                marginRight: "5px",
                width: "30px",
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
            {ConverFirstLatterToCapital(item?.masterCategory?.name ?? "-")}
          </div>
        ),
        subCategory: ConverFirstLatterToCapital(item?.category?.name ?? "-"),
        dateTime: moment(item.createdAt ?? item?.updatedAt).format(
          " DD MMM YYYY,hh:mm A"
        ),
        originalAmount: (
          <div>
            {item?.originalAmount
              ? `₹${item?.originalAmount.toLocaleString("en-IN")}`
              : "-"}
          </div>
        ),
        amount: <div>₹{item?.amount.toLocaleString("en-IN")}</div>,
        commitmentID: item.commitmentId
          ? item.commitmentId < 10
            ? `0${item.commitmentId}`
            : `${item.commitmentId}`
          : "_",
        createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? "-"),
        receipt: (
          <div className="d-flex align-items-center">
            {isLoading === item?._id ? (
              <Spinner color="success" />
            ) : (
              <img
                src={receiptIcon}
                width={25}
                className="cursor-pointer me-2"
                onClick={() => {
                  if (item.receiptLink) {
                    window.open(`${item.receiptLink}`, "_blank");
                  }
                }}
              />
            )}
            <img
              src={whatsappIcon}
              width={25}
              className="cursor-pointer"
              onClick={() => {
                if (!item.receiptLink) {
                  toast.error("Receipt link not available at this moment");
                } else {
                  const message = `Hello ${
                    item.donarName
                  }, thank you for your donation of ₹${item.amount.toLocaleString(
                    "en-IN"
                  )} to ${loggedTemple?.name}. Here is your receipt: ${
                    item.receiptLink
                  }`;
                  const phoneNumber = `${
                    item.user?.countryCode?.replace("+", "") || ""
                  }${item.user?.mobileNumber || ""}`;
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                      message
                    )}`,
                    "_blank"
                  );
                }
              }}
            />
          </div>
        ),
        edit:
          item?.isArticle &&
          (allPermissions?.name === "all" ||
            subPermission?.includes(EDIT) ||
            financeReport) ? (
            <img
              src={editIcon}
              width={35}
              className={financeReport ? "d-none" : "cursor-pointer "}
              onClick={() => {
                financeReport ? "" : toggle(item);
              }}
            />
          ) : (
            ""
          ),
      };
    });
  }, [data, isLoading]);

  const inWordsNumber = numberToWords
    .toWords(parseInt(receipt?.amount ?? 0))
    .toUpperCase();

  return (
    <div className="recentdonationtablewrapper">
      <Table
        columns={columns}
        dataSource={Donatio_data}
        className="commonListTable"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: donationTotalItem,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
      />
      <ReactToPrint
        trigger={() => (
          <span id="AllDonations" ref={pdfRef} style={{ display: "none" }}>
            Print!
          </span>
        )}
        content={() => ref.current}
        documentTitle={`Donation-Receipt.pdf`}
      />
      <div className="d-none">
        <div ref={ref}>
          <div
            style={{
              width: "90%",
              margin: "auto",
              font: "normal normal normal 17px/30px noto sans",
              color: "#583703",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "0rem 2rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                width="80px"
                src="https://2.bp.blogspot.com/_mVYMJS6_Jrs/TKcSEfuroZI/AAAAAAAAAIE/lcseX2-TplM/s1600/jain_prateek_chinha.jpg"
                style={{ mixBlendMode: "color-burn" }}
              />
              <h1 style={{ color: "#583703" }}>{loggedTemple?.name}</h1>
              <img
                width="80px"
                src="https://2.bp.blogspot.com/_mVYMJS6_Jrs/TKcSEfuroZI/AAAAAAAAAIE/lcseX2-TplM/s1600/jain_prateek_chinha.jpg"
                style={{ mixBlendMode: "color-burn" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <div style={{ width: "50%", display: "grid" }}>
                <span>{loggedTemple?.name}</span>
                <span>Reg. No. BK-IV-655-2022-23</span>
                <span>PAN: {loggedTemple?.panNumber}</span>
              </div>

              <div style={{ width: "50%" }}>
                <span>Registered at: </span>
                <span>{loggedTemple?.address}</span>
              </div>
            </div>

            <div
              style={{
                color: "#ff8744",
                fontWeight: "bold",
                fontSize: "20px",
                textAlign: "center",
                margin: "1.5rem 0rem",
              }}
            >
              दान रसीद
              <span style={{ fontSize: "17px" }}>(Donation Receipt)</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "50%" }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <div style={{ display: "grid", width: "30%" }}>
                    <span style={{ fontSize: "20px" }}>रसीद नं.</span>
                    <span>(Receipt No.)</span>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #ff8744",
                      width: "60%",
                      minHeight: "32px",
                    }}
                  >
                    {receipt?.receiptNo}
                  </div>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <div style={{ display: "grid", width: "25%" }}>
                    <span style={{ fontSize: "20px" }}>दिनांक:</span>
                    <span>(Date)</span>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #ff8744",
                      width: "60%",
                      minHeight: "32px",
                    }}
                  >
                    {moment(receipt?.createdAt ?? receipt?.updatedAt).format(
                      " DD MMM YYYY"
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "start" }}>
                <div style={{ display: "grid", width: "20%" }}>
                  <span style={{ fontSize: "20px" }}> दाता का नाम:</span>
                  <span>(Donar Name)</span>
                </div>
                <div
                  style={{
                    borderBottom: "2px solid #ff8744",
                    width: "80%",
                    minHeight: "32px",
                  }}
                >
                  {ConverFirstLatterToCapital(
                    receipt?.donarName || receipt?.user?.name || ""
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "50%" }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <div style={{ display: "grid", width: "25%" }}>
                    <span style={{ fontSize: "20px" }}>मोबाइल:</span>
                    <span>(Mobile)</span>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #ff8744",
                      width: "65%",
                      minHeight: "32px",
                    }}
                  >
                    {receipt?.user?.countryCode} {receipt?.user?.mobileNumber}
                  </div>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <div style={{ display: "grid", width: "30%" }}>
                    <span style={{ fontSize: "20px" }}>निवासी:</span>
                    <span>(Residing at)</span>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #ff8744",
                      width: "70%",
                      minHeight: "32px",
                    }}
                  >
                    {receipt?.user?.address ?? ""}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "1.5rem 0rem",
              }}
            >
              <div style={{ width: "50%" }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <div style={{ display: "grid", width: "25%" }}>
                    <span style={{ fontSize: "20px" }}>पैन:</span>
                    <span>(PAN )</span>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #ff8744",
                      width: "65%",
                      minHeight: "32px",
                    }}
                  >
                    {receipt?.user?.pan}
                  </div>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <div style={{ display: "flex", alignItems: "start" }}>
                  <div style={{ display: "grid", width: "30%" }}>
                    <span style={{ fontSize: "20px" }}>राशि:</span>
                    <span>(Amount)</span>
                  </div>
                  <div
                    style={{
                      borderBottom: "2px solid #ff8744",
                      width: "70%",
                      minHeight: "32px",
                    }}
                  >
                    ₹{receipt?.amount?.toLocaleString("en-In")}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "start" }}>
              <div style={{ display: "grid", width: "35%" }}>
                <span style={{ fontSize: "20px" }}>
                  दान का माध्यम तथा सन्दर्भ नं
                </span>
                <span>(Transaction Details)</span>
              </div>
              <div
                style={{
                  borderBottom: "2px solid #ff8744",
                  width: "70%",
                  minHeight: "32px",
                }}
              >
                {ConverFirstLatterToCapital(receipt?.paymentMethod ?? "")}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                margin: "1.5rem 0rem",
              }}
            >
              <div style={{ display: "grid", width: "20%" }}>
                <span style={{ fontSize: "20px" }}>दाता का मद :</span>
                <span>(Donation for)</span>
              </div>
              <div
                style={{
                  borderBottom: "2px solid #ff8744",
                  width: "80%",
                  minHeight: "32px",
                }}
              >
                {receipt?.masterCategory?.name} / {receipt?.category?.name}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                margin: "2rem 0rem",
              }}
            >
              <div
                style={{
                  width: "50%",
                  display: "grid",
                  textAlign: "end",
                  marginTop: "4rem",
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  दान प्राप्तकर्ता हस्ताक्षर
                </span>
                <span>(Donation recipient signature)</span>
              </div>
            </div>

            <div
              style={{ width: "100%", display: "grid", textAlign: "center" }}
            >
              <span>
                This is system generated receipt/ यह कंप्यूटर के द्वारा बनाई गई
                रसीद है
              </span>
              <span>Powered by apnadharm.com</span>
            </div>
          </div>
        </div>
      </div>
      <EditDonation
        isOpen={modal?.modal}
        toggle={toggle}
        donationId={modal?.donationId}
        estimateAmount={modal?.estimateAmount}
      />
    </div>
  );
}
