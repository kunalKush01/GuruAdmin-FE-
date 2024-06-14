import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import numberToWords from "number-to-words";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPdf from "react-to-pdf";
import ReactToPrint from "react-to-print";
import { Button, Input, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import donationReceiptIcon from "../../assets/images/icons/donationReceipt.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import whatsappIcon from "../../assets/images/icons/whatsappIcon.svg";
import templeImage from "../../assets/images/pages/login-v2.png";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { EDIT } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import EditDonation from "./editDonation";
import receiptLogo from "./png-transparent-orange-illustration-jainism-jain-symbols-jain-temple-ahimsa-jainism-angle-white-text-removebg-preview.png";

const RecentDonationTableWarper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;

export default function DonationListTable(
  { data, topdf, allPermissions, subPermission, financeReport },
  args
) {
  const { t } = useTranslation();
  const history = useHistory();
  const ref = useRef();
  const pdfRef = useRef();
  const options = {
    orientation: "portrait",
    unit: "in",
    format: [5, 7],
  };

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
      name: t("commitment_Username"),
      selector: (row) => row.username,
      cellExport: (row) => row.username,
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
      },
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
      cellExport: (row) => row.mobileNumber,
      width: "150px",
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
      width: "120px",
    },
    {
      name: t("categories_sub_category"),
      selector: (row) => row.subCategory,
      cellExport: (row) => row.subCategory,
    },
    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.dateTime,
      width: "150px",
      cellExport: (row) => row.dateTime,
    },
    {
      name: t("original_amount"),
      width: "180px",
      selector: (row) => row.originalAmount,
      cellExport: (row) => row.originalAmount,
    },
    {
      name: t("estimate_amount"),
      width: "180px",
      selector: (row) => row.amount,
      cellExport: (row) => row.amount,
    },
    {
      name: t("dashboard_Recent_DonorCommitId"),
      selector: (row) => row.commitmentID,
      width: "180px",
      cellExport: (row) => row.commitmentID,
    },
    {
      name: t("created_by"),
      selector: (row) => row.createdBy,
      cellExport: (row) => row.createdBy,
    },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: (row) => row.receipt,
    },
    {
      name: "WhatsApp Receipt",
      selector: (row) => row.whatsapp,
    },
    {
      name: "",
      selector: (row) => row.edit,
    },
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
            {/* {item?.subCategory && `(${item?.subCategory?.name ?? ""})`} */}
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
          <img
            src={receiptIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => {
              setReceipt(item);
              setTimeout(() => {
                pdfRef.current.click();
              }, 100);
            }}
          />
        ),
        whatsapp: (
          <img
            src={whatsappIcon}
            width={25}
            className="cursor-pointer"
            onClick={() => {
              const message = `Hello ${item.donarName}, thank you for your donation of ₹${item.amount.toLocaleString("en-IN")} to ${loggedTemple?.name}. ${
                item.receiptLink ? `Here is your receipt: https://docs.google.com/gview?url=${item.receiptLink}` : "Unfortunately, we could not generate your receipt at this time."
              }`;
              const phoneNumber = `${item.user?.countryCode?.replace("+", "") || ""}${item.user?.mobileNumber || ""}`;
              window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
            }}
          />
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
  }, [data]);

  const inWordsNumber = numberToWords
    .toWords(parseInt(receipt?.amount ?? 0))
    .toUpperCase();

  return (
    <RecentDonationTableWarper>
      <CustomDataTable maxHeight={""} columns={columns} data={Donatio_data} />
      <ReactToPrint
        trigger={() => (
          <span id="AllDonations" ref={pdfRef} style={{ display: "none" }}>
            Print!
          </span>
        )}
        content={() => ref.current}
        documentTitle={`Donation-Receipt.pdf`}
      />
      {/* <div className="d-none">
        <div ref={ref}>
          <div
            className="container"
            style={{
              font: "normal normal normal 18px/45px noto sans",
              color: "#000000",
            }}
          >
            <div className="row">
              <div className="col-12">
                <div className="row justify-content-center">
                  <div
                    className="col-10"
                    // style={{margin:'auto'}}
                  >
                    <img
                      src={loggedTemple?.profilePhoto ?? ""}
                      style={{
                        width: "100%",
                        marginTop: "1rem",
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Receipt No/रसीद क्रमांक</div>
                  <div className="col-5">{receipt?.receiptNo ?? "-"}</div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Date/दिनांक</div>
                  <div className="col-5">
                    {moment(receipt?.createdAt ?? receipt?.updatedAt).format(
                      " DD MMM YYYY"
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Name/नाम &nbsp;</div>
                  <div className="col-5">
                    {ConverFirstLatterToCapital(
                      receipt?.donarName || receipt?.user?.name || ""
                    )}
                  </div>
                </div>
                <div className="row ">
                  <div className="col-1"></div>
                  <div className="col-5">Pan/पैन</div>
                  <div className="col-5">{receipt?.user?.panNumber ?? "-"}</div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Mobile/मोबाइल</div>
                  <div className="col-5">
                    {receipt?.user?.countryCode} {receipt?.user?.mobileNumber}
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Address/पता</div>
                  <div className="col-5">{receipt?.user?.address ?? "-"}</div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Mode of Payment/भुगतान माध्यम</div>
                  <div className="col-5">
                    {ConverFirstLatterToCapital(
                      receipt?.paymentMethod ?? "None"
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Remarks/विवरण </div>
                  <div className="col-5">{receipt?.remarks ?? "-"}</div>
                </div>
                <div
                  className="row"
                  style={{
                    font: "normal normal bold 18px/45px noto sans",
                  }}
                >
                  <div className="col-1"></div>
                  <div className="col-5">Amount/राशि</div>
                  <div className="col-5">
                    ₹{receipt?.amount?.toLocaleString("en-In")}
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    font: "normal normal bold 18px/45px noto sans",
                  }}
                >
                  <div className="col-1"></div>
                  <div className="col-5">In Words(शब्दों में)</div>
                  <div className="col-5">{inWordsNumber} ONLY</div>
                </div>
              </div>
            </div>
          </div>
          <hr style={{ height: "3px" }} />
          <div
            className="container"
            style={{
              font: "normal normal normal 18px/33px noto sans",
              color: "#000000",
            }}
          >
            <div className="row">
              <div className="col-1"></div>
              <div
                className="col-5"
                // style={{background:'blue'}}
              >
                This is system generated receipt/ यह कंप्यूटर के द्वारा बनाई गई
                रसीद है
              </div>
              <div className="col-5" style={{ textAlign: "end" }}>
                (Logo) Powered by apnamandir.com
              </div>
            </div>
          </div>
        </div>
      </div> */}
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

            {/* <div
              style={{
                width: "100%",
                margin: "1.5rem 0rem",
                justifyContent: "end",
                display: "flex",
              }}
            >
              <div style={{ width: "65%", display: "flex" }}>
                <div style={{ display: "grid" }}>
                  <span style={{ fontSize: "20px" }}>राशि: </span>
                  <span>(Amount)</span>
                </div>
                <div
                  style={{
                    border: "1px solid red",
                    marginLeft: ".5rem",
                    width: "100%",
                    padding: "1rem",
                  }}
                >
                  ₹{receipt?.amount?.toLocaleString("en-In")}
                </div>
              </div>
            </div> */}

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

            {/* <div
              style={{
                margin: "1.5rem 0rem",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <span>To DONATE:</span>
              <span></span>
            </div> */}

            {/* <div
              style={{
                margin: "1.5rem 0rem",
                fontSize: "20px",
              }}
            >
              <span>UPI:</span>
              <span></span>
            </div> */}

            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                margin: "2rem 0rem",
              }}
            >
              {/* <div style={{ width: "50%", display: "grid" }}>
                <span>Bank Details:</span>
                <div>
                  <span>A/c no.</span>
                  <span>{loggedTemple?.accountNumber}</span>
                </div>
                <div>
                  <span>IFSC Code: </span>
                  <span>{loggedTemple?.ifsc_code}</span>
                </div>
                <div>
                  <span>Branch: </span>
                  <span>{loggedTemple?.branch}</span>
                </div>
              </div> */}

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
              <span>Powered by apnadharam.com</span>
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
    </RecentDonationTableWarper>
  );
}
