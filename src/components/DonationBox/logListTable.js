import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import avtarIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
export default function LogListTable({ data }) {
  
  const { t } = useTranslation();

  const columns = [
    {
      name: t("logData_editedBy"),
      selector: (row) => row.editedBy,
    },
    {
      name: t("logData_createdBy"),
      selector: (row) => row.createdBy,
      // width:"150px",
    },
    {
      name: t("logData_timeDate"),
      selector: (row) => row.timeDate,
      // width:"150px",
    },

    {
      name: t("logData_createdAmount"),
      selector: (row) => row.createdAmount,
    },

    {
      name: t("logData_editedAmount"),
      selector: (row) => row.editedAmount,
    },
  
  ];

  const logData =useMemo(()=>{
    return data.map((item,idx)=>{
      return{
        id:idx+1,
        editedBy:item?.updatedUser?.name,
        createdBy:item?.createdUser?.name,
        timeDate:moment(item.createdAt).format(
          " DD MMM YYYY,hh:mm A"
        ),
        createdAmount:item?.oldAmount,
        editedAmount:item?.amount,
      }
    })
  }) 
  

  const LogListTableWarper = styled.div`
    color: #583703 !important;
    font: normal normal bold 15px/23px Noto Sans;
  `;

  return (
    <LogListTableWarper>
      <CustomDataTable
        columns={columns}
        maxHieght="350px"
        data={logData}
      />
    </LogListTableWarper>
  );
}
