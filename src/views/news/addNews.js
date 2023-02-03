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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { useSelector } from "react-redux";
import { authApiInstance } from "../../axiosApi/authApiInstans";
import NewsForm from "../../components/news/newsForm";

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
  Title: yup.string().required("news_title_required"),
  Tags: yup.string().required("news_tags_required"),
  Body: yup.string().required("news_desc_required"),
  PublishedBy: yup.string().required("news_publish_required"),
  DateTime: yup.string(),
});



export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector((state)=>state.auth.userDetail?.name)

  
  
  const initialValues = {
    Id: "",
    Title: "",
    Tags: "",
    Body: "",
    PublishedBy: loggedInUser,
    DateTime: new Date(),
  };
  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/news")}
          />
          <div className="addNews">
            <Trans i18nKey={"news_AddNews"} />
          </div>
        </div>
        <div className="addNews">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
      </div>
      <div className="ms-3 mt-1">
        <NewsForm
          handleSubmit={handleCreateNews}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName={"news_button_Publish"}
        />
      </div>
    </NewsWarper>
  );
}
