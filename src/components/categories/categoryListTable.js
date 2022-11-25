import { useTranslation, Trans } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import editIcon from "../../assets/images/icons/category/editIcon.svg"
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg"
import { useMemo } from "react";

export function CategoryListTable({data}) {
  const { t } = useTranslation();
  const history = useHistory()

  const columns = [
    {
      name: t("Serial Number"),
      selector: (row) => row.id,
     style:{
        font:"normal normal bold 10px/20px noto sans !important "
     }
    },
    {
      name: t("Master Category"),
      selector: (row) => row.masterCategory,
    },
    {
      name: t("Sub Category"),
      selector: (row) => row.subCategory,
    },

    {
      name: "",
      selector: (row) => row.addLanguage,
      
    },
    {
        name: "",
        selector: (row) => row.editCategory,
      },
      {
        name: "",
        selector: (row) => row.deleteCategory,
      },
  ];

  

  const categoriesList = useMemo(()=>{
    return data.map((item,idx)=>({
        _Id:item.id,
        id: `${idx+1}`,
        masterCategory: item.masterCategory.name,
        subCategory: item.name,
        addLanguage:<Button outline onClick={()=>history.push(`configuration/categories/add-language/${item.id}`)} color="primary" style={{padding:"5px 20px"}} >{"Add Language"}</Button>,
        editCategory:<img src={editIcon} width={35}  />,
        deleteCategory:<img src={deleteIcon} width={35} />,
  
      }))
  },[data])  

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
        data={categoriesList}
      />
    </RecentDonationTableWarper>
  );
}
