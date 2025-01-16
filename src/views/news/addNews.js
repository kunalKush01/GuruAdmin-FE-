import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createNews } from "../../api/newsApi";
import { getAllTrustPrefeces } from "../../api/profileApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import NewsForm from "../../components/news/newsForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";

const handleCreateNews = async (payload) => {
  return createNews(payload);
};
const schema = Yup.object().shape({
  Title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("news_title_required")
    .trim(),
  // Tags: Yup.string().required("news_tags_required"),
  Body: Yup.string().required("news_desc_required").trim(),
  PublishedBy: Yup.string().required("news_publish_required"),
  DateTime: Yup.string(),
  // tagsInit:Yup.array().max(15 ,"tags_limit"),
  preference: Yup.array()
    .min(1, "trust_prefenses_required")
    .required("trust_prefenses_required"),
});

export default function AddNews() {
  const history = useHistory();
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
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="d-flex align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/news?page=${currentPage}&filter=${currentFilter}`)
            }
          />
          <div className="addAction">
            <Trans i18nKey={"news_AddNews"} />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <NewsForm
          handleSubmit={handleCreateNews}
          initialValues={initialValues}
          trustPreference={trustPreference}
          validationSchema={schema}
          showTimeInput
          buttonName={"news_button_Publish"}
        />
      </div>
    </div>
  );
}
