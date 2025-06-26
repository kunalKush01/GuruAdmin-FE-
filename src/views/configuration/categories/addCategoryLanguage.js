import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../../components/partials/customDropDown";

import { useSelector } from "react-redux";
import {
  addLangCategoryDetail,
  getSubCategoryDetail,
} from "../../../api/categoryApi";
import CategoryForm from "../../../components/categories/categoryForm";
import { ConverFirstLatterToCapital } from "../../../utility/formater";

import "../../../assets/scss/viewCommon.scss";
const schema = Yup.object().shape({
  MasterCategory: Yup.mixed().required("categories_category_required"),
  SubCategory: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("categories_sub_category_required")
    .trim(),
});

export default function AddLanguageCategory() {
  const navigate = useNavigate();
  const { subCategoryId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState("Select");
  const subCategoryDetailQuery = useQuery(
    ["SubCategories", subCategoryId, selectedLang.id],
    async () =>
      await getSubCategoryDetail({
        categoryId: subCategoryId,
        languageId: selectedLang.id,
      })
  );

  const handleCategoryLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangCategoryDetail({
      ...payload,
      languageId,
      categoryId: subCategoryDetailQuery?.data?.result?.id,
    });
  };

  const getAvailLangOption = () => {
    if (subCategoryDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        subCategoryDetailQuery?.data?.result?.languages,
        "id"
      );
      if (_.isEqual(option, langArray)) {
        return [];
      }

      return option;
    }
    return [];
  };

  const availableLangOptions = useMemo(getAvailLangOption, [
    langArray,
    subCategoryDetailQuery?.data?.result?.languages,
  ]);

  return (
    <div className="categorylangwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              navigate(
                `/configuration/categories?page=${currentPage}&filter=${currentFilter}`
              )
            }
          />
          <div className="categoryAddLang">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="categoryAddLang">
          <div className="d-none d-sm-block">
            <Trans i18nKey={"news_InputIn"} />
          </div>
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(
              langSelection ?? ""
            )}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!subCategoryDetailQuery.isLoading ? (
        <div className="mt-1">
          <CategoryForm
            loadOptions={[subCategoryDetailQuery?.data?.result?.masterCategory]}
            langSelectionValue={langSelection}
            AddLanguage
            CategoryFormName={"MasterCategory"}
            handleSubmit={handleCategoryLangUpdate}
            initialValues={{
              Id: "",
              MasterCategory:
                subCategoryDetailQuery?.data?.result?.masterCategory,
              SubCategory: subCategoryDetailQuery?.data?.result?.name,
            }}
            buttonName={"news_AddLangNews"}
            validationSchema={schema}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
