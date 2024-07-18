import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import '../../../src/styles/common.scss';
export default function SubscribedUSerListTable({ data }) {
  const { t } = useTranslation();

  const columns = [
    {
      name: t("subscribed_user_name"),
      selector: (row) => row.name,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
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

  const subscribed_user = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        name: (
          <div className="d-flex align-items-center ">
            <img
              src={
                item?.profileImage !== "" && item?.profileImage
                  ? item?.profileImage
                  : avtarIcon
              }
              style={{
                marginRight: "5px",
                width: "30px",
                height: "30px",
              }}
              className="rounded-circle"
            />
            <div>{ConverFirstLatterToCapital(item?.name ?? "-")}</div>
          </div>
        ),
        mobileNumber:
          `+${item?.countryCode?.replace("+", "") ?? "91"} ${
            item?.mobileNumber
          }` ?? "-",
        email: item?.email ?? "-",
        dateOfBirth: moment(item?.dob).format("DD MMM YYYY "),
        address: item?.address ?? "-",
        panCardDetails: item?.cardNumber ?? "-",
      };
    });
  });

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
  const SubscribedUSerTableWarper = styled.div``;
;

  return (
    <div className="subscribedusertablewarper">
      <CustomDataTable
        maxHeight={""}
        columns={columns}
        data={subscribed_user}
      />
    </div>
  );
}
