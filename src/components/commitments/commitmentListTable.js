import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import { useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import {
  deleteCommitment,
  getAllPaidDonationsReceipts,
} from "../../api/commitmentApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import donationReceiptIcon from "../../assets/images/icons/donationReceipt.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import ReactToPdf from "react-to-pdf";
import { useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, Spinner } from "reactstrap";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";

export default function CommitmentListTable(
  {
    data,
    toPdf,
    currentPage,
    currentFilter,
    financeReport,
    currentCategory,
    currentStatus,
    currentSubCategory,
    subPermission,
    allPermissions,
  },
  args
) {
  const handleDeleteCommitment = async (payload) => {
    return deleteCommitment(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCommitment,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Commitments"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();
  const ref = useRef();
  const pdfRef = useRef();
  const options = {
    orientation: "portrait",
    setPage: 5,
    unit: "in",
  };

  const loggedTemple = useSelector((state) => state.auth.trustDetail);
  const [receipt, setReceipt] = useState();
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const handleDownloadReceipt = (id) => {
    return getAllPaidDonationsReceipts(id);
  };

  const [loading, setLoading] = useState(false);
  console.log(loading);
  const receiptMutation = useMutation({
    mutationFn: handleDownloadReceipt,
    onSuccess: (data) => {
      if (!data.error) {
        setTimeout(() => {
          pdfRef.current.click();
          setLoading(false);
        }, 100);
      } else if (data.error) {
        toast.error("Someting went wrong.");
        setLoading(false);
      }
    },
  });

  // const [commitmentId, setCommitmentId] = useState("");
  // console.log(commitmentId);
  // const allPaidDonationsReceipt = useQuery(
  //   ["Commitments", commitmentId],
  //   () => {
  //     if (commitmentId) {
  //       return getAllPaidDonationsReceipts(commitmentId);
  //     }
  //   }
  // );

  const allPaidDonationsItems = useMemo(
    () => receiptMutation?.data?.results ?? [],
    [receiptMutation]
  );

  // console.log(allPaidDonationsReceipt);

  const columns = [
    {
      name: t("commitment_Username"),
      selector: (row) => row.username,
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
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
      width: "120px",
    },
    {
      name: t("categories_sub_category"),
      selector: (row) => row.subCategory,
      width: "150px",
    },
    {
      name: t("commitment_end_Date"),
      selector: (row) => row.endDate,
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorStatus"),
      selector: (row) => row.status,
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      width: "150px",
    },
    {
      name: t("commitment_Amount_Due"),
      selector: (row) => row.amountDue,
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorCommitId"),
      selector: (row) => row.commitmentId,
      width: "150px",
    },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: (row) => row.receipt,
      center: true,
    },
    {
      name: t("created_by"),
      selector: (row) => row.createdBy,
      width: "150px",
    },
    {
      name: t("pay_donation"),
      selector: (row) => row.payDonation,
      width: "150px",
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      width: "100px",
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
    },
  ];
  const commitment_Data = useMemo(() => {
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
            {ConverFirstLatterToCapital(item?.masterCategory?.name)}{" "}
            {/* {item?.category && `(${item?.category?.name})`} */}
          </div>
        ),
        subCategory: ConverFirstLatterToCapital(item?.category?.name ?? "-"),
        endDate: moment(item?.commitmentEndDate).format("DD MMM YYYY"),
        status: (
          <div
            style={{
              color: item?.paidStatus == "completed" ? "#24C444" : "#FF0700",
              font: "normal normal 600 11px/20px Noto Sans",
            }}
          >
            <div>{ConverFirstLatterToCapital(item?.paidStatus)}</div>
          </div>
        ),
        amount: <div>₹&nbsp;{item?.amount}</div>,
        amountDue: <div>₹&nbsp; {item?.amount - item.paidAmount}</div>,
        commitmentId: (
          <div
            className="cursor-pointer"
            onClick={() => {
              financeReport
                ? ""
                : history.push(
                    `/donations/paid/${item.id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                  );
            }}
          >
            {item?.commitmentId}
          </div>
        ),
        receipt: loading ? (
          <Spinner size="sm" color="primary" />
        ) : (
          <>
            <img
              src={receiptIcon}
              width={25}
              className={`cursor-pointer ${
                item?.amount != item?.amount - item?.paidAmount
                  ? "cursor-pointer"
                  : " opacity-50 cursor-not-allowed"
              }`}
              onClick={() => {
                receiptMutation.mutate(item?.id);
                setLoading(true);
                // setCommitmentId(item?.id);
                // pdfRef.current.click();
                // toggle();
              }}
            />
          </>
        ),
        createdBy: ConverFirstLatterToCapital(item?.createdBy.name),
        payDonation:
          item?.paidStatus !== "completed" ? (
            <div
              className="cursor-pointer payDonation"
              onClick={() =>
                financeReport
                  ? history.push(`/commitment/pay-donation/${item.id}`, item.id)
                  : history.push(
                      `/commitment/pay-donation/${item.id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`,
                      item.id
                    )
              }
            >
              <Trans i18nKey={"payment"} />
            </div>
          ) : (
            "-"
          ),
        edit:
          allPermissions?.name === "all" ||
          subPermission?.includes(EDIT) ||
          financeReport ? (
            <img
              src={editIcon}
              width={35}
              className={
                financeReport ? "cursor-disabled opacity-50" : "cursor-pointer "
              }
              onClick={() => {
                financeReport
                  ? ""
                  : history.push(
                      `/commitment/edit/${item.id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                    );
              }}
            />
          ) : (
            ""
          ),
        delete:
          allPermissions?.name === "all" ||
          subPermission?.includes(DELETE) ||
          financeReport ? (
            <img
              src={deleteIcon}
              width={35}
              className={
                financeReport ? "cursor-disabled opacity-50" : "cursor-pointer "
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Swal.fire("Oops...", "Something went wrong!", "error");
                financeReport
                  ? ""
                  : Swal.fire({
                      title: `<img src="${comfromationIcon}"/>`,
                      html: `
                                          <h3 class="swal-heading mt-1">${t(
                                            "commitment_delete"
                                          )}</h3>
                                          <p>${t("commitment_sure")}</p>
                                          `,
                      showCloseButton: false,
                      showCancelButton: true,
                      focusConfirm: true,
                      cancelButtonText: ` ${t("cancel")}`,
                      cancelButtonAriaLabel: ` ${t("cancel")}`,

                      confirmButtonText: ` ${t("confirm")}`,
                      confirmButtonAriaLabel: "Confirm",
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        deleteMutation.mutate(item.id);
                      }
                    });
              }}
            />
          ) : (
            ""
          ),
      };
    });
  }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    font: normal normal bold 15px/23px Noto Sans;
    .payDonation {
      font: normal normal bold 15px/33px Noto Sans;
      color: #ff8744;
    }
    .model > .my {
      max-height: 600px;
      overflow: auto;
    }
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        maxHieght={""}
        columns={columns}
        data={commitment_Data}
      />
      <ReactToPrint
        trigger={() => (
          <span
            id="printAllRedeemedVoucher"
            ref={pdfRef}
            style={{ display: "none" }}
          >
            Print!
          </span>
        )}
        content={() => ref.current}
        documentTitle={`Donation-Receipt.pdf`}
      />
      <div className="bg-danger " style={{ display: "none" }}>
        <div
          ref={ref}
          className="bg-danger"
          // style={{
          //   width: "700px",
          //   height: "auto",
          //   textAlign: "center",
          //   padding: "3rem 11rem",
          // }}
        >
          {allPaidDonationsItems?.map((item) => {
            return (
              <div
                style={{
                  width: "100%",
                  // border:"1px solid black",
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
                    // display:"none",
                    height: "auto",
                    // background:"red",
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
                      src={loggedTemple?.profilePhoto}
                      // src="https://apnamandir.s3.ap-south-1.amazonaws.com/trust_profile/979242110891_ranakpur.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQ5TSNJ6QOEXRBCNH%2F20230411%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230411T132833Z&X-Amz-Expires=604800&X-Amz-Signature=83d929ffa3f78302c4a83b11883c677ad36d6c2d8059226f26fec9f4308cbd9b&X-Amz-SignedHeaders=host"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "8px",
                      }}
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
                        {`${loggedTemple?.city}, ${loggedTemple?.state}`}
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
                    With each donation we receive, we become all that much
                    closer to our goal. Thank you for making a difference
                    through your compassion and generosity
                  </div>

                  <div
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      color: "#583703",
                    }}
                  >
                    <span
                      style={{
                        font: "normal normal bold 16px/27px Noto Sans",
                      }}
                    >
                      Amount :
                    </span>{" "}
                    {item?.amount} Rs
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      color: "#583703",
                    }}
                  >
                    <span
                      style={{
                        font: "normal normal bold 16px/27px Noto Sans",
                      }}
                    >
                      Mode of Payment :
                    </span>{" "}
                    {ConverFirstLatterToCapital(item?.paymentMethod ?? "")}
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      color: "#583703",
                    }}
                  >
                    <span
                      style={{
                        font: "normal normal bold 16px/27px Noto Sans",
                      }}
                    >
                      Donor Name :
                    </span>{" "}
                    {ConverFirstLatterToCapital(
                      item?.donarName || item?.user?.name || ""
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: "left",
                      marginTop: "5px",
                      color: "#583703",
                    }}
                  >
                    <span
                      style={{
                        font: "normal normal bold 16px/27px Noto Sans",
                      }}
                    >
                      Date & Time :
                    </span>{" "}
                    {moment(item?.createdAt ?? item?.updatedAt).format(
                      " DD MMM YYYY,hh:mm A"
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <ReactToPdf
        targetRef={ref}
        filename="Donation-Receipt.pdf"
        options={options}
      >
        {({ toPdf }) => (
          <button onClick={toPdf} ref={pdfRef} className="d-none">
            Generate pdf
          </button>
        )}
      </ReactToPdf> */}

      {/* <Modal
        className="allPaidDonationsModel"
        isOpen={modal}
        toggle={toggle}
        {...args}
      >
        <ModalBody className="my">
          
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              // pdfRef.current.click();
              toggle();
              // setTimeout(() => {
              //   Swal.fire({
              //     icon: "success",
              //     title: "Receipt Download Successfully.",
              //     showConfirmButton: false,
              //     timer: 1500,
              //   });
              // }, 300);
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
