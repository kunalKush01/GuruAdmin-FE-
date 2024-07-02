// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import moment from "moment";
// import React, { useMemo } from "react";
// import { useTranslation } from "react-i18next";
// import { useHistory } from "react-router-dom";
// import Swal from "sweetalert2";
// import { Button } from "reactstrap";
// import { deleteDharmshalaBooking } from "../../../api/dharmshala/dharmshalaInfo";
// import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
// import editIcon from "../../../assets/images/icons/category/editIcon.svg";
// import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
// import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
// import CustomDataTable from "../../../components/partials/CustomDataTable";
// import { ConverFirstLatterToCapital } from "../../../utility/formater";
// import { useParams } from "react-router-dom/cjs/react-router-dom.min";
// import { DharmshalaBookingTableWrapper } from "../dharmshalaStyles";
// import "../dharmshala_css/dharmshalabooking.css"; 

// const DharmshalaBookingTable = ({
//   data = [],
//   maxHeight,
//   height,
//   currentFilter,
//   currentStatus,
//   currentPage,
//   isMobileView,
//   //buildingID,
// }) => {
//   const { t } = useTranslation();
//   const history = useHistory();
//   const handleDeleteDharmshalaBooking = async (payload) => {
//     return deleteDharmshalaBooking(payload);
//   };


//   const queryClient = useQueryClient();
//   const deleteMutation = useMutation({
//     mutationFn: handleDeleteDharmshalaBooking,
//     onSuccess: (data) => {
//       if (!data.error) {
//         queryClient.invalidateQueries(["dharmshalaBookingList"]);
//       }
//     },
//   });

//   const columns = [
//     {
//       name: t("Booking ID"),
//       selector: (row) => row.bookingId,
//       width: "200px",
//     },
//     {
//       name: t("Start Date"),
//       selector: (row) => row.startDate,
//       width: "300px",
//     },
//     {
//       name: t("End Date"),
//       selector: (row) => row.endDate,
//       width: "200px",
//     },
//     {
//       name: t("Count"),
//       selector: (row) => row.count,
//       width: "200px",
//     },
//     {
//         name: t("Status"),
//         selector: (row) => row.status,
//         width: "200px",
//     },
//     {
//         name: t("Early Check In"),
//         selector: (row) => (row.earlyCheckIn ? "Yes" : "No"),
//         width: "200px",
//     },
//     {
//         name: t("Late Checkout"),
//         selector: (row) => (row.lateCheckout ? "Yes" : "No"),
//         width: "200px",
//     },
//     {
//       name: t(""),
//       selector: (row) => row.edit,
//       width: "80px",
//       right: true,
//     },
//     {
//       name: t(""),
//       selector: (row) => row.delete,
//       width: "80px",
//       right: true,
//     },
//   ];



//   const DharmshalasBooking = useMemo(() => {
//     const sortedData = data.slice().sort((a, b) => {
//       return new Date(a.startDate) - new Date(b.startDate);
//     });
  
//     return sortedData.map((item, idx)=> {
//       return {
//         id: idx + 1, 
//         bookingId: item?.bookingId,
//         startDate: moment(item?.startDate).format("DD MMM YYYY"),
//         endDate: moment(item?.endDate).format("DD MMM YYYY"),
//         count:item?.count,
//         status:item?.status,
//         earlyCheckIn:item?.earlyCheckIn,
//         lateCheckout:item?.lateCheckout,
//         edit: (
//           <img
//             src={editIcon}
//             width={35}
//             className="cursor-pointer "
//             onClick={() => {
//               history.push(
//                 `/booking/edit/${item?._id}/?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}&bookingId=${item?.bookingId}&startDate=${item?.startDate}&endDate=${item?.endDate}&count=${item?.count}&earlyCheckIn=${item?.earlyCheckIn}&lateCheckout=${item?.lateCheckout}`
//               );
//             }}
//           />
//         ),
//         delete: (
//           // allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
//           <img
//             src={deleteIcon}
//             width={35}
//             className="cursor-pointer "
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               Swal.fire({
//                 title: `<img src="${confirmationIcon}"/>`,
//                 html: `
//                                       <h3 class="swal-heading mt-1">${t(
//                                         "dharmshala_booking_delete"
//                                       )}</h3>
//                                       <p>${t("dharmshala_booking_delete_sure")}</p>
//                                       `,
//                 showCloseButton: false,
//                 showCancelButton: true,
//                 focusConfirm: true,
//                 cancelButtonText: ` ${t("cancel")}`,
//                 cancelButtonAriaLabel: ` ${t("cancel")}`,

//                 confirmButtonText: ` ${t("confirm")}`,
//                 confirmButtonAriaLabel: "Confirm",
//               }).then(async (result) => {
//                 if (result.isConfirmed) {
//                   deleteMutation.mutate(item._id);
//                 }
//               });
//             }}
//           />
//         ),
//       };
//     });
//   }, [data]);
//   return (
//     <DharmshalaBookingTableWrapper>
//       {isMobileView ? (
//         <div className="card-container">
//           {DharmshalasBooking.map((item, index) => (
//             <div key={index} className="card">
//               <div className="card-body">
//                 <div className="card-content">
//                   <h5 className="card-title">{item?.bookingId}</h5>
//                   <p className="card-text">Start Date: {item?.startDate}</p>
//                   <p className="card-text">End Date:{item?.endDate}</p>
//                   <p className="card-text">Count: {item?.count}</p>
//                   <p className="card-text">Status: {item?.status}</p>
//                   <p className="card-text">Early Check In: {item?.earlyCheckIn ? "Yes" : "No"}</p>
//                   <p className="card-text">Late Check Out:{item?.lateCheckout ? "Yes" : "No"}</p>
//                 </div>
//                 <div className="card-icons">
//                   {item.edit}
//                   {item.delete}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//       <CustomDataTable
//         maxHeight={maxHeight}
//         height={height}
//         columns={columns}
//         data={DharmshalasBooking}
//       />
//       )}
//     </DharmshalaBookingTableWrapper>
//   );
// };

// export default DharmshalaBookingTable;



import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "reactstrap";
import { deleteDharmshalaBooking } from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import confirmationIcon from "../../../assets/images/icons/news/conformationIcon.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DharmshalaBookingTableWrapper } from "../dharmshalaStyles";
import "../dharmshala_css/dharmshalabooking.css"; 

const DharmshalaBookingTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  currentStatus,
  currentPage,
  isMobileView,
  //buildingID,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleDeleteDharmshalaBooking = async (payload) => {
    return deleteDharmshalaBooking(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteDharmshalaBooking,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["dharmshalaBookingList"]);
      }
    },
  });

  const columns = [
    {
      name: t("Booking ID"),
      selector: (row) => row.bookingId,
      width: "200px",
    },
    {
      name: t("Start Date"),
      selector: (row) => row.startDate,
      width: "300px",
    },
    {
      name: t("End Date"),
      selector: (row) => row.endDate,
      width: "200px",
    },
    {
      name: t("Count"),
      selector: (row) => row.count,
      width: "200px",
    },
    {
      name: t("Status"),
      selector: (row) => row.status,
      width: "200px",
    },
    {
      name: t("Early Check In"),
      selector: (row) => (row.earlyCheckIn ? "Yes" : "No"),
      width: "200px",
    },
    {
      name: t("Late Checkout"),
      selector: (row) => (row.lateCheckout ? "Yes" : "No"),
      width: "200px",
    },
    {
      name: t(""),
      selector: (row) => row.edit,
      width: "80px",
      right: true,
    },
    {
      name: t(""),
      selector: (row) => row.delete,
      width: "80px",
      right: true,
    },
  ];

  const DharmshalasBooking = useMemo(() => {
    const currentDate = moment();
    const futureBookings = data.filter((item) => moment(item.startDate).isAfter(currentDate));
    const sortedData = futureBookings.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  
    return sortedData.map((item, idx) => {
      return {
        id: idx + 1,
        bookingId: item?.bookingId,
        startDate: moment(item?.startDate).format("DD MMM YYYY"),
        endDate: moment(item?.endDate).format("DD MMM YYYY"),
        count: item?.count,
        status: item?.status,
        earlyCheckIn: item?.earlyCheckIn,
        lateCheckout: item?.lateCheckout,
        edit: (
          <img
            src={editIcon}
            width={35}
            className="cursor-pointer action-icon"
            onClick={() => {
              history.push(
                `/booking/edit/${item?._id}/?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}&bookingId=${item?.bookingId}&startDate=${item?.startDate}&endDate=${item?.endDate}&count=${item?.count}&earlyCheckIn=${item?.earlyCheckIn}&lateCheckout=${item?.lateCheckout}`
              );
            }}
          />
        ),
        delete: (
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer action-icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
                html: `
                  <h3 class="swal-heading mt-1">${t("dharmshala_booking_delete")}</h3>
                  <p>${t("dharmshala_booking_delete_sure")}</p>
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
        ),
      };
    });
  }, [data, currentPage, currentStatus, currentFilter, deleteMutation, t, history]);

  return (
    <DharmshalaBookingTableWrapper>
      {isMobileView ? (
        <div className="card-container">
          {DharmshalasBooking.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="card-content">
                  <h5 className="card-title">{item?.bookingId}</h5>
                  <p className="card-text">Start Date: {item?.startDate}</p>
                  <p className="card-text">End Date: {item?.endDate}</p>
                  <p className="card-text">Count: {item?.count}</p>
                  <p className="card-text">Status: {item?.status}</p>
                  <p className="card-text">Early Check In: {item?.earlyCheckIn ? "Yes" : "No"}</p>
                  <p className="card-text">Late Check Out: {item?.lateCheckout ? "Yes" : "No"}</p>
                </div>
                <div className="card-icons">
                  {item.edit}
                  {item.delete}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CustomDataTable
          maxHeight={maxHeight}
          height={height}
          columns={columns}
          data={DharmshalasBooking}
        />
      )}
    </DharmshalaBookingTableWrapper>
  );
};

export default DharmshalaBookingTable;
