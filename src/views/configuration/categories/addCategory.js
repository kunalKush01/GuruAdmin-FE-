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

import "../../../assets/scss/viewCommon.scss";
const handleCreateSubCategory = async (payload) => {
  return createSubCategory(payload);
};
const schema = Yup.object().shape({
  MasterCategory: Yup.mixed().required("categories_category_required"),
  SubCategory: Yup.string()
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
    <div className="listviewwrapper">
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
          <div className="addAction">
            <Trans i18nKey={"categories_AddCategory"} />
          </div>
        </div>
        <div className="addAction">
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
        <div className="mt-1">
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
    </div>
  );
}
