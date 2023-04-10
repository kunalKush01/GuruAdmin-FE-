import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLangNewsDetail,
  createNews,
  getNewsDetail,
  updateNewsDetail,
} from "../../api/newsApi";
import { useSelector } from "react-redux";
import moment from "moment";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import he from "he";
import NewsForm from "../../components/news/newsForm";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  Title: yup.string().required("news_title_required"),
  // Tags: yup.string().required("news_tags_required"),
  Body: yup.string().required("news_desc_required"),
  PublishedBy: yup.string().required("news_publish_required"),
  DateTime: yup.string(),
});

export default function AddLanguageNews() {
  const history = useHistory();
  const { newsId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );
  console.log("langSelection",langSelection);

  const newsDetailQuery = useQuery(
    ["NewsDetail", newsId, selectedLang.id],
    async () => await getNewsDetail({ newsId, languageId: selectedLang.id })
  );

  const handleNewsLangUpdate = (payload) => {
    let languageId;
    langArray.map(async (Item) => {
      if (Item.name == langSelection.toLowerCase()) {
        languageId = Item.id;
      }
    });

    return addLangNewsDetail({ ...payload, languageId });
  };

  const getAvailLangOption = () => {
    if (newsDetailQuery?.data?.result?.languages && langArray) {
      const option = _.differenceBy(
        langArray,
        newsDetailQuery?.data?.result?.languages,
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
    newsDetailQuery?.data?.result?.languages,
  ]);
  useEffect(() => {
    if (availableLangOptions.length != 0) {
      setLangSelection(availableLangOptions[0]?.name);
    }
  }, [availableLangOptions]);
  const tags = newsDetailQuery?.data?.result?.tags?.map((item) => ({
    id: item.id,
    text: item.tag,
    _id: item.id,
  }));
  const initialValues = useMemo(() => {
    return {
      Id: newsDetailQuery?.data?.result?.id,
      Title: newsDetailQuery?.data?.result?.title,
      tagsInit: tags,
      images: [],
      Body: he.decode(newsDetailQuery?.data?.result?.body ?? ""),
      PublishedBy: newsDetailQuery?.data?.result?.publishedBy,
      DateTime: moment(newsDetailQuery?.data?.result?.publishDate)
        .utcOffset("+0530")
        .toDate(),
    };
  }, [newsDetailQuery]);

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/news?page=${currentPage}&filter=${currentFilter}`)
            }
          />
          <div className="editNews">
            <Trans i18nKey={"news_AddLangNews"} />
          </div>
        </div>
        <div className="editNews">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={availableLangOptions}
            className={"ms-1"}
            defaultDropDownName={ConverFirstLatterToCapital(langSelection ?? "")}
            handleDropDownClick={(e) =>
              setLangSelection(ConverFirstLatterToCapital(e.target.name))
            }
            // disabled
          />
        </div>
      </div>

      {!newsDetailQuery.isLoading ? (
        <div className="ms-3 mt-1">
          <NewsForm
            editImage="edit"
            defaultImages={newsDetailQuery?.data?.result?.images}
            initialValues={initialValues}
            vailidationSchema={schema}
            showTimeInput
            buttonName={"news_AddLangNews"}
            handleSubmit={handleNewsLangUpdate}
          />
        </div>
      ) : (
        ""
      )}
    </NewsWarper>
  );
}
