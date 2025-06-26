import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  IsFixedAmount: Yup.boolean().required(), // Fixed the definition of Yup.boolean()
  Amount: Yup.string()
    .matches(/^(0|[1-9]\d*)(\.\d+)?$/, "invalid_amount") // Allows 0, positive integers, and positive decimals
    .when("IsFixedAmount", {
      is: true, // Conditional validation: Amount is required if IsFixedAmount is true
      then: Yup.string()
        .required("amount_required") // Ensures Amount is required
        .test(
          "is-greater-than-zero",
          "Amount must be greater than 0",
          (value) => parseFloat(value) > 0
        ), // Custom validation for greater than 0
      otherwise: Yup.string(), // Not required if IsFixedAmount is false
    }),
});

export default function AddCategory() {
  const navigate = useNavigate();
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
              navigate(
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
              IsFixedAmount: false,
              Amount: 0,
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
