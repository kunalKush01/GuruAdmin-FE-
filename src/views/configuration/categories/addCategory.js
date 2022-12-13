import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createSubCategory, getAllMasterCategories } from "../../../api/categoryApi.js";
import { createNotice } from "../../../api/noticeApi.js";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import CategoryForm from "../../../components/categories/categoryForm";
import { CustomDropDown } from "../../../components/partials/customDropDown";
import FormikCustomReactSelect from "../../../components/partials/formikCustomReactSelect.js";

const NoticeWraper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNotice {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateSubCategory = async (payload) => {
  
  return createSubCategory(payload);
};
const schema = yup.object().shape({
  SubCategory: yup.string().required("notices_desc_required"),
});

export default function AddCategory() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );
  return (
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/configuration/categories")}
          />
          <div className="addNotice">
            <Trans i18nKey={"categories_AddCategory"} />
          </div>
        </div>
        <div className="addNotice">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>

      {!masterloadOptionQuery.isLoading && !masterloadOptionQuery.isFetching  ? (
        <CategoryForm
          loadOptions={masterloadOptionQuery?.data?.results}
          placeholder={masterloadOptionQuery?.data?.results[0]?.name ?? "All"}
          CategoryFormName={"MasterCategory"}
          handleSubmit={handleCreateSubCategory}
          initialValues={{
            Id: "",
            MasterCategory: masterloadOptionQuery?.data?.results[0],
            SubCategory: "",
          }}
          vailidationSchema={schema}
          buttonName={"categories_AddCategory"}
        />
      ) : (
        ""
      )}
    </NoticeWraper>
  );
}
