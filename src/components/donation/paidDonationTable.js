import moment from "moment";
import numberToWords from "number-to-words";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import "../../assets/scss/common.scss";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";

export default function DonationList({ data, topdf }, args) {
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
      name: t("paid_status"),
      selector: (row) => row.paidStatus,
      cellExport: (row) => row.paidStatus,
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
              src={
                item?.user?.profilePhoto !== "" && item?.user?.profilePhoto
                  ? item?.user?.profilePhoto
                  : avtarIcon
              }
              style={{ marginRight: "5px", width: "30px", height: "30px" }}
              className="rounded-circle"
            />
            <div>{ConverFirstLatterToCapital(item?.user?.name ?? "")}</div>
          </div>
        ),
        mobileNumber: item?.user?.mobileNumber,
        donarName: ConverFirstLatterToCapital(
          item?.donarName
            ? item?.donarName
            : item.user?.name
            ? item.user?.name
            : ""
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
        amount: <div>₹{item?.amount?.toLocaleString("en-IN")}</div>,
        commitmentID: item.commitmentId
          ? item.commitmentId < 10
            ? `0${item.commitmentId}`
            : `${item.commitmentId}`
          : "_",
        createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? "-"),
        paidStatus: ConverFirstLatterToCapital(item?.paidStatus ?? "-"),

        receipt: (
          <img
            src={receiptIcon}
            width={25}
            className="cursor-pointer"
            enabled={!!item?.receiptLink}
            style={{
              opacity: item?.receiptLink ? 1 : 0.4, // 70% opacity if link is disabled
            }}
            onClick={() => {
              if (item?.receiptLink) {
                const newWindow = window.open(
                  `https://docs.google.com/gview?url=${item.receiptLink}`
                );
                newWindow.onload = () => {
                  newWindow.print(); // Automatically trigger print dialog
                };
              }
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
    <div className="recentdonationtablewrapper">
      <CustomDataTable maxHeight={""} columns={columns} data={Donatio_data} />
      <ReactToPrint
        trigger={() => (
          <span id="AllPaidDonation" ref={pdfRef} style={{ display: "none" }}>
            Print!
          </span>
        )}
        content={() => ref.current}
        documentTitle={`Donation-Receipt.pdf`}
      />

      <div className="d-none">
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
    </div>
  );
}
