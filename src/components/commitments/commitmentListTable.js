import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteCommitment } from "../../api/commitmentApi";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";

export default function CommitmentListTable({
  data,
  currentPage,
  currentFilter,
  financeReport,
  currentCategory,
  currentStatus,
  currentSubCategory,
}) {
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
      width: "150px",
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
        createdBy: ConverFirstLatterToCapital(item?.createdBy.name),
        payDonation:
          item?.paidStatus !== "completed" ? (
            <div
              className="cursor-pointer payDonation"
              onClick={() =>
                history.push(`/commitment/pay-donation/${item.id}`, item.id)
              }
            >
              <Trans i18nKey={"payment"} />
            </div>
          ) : (
            "-"
          ),
        edit: (
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
        ),
        delete: (
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
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        maxHieght={""}
        columns={columns}
        data={commitment_Data}
      />
    </RecentDonationTableWarper>
  );
}
