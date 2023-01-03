import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
export default function SubscribedUSerListTable({ data }) {
  const handleDeleteSubscribedUser = async (payload) => {
    return deleteSubscribedUSerDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteSubscribedUser,
    onSuccess: (data) => {      
      if (!data.error) {        
        queryCient.invalidateQueries(["subscribedUser"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("subscribed_user_name"),
      selector: (row) => row.name,
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
      name: t("subscribed_user_email"),
      selector: (row) => row.email,
      // width:"150px",
    },

    {
      name: t("subscribed_user_date_birth"),
      selector: (row) => row.dateOfBirth,
      // width:"150px",
    },

    {
      name: t("subscribed_user_address"),
      selector: (row) => row.address,
    },
    {
      name: t("subscribed_user_pan_cardDetail"),
      selector: (row) => row.panCardDetails,
    },
  ];

  const subscribed_user =useMemo(()=>{
    return data.map((item,idx)=>{
      return{
        id:idx+1,
        name: (
                <div className="d-flex align-items-center ">
                  <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
                  <div>{ConverFirstLatterToCapital(item?.name??"-")}</div>
                </div>
            ),
        mobileNumber:item?.mobileNumber??"-",
        email:item?.email??"-",
        dateOfBirth:item?.dob??"-",
        address:item?.address??"-",
        panCardDetails:item?.cardNumber??"-",
      }
    })
  }) 
  
//   const Donatio_data=useMemo(()=>{
//     return data.map((item,idx)=>{
//       return {
//         id:idx+1 ,
//         username: (
//           <div className="d-flex align-items-center ">
//             <img src={avtarIcon} style={{ marginRight: "5px", width: "25px" }} />
//             <div>{item?.user?.name??""}</div>
//           </div>
//         ),
//         mobileNumber: `+91-${item?.user?.mobileNumber}`,
//         donarName: item?.donarName??item.user?.name,
//         category: <div>{item?.masterCategory?.name}{item?.subCategory&&`(${item?.subCategory.name})`}</div>,
//         date_time:"03:02 PM, 21 Aug 2022",
//         amount:item?.amount,
//         commitmentID:`${item?.commitmentId??"-"}`,
//         receipt: (
//                 <img
//                   src={receiptIcon}
//                   width={25}
//                   className="cursor-pointer"
//                   onClick={() =>
//                     history.push(`/donation`)
//                   }
//                 />
//               ),
//       }
//     })
//   },[data])
  const SubscribedUSerTableWarper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
    font: normal normal bold 15px/23px Noto Sans;
  `;

  return (
    <SubscribedUSerTableWarper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHieght={""}
        columns={columns}
        data={subscribed_user}
      />
    </SubscribedUSerTableWarper>
  );
}
