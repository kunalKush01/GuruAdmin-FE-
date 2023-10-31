import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import {
  createSubCategory,
  getAllMasterCategories,
} from "../../../api/categoryApi.js";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import CategoryForm from "../../../components/categories/categoryForm";
import { CustomDropDown } from "../../../components/partials/customDropDown";

const CategoryAddWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  // .ImagesVideos {
  //   font: normal normal bold 15px/33px Noto Sans;
  // }
  .addCategory {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateSubCategory = async (payload) => {
  return createSubCategory(payload);
};
const schema = yup.object().shape({
  MasterCategory: yup.mixed().required("categories_category_required"),
  SubCategory: yup
    .string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("categories_sub_category_required")
    .trim(),
});

export default function AddCategory() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );
  return (
    <CategoryAddWrapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() =>
              history.push(
                `/configuration/categories?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="addCategory">
            <Trans i18nKey={"categories_AddCategory"} />
          </div>
        </div>
        <div className="addCategory">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>

      {!masterloadOptionQuery.isLoading && !masterloadOptionQuery.isFetching ? (
        <div className="ms-sm-3 mt-1">
          <CategoryForm
            loadOptions={masterloadOptionQuery?.data?.results}
            CategoryFormName={"MasterCategory"}
            handleSubmit={handleCreateSubCategory}
            initialValues={{
              Id: "",
              MasterCategory: masterloadOptionQuery?.data?.results[0],
              SubCategory: "",
            }}
            validationSchema={schema}
            buttonName={"categories_AddCategory"}
          />
        </div>
      ) : (
        ""
      )}
    </CategoryAddWrapper>
  );
}
