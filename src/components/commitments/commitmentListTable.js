import { useTranslation, Trans } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import comfromationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import { deleteExpensesDetail } from "../../api/expenseApi";
import he from "he";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import moment from "moment";
import { deleteCommitment } from "../../api/commitmentApi";

export default function CommitmentListTable({ data }) {
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
        font: "normal normal bold 10px/20px noto sans !important ",
      },
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: (row) => row.mobileNumber,
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorName"),
      selector: (row) => row.donarName,
      // width:"150px",
    },

    {
      name: t("category"),
      selector: (row) => row.category,
      // width:"150px",
    },
    {
      name: t("commitment_end_Date"),
      selector: (row) => row.endDate,
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorStatus"),
      selector: (row) => row.status,
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      // width:"150px",
    },
    {
      name: t("commitment_Amount_Due"),
      selector: (row) => row.amountDue,
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorCommitId"),
      selector: (row) => row.commitmentId,
      // width:"150px",
    },
    {
      name: t("created_by"),
      selector: (row) => row.createdBy,
      // width:"150px",
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
  const commitment_Data = useMemo(()=>{
    
    return data.map((item,idx)=>{
      return {
        id:idx+1 ,
        username: (
          <div className="d-flex align-items-center ">
            <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
            <div>{item?.user?.name??""}</div>
          </div>
        ),
        mobileNumber: `+91-${item?.user?.mobileNumber}`,
        donarName: item?.donarName??item.user?.name,
        category: <div>{item?.masterCategory?.name} {item?.category&&`(${item?.category?.name})`}</div>,
        endDate: item?.commitmentEndDate,
        // .utcOffset("+0530")
        // .toDate(),
        status: item?.paidStatus,
        amount: item?.amount,
        amountDue: item?.amount-item.paidAmount,
        commitmentId:item?.commitmentId,
        createdBy:item?.createdBy.name,
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => history.push(`/commitment/edit/${item.id}`)}
          />
        ),
        delete: (
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Swal.fire("Oops...", "Something went wrong!", "error");
              Swal.fire({
                title: `<img src="${comfromationIcon}"/>`,
                html: `
                                          <h3 class="swal-heading">Delete Commitment</h3>
                                          <p>Are you sure you want to permanently delete the selected commitment ?</p>
                                          `,
                showCloseButton: false,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: "Cancel",
                cancelButtonAriaLabel: "Cancel",
  
                confirmButtonText: "Confirm Delete",
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate(item.id);
                }
              });
            }}
          />
        ),
      }
    })
  },[data])
    
  console.log("commitment_Data=",commitment_Data);
  // const categoriesList = useMemo(() => {
  //   return data.map((item, idx) => ({
  //     _Id: item.id,
  //     id: `${idx + 1}`,
  //     title: item.title,
  //     description:<div dangerouslySetInnerHTML={{__html:he.decode(item.description)}} /> ,
  //     dateTime:item.expenseDate,
  //       amount:`₹${item.amount}`,
  //     edit: (
  //       <img
  //         src={editIcon}
  //         width={35}
  //         onClick={() =>
  //           history.push(`/internal_expenses/edit/${item.id}`)
  //         }
  //       />
  //     ),
  //     delete: (
  //       <img
  //         src={deleteIcon}
  //         width={35}
  //         onClick={(e) => {
  //           e.preventDefault();
  //           e.stopPropagation();
  //           // Swal.fire("Oops...", "Something went wrong!", "error");
  //           Swal.fire({
  //             title: `<img src="${comfromationIcon}"/>`,
  //             html: `
  //                                 <h3 class="swal-heading">Delete Expense</h3>
  //                                 <p>Are you sure you want to permanently delete the selected expense ?</p>
  //                                 `,
  //             showCloseButton: false,
  //             showCancelButton: true,
  //             focusConfirm: true,
  //             cancelButtonText: "Cancel",
  //             cancelButtonAriaLabel: "Cancel",

  //             confirmButtonText: "Confirm Delete",
  //             confirmButtonAriaLabel: "Confirm",
  //           }).then(async (result) => {
  //             if (result.isConfirmed) {
  //               deleteMutation.mutate(item.id);
  //             }
  //           });
  //         }}
  //       />
  //     ),
  //   }));
  // }, [data]);

  const RecentDonationTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={commitment_Data}
      />
    </RecentDonationTableWarper>
  );
}
