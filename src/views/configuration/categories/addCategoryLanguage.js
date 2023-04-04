import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../../components/partials/customDropDown";

import he from "he";
import moment from "moment";
import { useSelector } from "react-redux";
import { addLangCategoryDetail, getSubCategoryDetail } from "../../../api/categoryApi";
import CategoryForm from "../../../components/categories/categoryForm";
import { ConverFirstLatterToCapital } from "../../../utility/formater";

const EventWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editEvent {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  SubCategory: yup.string().matches(
    /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
    'only_letters'
).required("categories_sub_category_required"),
})

export default function AddLanguageEvent() {
  const history = useHistory();
  const { subCategoryId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentFilter = searchParams.get('filter')

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );
  const subCategoryDetailQuery = useQuery(
    ["SubCategories", subCategoryId, selectedLang.id],
    async () => await getSubCategoryDetail({ categoryId:subCategoryId, languageId: selectedLang.id })
    )

  const handleCategoryLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });
    
    return addLangCategoryDetail({ ...payload, languageId,categoryId:subCategoryDetailQuery?.data?.result?.id });
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
  
  useEffect(() => {
    if (availableLangOptions.length != 0) {
      setLangSelection(availableLangOptions[0]?.name);
      
    }
  }, [availableLangOptions,selectedLang.id]);

  

  return (
    <EventWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/configuration/categories?page=${currentPage}&filter=${currentFilter}`)}
          />
          <div className="editEvent">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editEvent">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={langSelection}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!subCategoryDetailQuery.isLoading ? (
        <div className="ms-3 mt-1">
          <CategoryForm
          loadOptions={[subCategoryDetailQuery?.data?.result?.masterCategory]}
          placeholder={
            subCategoryDetailQuery?.data?.result?.masterCategory.name
          }
          CategoryFormName={"MasterCategory"}
          handleSubmit={handleCategoryLangUpdate}
          initialValues={{
            Id: "",
            MasterCategory:
              subCategoryDetailQuery?.data?.result?.masterCategory,
            SubCategory: subCategoryDetailQuery?.data?.result?.name,
          }}
          buttonName={"news_AddLangNews"}
          vailidationSchema={schema}
        />
        </div>
      ) : (
        ""
      )}
    </EventWarper>
  );
}
