import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createUser } from "../../../api/userApi.js";
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
  return createUser(payload);
};
const schema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "user_only_letters"
    )
    .required("users_title_required"),
  // mobile: yup.string().required("users_mobile_required"),
  mobile: yup
    .string()
    .min(9, "Mobile Number must me 10 digits")
    .required("users_mobile_required"),
  email: yup.string().email("Invalid email").required("users_email_required"),
});

export default function AddCategory() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const userRoleQuery = useQuery(
    ["userRoles", selectedLang.id],
    async () =>
      await getAllTrustType({
        languageId: selectedLang.id,
      })
  );
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
        <UserForm
          loadOptions={userRoleQuery?.data?.results ?? [] }
          userRole={"role"}
          handleSubmit={handleCreateUser}
          initialValues={{
            name: "",
            mobile: "",
            email: "",
            role: "",
          }}
          vailidationSchema={schema}
          buttonName={"users_AddUser"}
        />
      {/* ) : ( */}
        {/* "" */}
      {/* )} */}
    </NoticeWraper>
  );
}
