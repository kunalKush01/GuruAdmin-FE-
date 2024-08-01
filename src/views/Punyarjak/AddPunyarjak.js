import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createPunyarjak } from "../../api/punarjakApi.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import PunyarjakForm from "../../components/Punyarjak/punyarjakUserForm.js";

import "../../assets/scss/viewCommon.scss";
const handleCreatePunyarjak = async (payload) => {
  return createPunyarjak(payload);
};
const schema = Yup.object().shape({
  description: Yup.string().required("punyarjak_desc_required").trim(),
  title: Yup.string()
    .matches(/^[^!@$%^*()_+\=[\]{};':"\\|.<>/?`~]*$/g, "injection_found")
    .required("news_title_required")
    .trim(),
  image: Yup.string().required("img_required"),
});

export default function AddPunyarjak() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");

  const initialValues = {
    title: "",
    description: "",
    image: "",
    DateTime: new Date(),
  };

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() => history.push(`/punyarjak?page=${currentPage}`)}
          />
          <div className="addAction">
            <Trans i18nKey={"add_punyarjak"} />
          </div>
        </div>
        {/* <div className="AddAction">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>

      <div className="mt-1">
        <PunyarjakForm
          handleSubmit={handleCreatePunyarjak}
          initialValues={initialValues}
          validationSchema={schema}
          buttonName={"add_punyarjak"}
        />
      </div>
    </div>
  );
}
