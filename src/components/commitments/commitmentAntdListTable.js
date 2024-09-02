import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import numberToWords from "number-to-words";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  deleteCommitment,
  getAllPaidDonationsReceipts,
} from "../../api/commitmentApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/common.scss";
import { Checkbox, Table } from "antd";
import { getPledgeCustomFields } from "../../api/customFieldsApi";
import "../../assets/scss/common.scss";
import classNames from "classnames";

export default function CommitmentAntdListTable(
  {
    data,
    toPdf,
    currentFilter,
    financeReport,
    currentCategory,
    paymentStatus,
    currentStatus,
    currentSubCategory,
    subPermission,
    selectedRowDATA,
    allPermissions,
    totalItems,
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

  const query = useQuery(["getPledgeFields"], () => getPledgeCustomFields(), {
    keepPreviousData: true,
  });

  const commitment_custom_fields = useMemo(
    () => query?.data?.customFields ?? [],
    [query]
  );
  const customFieldNames = [
    ...new Set(commitment_custom_fields.map((field) => field.fieldName)),
  ];

  const customColumns = customFieldNames.map((fieldName) => {
    const titleLength = fieldName.length;
    const calculatedWidth = Math.max(150, titleLength * 10);

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
  const columns = [
    {
      title: t("commitment_Username"),
      render: (text) => text,
      dataIndex: "username",
      key: "username",
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
      },
      fixed: "left",
      width: 200,
    },
    {
      title: t("dashboard_Recent_DonorNumber"),
      render: (text) => text,
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorName"),
      render: (text) => text,
      dataIndex: "donarName",
      key: "donarName",
      width: 150,
    },

    {
      title: t("category"),
      render: (text) => text,
      key: "category",
      dataIndex: "category",
      width: 150,
    },
    {
      title: t("categories_sub_category"),
      render: (text) => text,
      dataIndex: "subCategory",
      key: "subCategory",
      width: 150,
    },
    {
      title: t("commitment_end_Date"),
      render: (text) => text,
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorStatus"),
      render: (text) => text,
      dataIndex: "status",
      key: "status",
      width: 150,
    },
    {
      title: t("dashboard_Recent_DonorAmount"),
      render: (text) => text,
      dataIndex: "amount",
      key: "amount",
      width: 150,
    },
    {
      title: t("commitment_Amount_Due"),
      render: (text) => text,
      width: 150,
      key: "amountDue",
      dataIndex: "amountDue",
    },
    {
      title: t("dashboard_Recent_DonorCommitId"),
      render: (text) => text,
      key: "commitmentId",
      dataIndex: "commitmentId",
      width: 170,
    },
    // {
    //   title: t("dashboard_Recent_DonorReceipt"),
    //   render: (text) => text,
    //   dataIndex: "receipt",
    //   key: "receipt",
    //   center: true,
    //   width: 150,
    // },
    {
      title: t("created_by"),
      render: (text) => text,
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
    },
    {
      title: t("pay_donation"),
      render: (text) => text,
      dataIndex: "payDonation",
      key: "payDonation",
      width: 150,
    },
    ...customColumns,
    {
      title: t("Actions"),
      key: "actions",
      fixed: !isMobile && "right",
      width: "180px",
      render: (text, record) => record.actions,
    },
  ];
  const commitment_Data = useMemo(() => {
    return data?.map((item, idx) => {
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
      const serializedCustomFieldData = encodeURIComponent(
        JSON.stringify(customFieldData)
      );
      return {
        key: idx + 1,
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
                width: "25px",
                height: "25px",
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
        createdBy: ConverFirstLatterToCapital(
          item?.createdBy ? item?.createdBy.name : ""
        ),
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
        ...customFieldData,
        actions: (
          <div className="actions-column">
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
            {(allPermissions?.name === "all" ||
              subPermission?.includes("EDIT") ||
              financeReport) && (
              <img
                src={editIcon}
                width={35}
                className={classNames({
                  "d-none": financeReport,
                  "cursor-pointer": !financeReport,
                  "opacity-50": item.paidStatus === "completed",
                  "pointer-events-none": item.paidStatus === "completed",
                })}
                onClick={() => {
                  if (!financeReport) {
                    history.push(
                      `/commitment/edit/${item?._id}?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                    );
                  }
                }}
                alt="Edit"
              />
            )}
            {(allPermissions?.name === "all" ||
              subPermission?.includes("DELETE") ||
              financeReport) && (
              <img
                src={deleteIcon}
                width={35}
                className={classNames({
                  "d-none": financeReport,
                  "cursor-pointer": !financeReport,
                  "opacity-50": item.paidStatus === "completed",
                  "pointer-events-none": item.paidStatus === "completed",
                })}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!financeReport) {
                    Swal.fire({
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
                  }
                }}
                alt="Delete"
              />
            )}
          </div>
        ),
      };
    });
  }, [data, commitment_custom_fields]);

  const DisableSelectRow = (row) => {
    return row?.status?.props?.children?.props?.children === "Completed";
  };

  const inWordsNumber = numberToWords
    .toWords(parseInt(receipt?.amount ?? 0))
    .toUpperCase();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const handleSelect = (record, selected) => {
    if (selected) {
      setSelectedRowKeys((keys) => [...keys, record.key]);
    } else {
      setSelectedRowKeys((keys) => {
        const index = keys.indexOf(record.key);
        return [...keys.slice(0, index), ...keys.slice(index + 1)];
      });
    }
  };

  const toggleSelectAll = () => {
    setSelectedRowKeys((keys) =>
      keys.length === commitment_Data.length
        ? []
        : commitment_Data.map((r) => r.key)
    );
  };
  const headerCheckbox = (
    <Checkbox
      checked={selectedRowKeys.length}
      indeterminate={
        selectedRowKeys.length > 0 && selectedRowKeys.length < data.length
      }
      onChange={toggleSelectAll}
    />
  );

  useEffect(() => {
    const selectedRowsData = commitment_Data.filter((row) =>
      selectedRowKeys.includes(row.key)
    );
    selectedRowDATA(selectedRowsData);
  }, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    type: "checkbox",
    fixed: true,
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
  };

  return (
    <>
      <Table
        rowSelection={rowSelection}
        rowKey={(record) => record.key}
        className="commitmentListTable"
        columns={columns}
        dataSource={commitment_Data}
        scroll={{
          x: 1500,
          y: 400,
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
                      <div className="col-10">
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
    </>
  );
}
