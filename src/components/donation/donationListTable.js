import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import receiptIcon from "../../assets/images/icons/receiptIcon.svg";
import CustomDataTable from "../partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../utility/formater";
export default function DonationListTable({ data }) {
  const handleDeleteExpenses = async (payload) => {
    return deleteExpensesDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteExpenses,
    onSuccess: (data) => {      
      if (!data.error) {        
        queryCient.invalidateQueries(["Expenses"]);
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
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.date_time,
    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
    },
    {
        name: t("dashboard_Recent_DonorCommitId"),
        selector: (row) => row.commitmentID,
      },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: (row) => row.receipt,
    },
  ];

  const Donatio_data=useMemo(()=>{
    return data.map((item,idx)=>{
      return {
        id:idx+1 ,
        username: (
          <div className="d-flex align-items-center ">
            <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
            <div>
              {ConverFirstLatterToCapital(item?.user?.name??"")}
            </div>
          </div>
        ),
        mobileNumber: `+91-${item?.user?.mobileNumber}`,
        donarName:ConverFirstLatterToCapital (item?.donarName??item.user?.name),
        category: <div>{ConverFirstLatterToCapital(item?.masterCategory?.name)}{item?.subCategory&&`(${item?.subCategory.name})`}</div>,
        date_time: moment(item?.createdAt).utcOffset(0).format("h:mm A, DD MMM YYYY"),
        amount:item?.amount,
        commitmentID:`${item?.commitmentId??"-"}`,
        receipt: (
                <img
                  src={receiptIcon}
                  width={25}
                  className="cursor-pointer"
                  onClick={() =>
                    history.push(`/donation`)
                  }
                />
              ),
      }
    })
  },[data])
    
    
  
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
  //         width={25}
  //         className="cursor-pointer"
  //         onClick={() =>
  //           history.push(`/internal_expenses/edit/${item.id}`)
  //         }
  //       />
  //     ),
  //     delete: (
  //       <img
  //         src={deleteIcon}
  //         width={25}
  //         className="cursor-pointer"
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
    /* margin-right: 20px; */
    font: normal normal bold 15px/23px Noto Sans;
  `;

  return (
    <RecentDonationTableWarper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={Donatio_data}
      />
    </RecentDonationTableWarper>
  );
}
