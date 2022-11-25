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
import { createNotice } from "../../api/noticeApi.js";
import NoticeForm from "../../components/notices/noticeForm";

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

const handleCreateNotice = async (payload) => {
  
  return createNotice(payload);
};
const schema = yup.object().shape({
  Title: yup.string().required("notices_title_required"),  
  Body: yup.string().required("notices_desc_required"),  
  DateTime: yup.string(),
  SelectedNotice:yup.mixed()
});

const initialValues = {
  SelectedNotice: null,
  Id: "",
  Title: "",
  Body: "",  
  DateTime: new Date(),
};
 

export default function AddCategory() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang= useSelector(state=>state.auth.selectLang)
  

  return (
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/notices")}
          />
          <div className="addNotice">
            <Trans i18nKey={"notices_AddNotice"} />
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

      <NoticeForm
        handleSubmit={handleCreateNotice}
        initialValues={initialValues}
        vailidationSchema={schema}
        showTimeInput
      />
    </NoticeWraper>
  );
}
