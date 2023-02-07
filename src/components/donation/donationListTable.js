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
import { utils, writeFile } from 'xlsx';
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
      selector: row => row.username,
      cellExport: row => row.username,
      style: {
        font: "normal normal 700 13px/20px Noto Sans !important",
        // font: "normal normal bold 10px/20px noto sans !important ",
      },
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorNumber"),
      selector: row => row.mobileNumber,
      cellExport: row => row.mobileNumber,
      // width:"150px",
    },
    {
      name: t("dashboard_Recent_DonorName"),
      selector: row => row.donarName,
      cellExport: row => row.donarName,
      // width:"150px",
    },

    {
      name: t("category"),
      selector: row => row.category,
      cellExport: row => row.category,

      // width:"150px",
    },

    {
      name: t("dashboard_Recent_DonorDate"),
      selector: row => row.dateTime,
      cellExport: row => row.dateTime,

    },
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: row => row.amount,
      cellExport: row => row.amount,

    },
    {
        name: t("dashboard_Recent_DonorCommitId"),
        selector: row => row.commitmentID,
      cellExport: row => row.commitmentID,

      },
    {
      name: t("dashboard_Recent_DonorReceipt"),
      selector: row => row.receipt,
      // cellExport: row => row.receipt,
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
        mobileNumber: item?.user?.mobileNumber,
        donarName:ConverFirstLatterToCapital (item?.donarName??item.user?.name),
        category: <div>{ConverFirstLatterToCapital(item?.masterCategory?.name)}{item?.subCategory&&`(${item?.subCategory?.name ?? ""})`}</div>,
        dateTime: moment(item.createdAt ?? item?.updatedAt).format(" DD MMM YYYY,hh:mm"),
        amount:<div>₹&nbsp;{item?.amount}</div>,
        commitmentID:item.commitmentId?item.commitmentId<10?`0${item.commitmentId}`:`${item.commitmentId}`:"_",
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
    

  // const jsonData = [
  //   { Header1: 'header 1 data', Header2: 'header 2 data' },
  //   { Header1: 'header 1 data', Header2: 'header 2 data' },
  // ];

  // const jsonData = data.map((item)=>{
  //   return{
  //     username:ConverFirstLatterToCapital(item?.user?.name??""),
  //     mobileNumber: item?.user?.mobileNumber,
  //     donarName:ConverFirstLatterToCapital (item?.donarName??item.user?.name),
  //     category:`${ConverFirstLatterToCapital(item?.masterCategory?.name)}${item?.subCategory?`(${item?.subCategory?.name})`:""}`,
  //     dateTime: moment(item.createdAt ?? item?.updatedAt).format(" DD MMM YYYY,hh:mm"),
  //     amount:`₹ ${item?.amount}`,
  //     commitmentID:item.commitmentId?item.commitmentId<10?`0${item.commitmentId}`:`${item.commitmentId}`:"_",
  //   }
  // })

  // console.log("jsonData",jsonData);

  // const handleExport = () => {
  

  //   const binaryWorksheet = utils.json_to_sheet(jsonData);

  //   // Create a new Workbook
  //   const workbook = utils.book_new();

  //   // naming our sheet
  //   utils.book_append_sheet(workbook, binaryWorksheet, 'Donation');

  //   // exporting our excel and naming it
  //   writeFile(workbook, 'Donation Table.xlsx');
  // };

    
  
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
  
    /* button{
      float: right;
      margin-bottom: 1rem;
      margin-right:.5rem;
    } */
  `;

  return (
    <RecentDonationTableWarper>
     {/* <button onClick={handleExport}>Export</button> */}
      <CustomDataTable
        maxHieght={""}
        // tableData={tableData}
        columns={columns}
        data={Donatio_data}
      />
    </RecentDonationTableWarper>
  );
}
