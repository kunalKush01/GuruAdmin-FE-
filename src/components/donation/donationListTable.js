import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPdf from "react-to-pdf";
import ReactToPrint from "react-to-print";
import { Button, Input, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import donationReceiptIcon from "../../assets/images/icons/donationReceipt.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import templeImage from "../../assets/images/pages/login-v2.png";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import numberToWords from "number-to-words";

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

export default function DonationListTable({ data, topdf }, args) {
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
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
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
      name: t("dashboard_Recent_DonorAmount"),
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
        mobileNumber: `+${item?.user?.countryCode?.replace('+','') ?? '91'} ${item?.user?.mobileNumber}`,
        donarName: ConverFirstLatterToCapital(
          item?.donarName ?? item.user?.name
        ),
        category: (
          <div>
            {ConverFirstLatterToCapital(item?.masterCategory?.name)}
            {/* {item?.subCategory && `(${item?.subCategory?.name ?? ""})`} */}
          </div>
        ),
        subCategory: ConverFirstLatterToCapital(item?.category?.name ?? "-"),
        dateTime: moment(item.createdAt ?? item?.updatedAt).format(
          " DD MMM YYYY,hh:mm A"
        ),
        amount: <div>₹&nbsp;{item?.amount.toLocaleString("en-IN")}</div>,
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
      };
    });
  }, [data]);

  const inWordsNumber = numberToWords
    .toWords(parseInt(receipt?.amount ?? 0))
    .toUpperCase();

  return (
    <RecentDonationTableWarper>
      <CustomDataTable maxHieght={""} columns={columns} data={Donatio_data} />
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
        {/* <div
          ref={ref}
          style={{
            width: "100%",
            // border:"1px solid black",
            // background:"yellow",
            height: "1100px",
            display: "flex",
            justifyContent: "center",
            // background:"yellow",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "479px",
              height: "auto",
              textAlign: "center",
              padding: "2rem 2rem",
            }}
          >
            <img src={donationReceiptIcon} style={{ width: "130px" }} />
            <div
              className="d-flex align-items-center"
              style={{
                background: "#FFF7E8",
                height: "80px",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <img
                src={loggedTemple?.profilePhoto ?? ""}
                style={{ width: "80px", height: "80px", borderRadius: "8px" }}
              />
              <div style={{ padding: "25px" }}>
                <div
                  className="ms-2"
                  style={{
                    fontSize: "17px",
                    fontWeight: "bold",
                    color: "#583703",
                  }}
                >
                  {ConverFirstLatterToCapital(loggedTemple?.name ?? "")}
                </div>
                <div
                  class="ms-2"
                  style={{
                    fontSize: "13px",
                    color: "#583703",
                    textAlign: "left",
                  }}
                >
                  {`${loggedTemple?.city ?? ""}, ${loggedTemple?.state ?? ""}`}
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
              With each donation we receive, we become all that much closer to
              our goal. Thank you for making a difference through your
              compassion and generosity
            </div>

            <div
              style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}
            >
              <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
                Amount :
              </span>{" "}
              {receipt?.amount} Rs
            </div>
            <div
              style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}
            >
              <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
                Mode of Payment :
              </span>{" "}
              {receipt?.paymentMethod}
            </div>
            <div
              style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}
            >
              <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
                Donor Name :
              </span>{" "}
              {ConverFirstLatterToCapital(
                receipt?.donarName || receipt?.user?.name || ""
              )}
            </div>
            <div
              style={{ textAlign: "left", marginTop: "5px", color: "#583703" }}
            >
              <span style={{ font: "normal normal bold 16px/27px Noto Sans" }}>
                Date & Time :
              </span>{" "}
              {moment(receipt?.createdAt ?? receipt?.updatedAt).format(
                " DD MMM YYYY,hh:mm A"
              )}
            </div>
          </div>
        </div> */}
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
                  <div className="col-5" >
                    01
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Date/दिनांक</div>
                  <div className="col-5" >
                    {moment(receipt?.createdAt ?? receipt?.updatedAt).format(
                      " DD MMM YYYY"
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Name/नाम &nbsp;</div>
                  <div className="col-5" >
                    {ConverFirstLatterToCapital(
                      receipt?.donarName || receipt?.user?.name || ""
                    )}
                  </div>
                </div>
                <div className="row ">
                  <div className="col-1"></div>
                  <div className="col-5">Pan/पैन</div>
                  <div className="col-5" >
                    ASED123456
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Mobile/मोबाइल</div>
                  <div className="col-5" >
                    {receipt?.user?.countryCode} {receipt?.user?.mobileNumber}
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Address/पता</div>
                  <div className="col-5" >
                    Ratanada, Jodhpur Rajasthan
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Mode of Payment/भुगतान माध्यम</div>
                  <div className="col-5" >
                    {ConverFirstLatterToCapital(
                      receipt?.paymentMethod ?? "None"
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-5">Remarks/विवरण </div>
                  <div className="col-5" >
                    Dummy
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                     font: "normal normal bold 18px/45px noto sans",
                  }}
                >
                  <div className="col-1"></div>
                  <div className="col-5">Amount/राशि</div>
                  <div className="col-5" >
                    ₹{receipt?.amount?.toLocaleString("en-In")}
                  </div>
                </div>
                <div className="row"
                 style={{
                   font: "normal normal bold 18px/45px noto sans",
                }}
                >
                  <div className="col-1"></div>
                  <div className="col-5">In Words(शब्दों में)</div>
                  <div className="col-5" >{inWordsNumber} ONLY</div>
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
              <div className="col-5" style={{textAlign:'end'}} >
                (Logo) Powered by apnamandir.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalBody>
         
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              pdfRef.current.click();
              setTimeout(() => {
                toggle();
                Swal.fire({
                  icon: "success",
                  title: "Receipt Download Successfully.",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }, 300);
            }}
          >
            Download
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal> */}
    </RecentDonationTableWarper>
  );
}
