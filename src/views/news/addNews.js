import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../../components/partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { authApiInstance } from "../../axiosApi/authApiInstans";
import NewsForm from "../../components/news/newsForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { getAllTrustPrefeces } from "../../api/profileApi";
import { createNews } from "../../api/newsApi";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateNews = async (payload) => {
  return createNews(payload);
};
const schema = yup.object().shape({
  Title: yup.string().matches(/^[^!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]*$/g,"injection_found").required("news_title_required"),
  // Tags: yup.string().required("news_tags_required"),
  Body: yup.string().required("news_desc_required"),
  PublishedBy: yup.string().required("news_publish_required"),
  DateTime: yup.string(),
  tagsInit:yup.array().max(15 ,"tags_limit"),
  preference: yup.array().min(1,"trust_prefenses_required").required("trust_prefenses_required"),

});

export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector((state) => state.auth.userDetail?.name);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
 // Trust preference
 const loadTrustPreference = useQuery(["Preference"], () =>
 getAllTrustPrefeces()
);

const trustPreference = useMemo(
 () => loadTrustPreference?.data?.results ?? [],
 [loadTrustPreference?.data?.results]
);

  const initialValues = {
    Id: "",
    Title: "",
    images: [],
    preference: [],
    tagsInit: [],
    Body: "",
    PublishedBy: ConverFirstLatterToCapital(loggedInUser ?? ""),
    DateTime: new Date(),
  };
  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/news?page=${currentPage}&filter=${currentFilter}`)
            }
          />
          <div className="addNews">
            <Trans i18nKey={"news_AddNews"} />
          </div>
        </div>
        <div className="addNews">
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
      <div className="mt-1 ms-sm-3 ms-1">
        <NewsForm
          handleSubmit={handleCreateNews}
          initialValues={initialValues}
          trustPreference={trustPreference}
          vailidationSchema={schema}
          showTimeInput
          buttonName={"news_button_Publish"}
        />
      </div>
    </NewsWarper>
  );
}
