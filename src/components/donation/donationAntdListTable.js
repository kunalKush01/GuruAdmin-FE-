import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Space, Table, Tooltip } from "antd";
import moment from "moment";
import numberToWords from "number-to-words";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import styled from "styled-components";
import { getDonationCustomFields } from "../../api/customFieldsApi";
import {
  donationDownloadReceiptApi,
  getDonation,
  updateDonation,
} from "../../api/donationApi";
import { downloadFile } from "../../api/sharedStorageApi";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import whatsappIcon from "../../assets/images/icons/whatsappIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import {
  EDIT,
  DELETE,
  READ,
  WRITE,
  IMPORT,
} from "../../utility/permissionsVariable";
import EditDonation from "./editDonation";
import "../../assets/scss/common.scss";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function DonationANTDListTable(
  {
    data,
    topdf,
    allPermissions,
    subPermission,
    financeReport,
    totalItems,
    currentPage,
    pageSize,
    onChangePage,
    onChangePageSize,
    donationType,
    setShowScreenshotPanel = false,
    showScreenshotPanel = false,
    setRecord = null,
    isForMember = false,
  },
  args
) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef();
  const pdfRef = useRef();
  const options = {
    orientation: "portrait",
    unit: "in",
    format: [5, 7],
  };

  const REACT_APP_BASEURL_PUBLIC = process.env.REACT_APP_BASEURL_PUBLIC;

  const shareReceiptOnWhatsApp = (item, receiptLink) => {
    const message = `Hello ${
      item.donarName
    }, thank you for your donation of ₹${item.amount.toLocaleString(
      "en-IN"
    )} to ${loggedTemple?.name}. Here is your receipt: ${receiptLink}`;
    const phoneNumber = `${item.user?.countryCode?.replace("+", "") || ""}${
      item.user?.mobileNumber || ""
    }`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleWhatsAppShare = async (item) => {
    try {
      setIsLoading(item._id);

      let receiptDownloadLink = "";

      const response = await getDonation({ donationId: item._id });

      if (response?.result?.receiptName) {
        receiptDownloadLink = `${REACT_APP_BASEURL_PUBLIC}storage/download/donation/${response.result.receiptName}`;
      } else {
        toast.error("Receipt not available at this moment.");
        setIsLoading(false);
        return;
      }

      const message = `Hello ${
        item.donarName
      }, thank you for your donation of ₹${item.amount.toLocaleString(
        "en-IN"
      )} to ${
        loggedTemple?.name
      }. You can download your receipt here: ${receiptDownloadLink}`;

      const phoneNumber = `${item.user?.countryCode?.replace("+", "") || ""}${
        item.user?.mobileNumber || ""
      }`;

      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error sharing receipt:", error);
      toast.error("Failed to send receipt via WhatsApp");
      setIsLoading(false);
    }
  };

  const getReceiptForWhatsApp = useMutation({
    mutationFn: (payload) => {
      return getDonation(payload);
    },
    onSuccess: (data, variables) => {
      setIsLoading(false);
      if (data.result && data.result.receiptLink) {
        if (data.result._id === variables.donationId) {
          shareReceiptOnWhatsApp(data.result, data.result.receiptLink);
        } else {
          toast.error("Donation not found for the provided donation ID");
        }
      } else {
        toast.error("Receipt link not available at this moment");
      }
    },

    onError: () => {
      setIsLoading(false);
      toast.error("Failed to get receipt link");
    },
  });

  const downloadReceipt = useMutation({
    mutationFn: (payload) => getDonation(payload),
    onSuccess: (data) => {
      setIsLoading(false);

      if (data?.result?.receiptName) {
        const receiptDownloadLink = `${REACT_APP_BASEURL_PUBLIC}storage/download/donation/${data.result.receiptName}`;

        // Open the PDF directly
        window.open(receiptDownloadLink, "_blank");
      } else {
        toast.error("Receipt link not available at this moment.");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error fetching donation receipt:", error);
      toast.error("Failed to fetch receipt. Please try again.");
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
  const query = useQuery(
    ["getDonationFields"],
    () => getDonationCustomFields(),
    {
      keepPreviousData: true,
    }
  );

  const donation_custom_fields = useMemo(
    () => query?.data?.customFields ?? [],
    [query]
  );
  const customFieldNames = [
    ...new Set(donation_custom_fields.map((field) => field.fieldName)),
  ];

  const customColumns = customFieldNames.map((fieldName) => {
    const titleLength = fieldName.length;
    const calculatedWidth = Math.max(150, titleLength * 10); // Adjust the multiplier as needed

    return {
      title: fieldName,
      dataIndex: fieldName,
      key: fieldName,
      width: calculatedWidth,
      render: (text) => text || "-",
    };
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleView = (record) => {
    setRecord(record);
    setShowScreenshotPanel(true);

    // Store only the latest record in localStorage
    localStorage.setItem("viewRecord", JSON.stringify(record));

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("view", "true");
    searchParams.set("recordId", record._id);

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will mark the donation as deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedRecord = {
            ...item,
            amount: item.amount ? item.amount : 0,
            donationId: item._id,
            originalAmount: item.originalAmount ? item.originalAmount : 0,
            isDeleted: true,
          };

          // Assuming updateDonation is an API function that updates the donation
          await updateDonation(updatedRecord);
          queryClient.invalidateQueries("donations");
          Swal.fire(
            "Deleted!",
            "The donation has been marked as deleted.",
            "success"
          );
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the donation.", "error");
        }
      }
    });
  };
  const handleEdit = (record) => {
    const params = new URLSearchParams({
      page: currentPage,
      category: "All",
      subCategory: "All",
      filter: "dashboard_monthly",
      type: "Donation",
    }).toString();

    navigate({
      pathname: "/donation/edit",
      search: `?${params}`,
      state: {
        record: record,
        isEdit: true,
        isFieldDisable: false,
      },
    });
  };

  const columns = [
    {
      title: t("commitment_Username"),
      dataIndex: "username",
      key: "username",
      render: (text) => text,
      onCell: () => ({
        style: {
          font: "normal normal 700 13px/20px Noto Sans !important",
        },
      }),
      width: !isMobile ? 200 : 170,
      fixed: "left",
    },
    {
      title: t("dashboard_Recent_DonorNumber"),
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      render: (text) => text,
      width: "150px",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorName"),
      dataIndex: "donarName",
      key: "donarName",
      render: (text) => text,
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorReceipNo"),
      dataIndex: "receiptNo",
      key: "receiptNo",
      render: (text) => text,
      width: 250,
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      render: (text) => text,
      width: "120px",
      width: !isMobile ? 200 : 120,
    },
    {
      title: t("categories_sub_category"),
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text) => text,
      width: 300,
    },
    {
      title: t("dashboard_Recent_DonorDate"),
      dataIndex: "dateTime",
      key: "dateTime",
      render: (text) => text,
      width: "150px",
      width: 180,
    },
    {
      title: t("original_amount"),
      dataIndex:
        donationType !== "Article_Donation" ? "amount" : "originalAmount",
      key: "originalAmount",
      render: (text) => text,
      //   width: "180px",
      width: 150,
    },
    {
      title: t("estimate_amount"),
      dataIndex: "amount",
      key: "amount",
      render: (text) => text,
      hidden: donationType === "Article_Donation" ? false : true,
      //   width: "180px",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorCommitId"),
      dataIndex: "commitmentID",
      key: "commitmentID",
      render: (text) => text,
      hidden: donationType === "Article_Donation" ? true : false,
      width: 220,
    },
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      key: "createdBy",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: !isMobile ? 150 : 120,
    },
    {
      title: t("mode_of_payment"),
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: 150,
    },
    {
      title: t("bank_name"),
      dataIndex: "bankName",
      key: "bankName",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: 200,
    },
    {
      title: t("cheque_no"),
      dataIndex: "chequeNum",
      key: "chequeNum",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("cheque_date"),
      dataIndex: "chequeDate",
      key: "chequeDate",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("cheque_status"),
      dataIndex: "chequeStatus",
      key: "chequeStatus",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: 220,
    },
    {
      title: t("bank_narration"),
      dataIndex: "bankNarration",
      key: "bankNarration",
      hidden: donationType === "Article_Donation" ? true : false,
      render: (text) => text,
      width: 300,
    },
    {
      title: t("articleType"),
      dataIndex: "articleType",
      key: "articleType",
      hidden: donationType === "Article_Donation" ? false : true,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("articleItem"),
      dataIndex: "articleItem",
      key: "articleItem",
      hidden: donationType === "Article_Donation" ? false : true,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("articleWeight"),
      dataIndex: "articleWeight",
      key: "articleWeight",
      hidden: donationType === "Article_Donation" ? false : true,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("articleUnit"),
      dataIndex: "articleUnit",
      key: "articleUnit",
      hidden: donationType === "Article_Donation" ? false : true,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("articleQuantity"),
      dataIndex: "articleQuantity",
      key: "articleQuantity",
      hidden: donationType === "Article_Donation" ? false : true,
      render: (text) => text,
      width: 180,
    },
    {
      title: t("articleRemark"),
      dataIndex: "articleRemark",
      key: "articleRemark",
      hidden: donationType === "Article_Donation" ? false : true,
      render: (text) => text,
      width: 180,
    },
    // {
    //   title: t("donation_remark"),
    //   dataIndex: "donationRemarks",
    //   key: "donationRemarks",
    //   render: (text) => text,
    //   width: 180,
    // },
    ...customColumns,
    // {
    //   title: t("dashboard_Recent_DonorReceipt"),
    //   dataIndex: "receipt",
    //   key: "receipt",
    //   render: (text) => text,
    //   fixed: !isMobile && "right",
    //   hidden: donationType === "Suspense" ? true : false,
    //   width: 120,
    // },
    {
      title: t("action"),
      key: "action",
      dataIndex: "action",
      fixed: !isMobile && "right",
      // hidden: donationType === "Suspense" ? false : true,
      width: 250,
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };
  const Donatio_data = useMemo(() => {
    return data
      .filter((item) => !item.isDeleted)
      .map((item, idx) => {
        const customFields = item.customFields || {};
        const customFieldData = customFieldNames.reduce((acc, fieldName) => {
          const customField = customFields.find(
            (field) => field.fieldName === fieldName
          );
          if (customField) {
            const value = customField.value;
            if (typeof value === "boolean") {
              acc[fieldName] = value ? "True" : "False";
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
              acc[fieldName] = formatDate(value);
            } else {
              acc[fieldName] = value;
            }
          } else {
            acc[fieldName] = "-";
          }
          return acc;
        }, {});
        return {
          id: idx + 1,
          username: (
            <div className="d-flex align-items-center">
              <div style={{ position: "relative", display: "inline-block" }}>
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
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      item?.paidStatus === "Paid"
                        ? "#79BB43"
                        : item?.paidStatus === "Pending"
                        ? "#F3B64B"
                        : "#EC5B52",
                  }}
                ></span>
              </div>
              <div>{ConverFirstLatterToCapital(item?.user?.name ?? "")}</div>
            </div>
          ),
          mobileNumber: `+${
            item?.user?.countryCode?.replace("+", "") ?? "91"
          } ${item?.user?.mobileNumber}`,
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
          receiptNo: `${item.receiptNo}`,
          createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? "-"),
          modeOfPayment: ConverFirstLatterToCapital(item?.paymentMethod ?? "-"),
          bankName: ConverFirstLatterToCapital(item?.bankName ?? "-"),
          chequeNum: ConverFirstLatterToCapital(item?.chequeNum ?? "-"),
          chequeDate: item.chequeDate
            ? moment(item.chequeDate).format(" DD MMM YYYY,hh:mm A")
            : "-",
          chequeStatus: ConverFirstLatterToCapital(item?.chequeStatus ?? "-"),
          bankNarration: ConverFirstLatterToCapital(item?.bankNarration ?? "-"),
          articleType: ConverFirstLatterToCapital(item?.articleType ?? "-"),
          articleItem: ConverFirstLatterToCapital(item?.articleItem ?? "-"),
          articleWeight: ConverFirstLatterToCapital(item?.articleWeight ?? "-"),
          articleUnit: ConverFirstLatterToCapital(item?.articleUnit ?? "-"),
          articleQuantity: ConverFirstLatterToCapital(
            item?.articleQuantity ?? "-"
          ),
          articleRemark: ConverFirstLatterToCapital(item?.articleRemark ?? "-"),
          action: (
            <div className="d-flex align-items-center">
              <div>
                {isLoading === item?._id ? (
                  <Spinner color="success" />
                ) : (
                  <img
                    src={receiptIcon}
                    width={25}
                    className="cursor-pointer me-2"
                    onClick={() => {
                      const receiptName = item?.receiptName;
                      if (receiptName) {
                        const fileUrl = `${REACT_APP_BASEURL_PUBLIC}storage/download/donation/${receiptName}`;
                        window.open(fileUrl, "_blank");
                      } else {
                        setIsLoading(item?._id);
                        downloadReceipt.mutate({
                          donationId: item._id,
                          languageId: selectedLang.id,
                        });
                      }
                    }}
                  />
                )}
              </div>
              <div>
                <img
                  src={whatsappIcon}
                  width={25}
                  className="cursor-pointer me-2"
                  onClick={() => handleWhatsAppShare(item)}
                />
              </div>
              <div>
                <img
                  src={eyeIcon}
                  width={25}
                  style={{
                    display: donationType === "Suspense" ? "block" : "none",
                  }}
                  onClick={() => handleView(item)}
                  className="cursor-pointer me-2"
                />
              </div>
              <div>
                {allPermissions?.name === "all" ||
                subPermission?.includes(EDIT) ? (
                  <img
                    src={editIcon}
                    width={35}
                    className="cursor-pointer me-2"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
              <div>
                {allPermissions?.name === "all" ||
                subPermission?.includes(DELETE) ? (
                  <img
                    src={deleteIcon}
                    className="cursor-pointer"
                    width={35}
                    onClick={() => handleDelete(item)}
                  />
                ) : (
                  ""
                )}
              </div>
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
          ...customFieldData,
        };
      });
  }, [data, isLoading, donation_custom_fields, donationType]);

  const inWordsNumber = numberToWords
    .toWords(parseInt(receipt?.amount ?? 0))
    .toUpperCase();
  return (
    <div>
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={Donatio_data}
        scroll={{
          x: 1500,
          y: isForMember ? 180 : 430,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
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
    </div>
  );
}
