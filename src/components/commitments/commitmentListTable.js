import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import numberToWords from "number-to-words";
import { useCallback, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";
import {
  deleteCommitment,
  getAllPaidDonationsReceipts,
  nudgeUserApi,
} from "../../api/commitmentApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import donationReceiptIcon from "../../assets/images/icons/donationReceipt.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT } from "../../utility/permissionsVariable";
import CustomDataTable from "../partials/CustomDataTable";
import "../../assets/scss/common.scss";
import { Table } from "antd";

export default function CommitmentListTable(
  {
    data,
    toPdf,
    // currentPage,
    currentFilter,
    financeReport,
    currentCategory,
    paymentStatus,
    currentStatus,
    currentSubCategory,
    subPermission,
    selectedRows,
    setSelectedRows,
    allPermissions,
    notifyIds,
    commitmentTotalItem,
    currentPage,
    pageSize,
    onChangePage,
    onChangePageSize,
  },
  args
) {
  const handleDeleteCommitment = async (payload) => {
    return deleteCommitment(payload);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCommitment,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Commitments"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();
  const ref = useRef();
  const pdfRef = useRef();

  const loggedTemple = useSelector((state) => state.auth.trustDetail);
  const [receipt, setReceipt] = useState();

  const handleDownloadReceipt = (id) => {
    return getAllPaidDonationsReceipts(id);
  };

  const [loading, setLoading] = useState(false);
  const receiptMutation = useMutation({
    mutationFn: handleDownloadReceipt,
    onSuccess: (data) => {
      if (!data.error) {
        setTimeout(() => {
          pdfRef.current.click();
          setLoading(false);
        }, 100);
      } else if (data.error) {
        toast.error("Something went wrong.");
        setLoading(false);
      }
    },
  });

  const allPaidDonationsItems = useMemo(
    () => receiptMutation?.data?.results ?? [],
    [receiptMutation]
  );

  const handleChange = useCallback((state) => {
    setSelectedRows(state?.selectedRows);
  }, []);

  const columns = [
    {
      title: t("commitment_Username"),
      dataIndex: "username",
      key: "username",
      width: 160,
      render: (text) => (
        <span style={{ fontWeight: 700, fontSize: "13px" }}>{text}</span>
      ),
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
      title: t("commitment_end_Date"),
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorStatus"),
      dataIndex: "status",
      key: "status",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorAmount"),
      dataIndex: "amount",
      key: "amount",
      width: 150,
    },
    {
      title: t("commitment_Amount_Due"),
      dataIndex: "amountDue",
      key: "amountDue",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorCommitId"),
      dataIndex: "commitmentId",
      key: "commitmentId",
      width: 180,
    },
    {
      title: t("dashboard_Recent_DonorReceipt"),
      dataIndex: "receipt",
      key: "receipt",
      align: "center",
      width: 150,
    },
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
    },
    {
      title: t("pay_donation"),
      dataIndex: "payDonation",
      key: "payDonation",
      width: 150,
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: 100,
    },
  ];

  const commitment_Data = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        notifyUserId: item?._id,
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
                height: "30px",
              }}
              className="rounded-circle"
            />
            <div
              className="overflow-hidden"
              style={{ textOverflow: "ellipsis" }}
            >
              {ConverFirstLatterToCapital(item?.user?.name ?? "")}
            </div>
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
            {ConverFirstLatterToCapital(item?.masterCategory?.name ?? "-")}{" "}
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
            <div>{ConverFirstLatterToCapital(item?.paidStatus ?? "")}</div>
          </div>
        ),
        amount: <div>₹{item?.amount?.toLocaleString("en-IN")}</div>,
        amountDue: (
          <div>₹{(item?.amount - item.paidAmount).toLocaleString("en-IN")}</div>
        ),
        commitmentId: (
          <div
            className={`cursor-pointer ${
              financeReport ? "" : "text-decoration-underline"
            }`}
            onClick={() => {
              financeReport
                ? ""
                : history.push(
                    `/donations/paid/${item._id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                  );
            }}
          >
            {item?.commitmentId}
          </div>
        ),
        receipt: (
          <img
            src={receiptIcon}
            width={25}
            className={`cursor-pointer ${
              item?.amount != item?.amount - item?.paidAmount
                ? "cursor-pointer"
                : " opacity-50 cursor-not-allowed"
            }`}
            onClick={() => {
              item?.amount != item?.amount - item?.paidAmount &&
                receiptMutation.mutate(item?._id);
            }}
          />
        ),
        createdBy: ConverFirstLatterToCapital(item?.createdBy.name ?? ""),
        payDonation:
          item?.paidStatus !== "completed" ? (
            <div
              className={`cursor-pointer payDonation ${
                paymentStatus && "opacity-50 cursor-not-allowed"
              }`}
              onClick={() =>
                financeReport && !paymentStatus
                  ? history.push(
                      `/commitment/pay-donation/${item._id}`,
                      item._id
                    )
                  : !paymentStatus &&
                    history.push(
                      `/commitment/pay-donation/${item._id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`,
                      item._id
                    )
              }
            >
              <Trans i18nKey={"payment"} />
            </div>
          ) : (
            <div
              className={`payDonation ${
                item?.paidStatus === "completed" &&
                "opacity-50 cursor-not-allowed"
              }`}
            >
              <Trans i18nKey={"paymentPaid"} />
            </div>
          ),
        action: (
          <div className="d-flex align-items-center">
            <div>
              {allPermissions?.name === "all" ||
              subPermission?.includes(EDIT) ||
              financeReport ? (
                <img
                  src={editIcon}
                  width={35}
                  className={financeReport ? "d-none" : "cursor-pointer "}
                  onClick={() => {
                    financeReport
                      ? ""
                      : history.push(
                          `/commitment/edit/${item?._id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                        );
                  }}
                />
              ) : (
                ""
              )}
            </div>
            <div>
              {allPermissions?.name === "all" ||
              subPermission?.includes(DELETE) ||
              financeReport ? (
                <img
                  src={deleteIcon}
                  width={35}
                  className={financeReport ? "d-none" : "cursor-pointer "}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    financeReport
                      ? ""
                      : Swal.fire({
                          title: `<img src="${confirmationIcon}"/>`,
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
                            deleteMutation.mutate(item._id);
                          }
                        });
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        ),
      };
    });
  }, [data]);

  const DisableSelectRow = (row) => {
    return row?.status?.props?.children?.props?.children === "Completed";
  };

  const inWordsNumber = numberToWords
    .toWords(parseInt(receipt?.amount ?? 0))
    .toUpperCase();

  return (
    <div className="commitmenttablewrapper">
      <Table
        columns={columns}
        dataSource={commitment_Data}
        rowSelection={
          !financeReport
            ? {
                onChange: handleChange,
                getCheckboxProps: (record) => ({
                  disabled: DisableSelectRow(record), // Function to disable rows
                }),
              }
            : null
        }
        className="commonListTable"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: commitmentTotalItem,
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
          <span id="AllCommitment" ref={pdfRef} style={{ display: "none" }}>
            Print!
          </span>
        )}
        content={() => ref.current}
        documentTitle={`Donation-Receipts.pdf`}
      />
      <div className="" style={{ display: "none" }}>
        <div ref={ref}>
          {allPaidDonationsItems?.map((item, index) => (
            <div key={index}>
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
                      <div className="col-5">{item?.receiptNo ?? "-"}</div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-5">Date/दिनांक</div>
                      <div className="col-5">
                        {moment(item?.createdAt ?? item?.updatedAt).format(
                          " DD MMM YYYY"
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-5">Name/नाम &nbsp;</div>
                      <div className="col-5">
                        {ConverFirstLatterToCapital(
                          item?.donarName || item?.user?.name || ""
                        )}
                      </div>
                    </div>
                    <div className="row ">
                      <div className="col-1"></div>
                      <div className="col-5">Pan/पैन</div>
                      <div className="col-5">
                        {item?.user?.panNumber ?? "-"}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-5">Mobile/मोबाइल</div>
                      <div className="col-5">
                        {item?.user?.countryCode} {item?.user?.mobileNumber}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-5">Address/पता</div>
                      <div className="col-5">{item?.user?.address ?? "-"}</div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-5">Mode of Payment/भुगतान माध्यम</div>
                      <div className="col-5">
                        {ConverFirstLatterToCapital(
                          item?.paymentMethod ?? "None"
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-5">Remarks/विवरण </div>
                      <div className="col-5">{item?.remarks ?? "-"}</div>
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
                        ₹{item?.amount?.toLocaleString("en-IN")}
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
                      <div className="col-5">
                        {numberToWords
                          .toWords(parseInt(item?.amount ?? 0))
                          .toUpperCase()}{" "}
                        ONLY
                      </div>
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
                  <div className="col-5">
                    This is system generated receipt/ यह कंप्यूटर के द्वारा बनाई
                    गई रसीद है
                  </div>
                  <div className="col-5" style={{ textAlign: "end" }}>
                    (Logo) Powered by apnamandir.com
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
