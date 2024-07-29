import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createSubAdmin, getAllUserRoles } from "../../../api/userApi.js";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import UserForm from "../../../components/users/userForm.js";

import "../../../assets/scss/viewCommon.scss";
const handleCreateUser = async (payload) => {
  return createSubAdmin(payload);
};
const schema = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "user_only_letters"
    )
    .required("users_title_required")
    .trim(),
  mobile: Yup.string().required("users_mobile_required"),
  email: Yup.string()
    .email("email_invalid")
    .required("users_email_required")
    .trim(),
  password: Yup.string()
    .matches(
      /^(?=.*[!@#$%^&*()-_+=|{}[\]:;'"<>,.?/~`])(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
      "Password must contain at least one special character, one number, one capital letter, and one small letter"
    )
    .min(8, "Password is too short - should be 8 chars minimum.")
    .trim(),
  userRoleChecked: Yup.array()
    .min(1, "minimum_one_role_required")
    .required("user_userRoleRequired"),
});

export default function AddCategory() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/configuration/users?page=${currentPage}`)
            }
          />
          <div className="addAction">
            <Trans i18nKey={"users_AddUser"} />
          </div>
        </div>
      </div>
      {/* {!userRoleQuery.isLoading && !userRoleQuery.isFetching ? ( */}
      <div className="px-1">
        <UserForm
          adduser
          userRole={"role"}
          handleSubmit={handleCreateUser}
          initialValues={{
            name: "",
            mobile: "",
            countryCode: "in",
            dialCode: "91",
            email: "",
            password: "",
            file: "",
            userRoleChecked: [],
          }}
          validationSchema={schema}
          buttonName={"users_AddUser"}
        />
      </div>
      {/* ) : ( */}
      {/* "" */}
      {/* )} */}
    </div>
  );
}
