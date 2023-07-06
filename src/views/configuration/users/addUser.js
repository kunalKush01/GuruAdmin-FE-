import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createSubAdmin, getAllUserRoles } from "../../../api/userApi.js";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import UserForm from "../../../components/users/userForm.js";

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

const handleCreateUser = async (payload) => {
  return createSubAdmin(payload);
};
const schema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "user_only_letters"
    )
    .required("users_title_required").trim(),
  mobile: yup
    .string()
    
    .required("users_mobile_required"),
  email: yup.string().email("email_invalid").required("users_email_required").trim(),
  password: yup.string().required("password_required").trim(),
  userRoleChacked: yup
    .array()
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
    <NoticeWraper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/configuration/users?page=${currentPage}`)
            }
          />
          <div className="addNotice">
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
            countryCode:"in",
            dialCode:"91",
            email: "",
            password: "",
            file: "",
            userRoleChacked: [],
          }}
          vailidationSchema={schema}
          buttonName={"users_AddUser"}
        />
      </div>
      {/* ) : ( */}
      {/* "" */}
      {/* )} */}
    </NoticeWraper>
  );
}
