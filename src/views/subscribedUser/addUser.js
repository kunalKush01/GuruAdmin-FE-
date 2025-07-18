import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createSubscribedUser } from "../../api/subscribedUser.js";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import SubscribedUserForm from "../../components/subscribedUser/subscribedUserForm.js";

import "../../assets/scss/viewCommon.scss";

const handleCreateUser = async (payload) => {
  return createSubscribedUser(payload);
};

const schema = Yup.object().shape({
  mobile: Yup.string().required("users_mobile_required"),
  email: Yup.string()
    .email("email_invalid")
    .required("users_email_required")
    .trim(),
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "user_only_letters"
    )
    .required("users_title_required")
    .trim(),
});

export default function AddSubscribedUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const redirectTo = searchParams.get("redirect");
  const dialCode = searchParams.get("dialCode");
  const mobileNumber = searchParams.get("mobileNumber");

  const phoneNumber = `${dialCode}${mobileNumber}`;

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() =>
              navigate(
                `/${redirectTo}/add?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}&dialCode=${dialCode}&mobileNumber=${mobileNumber}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"add_user"} />
          </div>
        </div>
        {/* <div className="addAction">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>

      <div className="ms-3 mt-1">
        <SubscribedUserForm
          handleSubmit={handleCreateUser}
          addDonationUser
          initialValues={{
            name: "",
            mobile: mobileNumber || "",
            countryCode: "in",
            dialCode: "91",
            email: "",
          }}
          validationSchema={schema}
          buttonName={"add_user"}
          getNumber={phoneNumber}
        />
      </div>
    </div>
  );
}
