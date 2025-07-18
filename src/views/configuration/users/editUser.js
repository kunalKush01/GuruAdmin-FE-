import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";

import { getSubAdminDetail, updateSubAdminUser } from "../../../api/userApi";
import UserForm from "../../../components/users/userForm";
import "../../../assets/scss/viewCommon.scss";
const schema = Yup.object().shape({
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "user_only_letters"
    )
    .required("users_title_required")
    .trim(),
  // mobile: Yup.string().required("users_mobile_required"),
  mobile: Yup.string().required("users_mobile_required"),
  email: Yup.string()
    .email("email_invalid")
    .required("users_email_required")
    .trim(),
  userRoleChecked: Yup.array()
    .min(1, "minimum_one_role_required")
    .required("user_userRoleRequired"),
});

const getLangId = (langArray, langSelection) => {
  let languageId;
  langArray.map(async (Item) => {
    if (Item.name == langSelection.toLowerCase()) {
      languageId = Item.id;
    }
  });
  return languageId;
};

export default function EditSubAdmin() {
  const navigate = useNavigate();
  const { subAdminId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [langSelection, setLangSelection] = useState(selectedLang.name);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const subAdminUserDetailQuery = useQuery(
    ["subAdimnDetails", subAdminId, langSelection],
    () => getSubAdminDetail(subAdminId)
  );

  const handleSubAdminUpdate = async (payload) => {
    return updateSubAdminUser({
      ...payload,
    });
  };

  const initialValues = useMemo(() => {
    return {
      Id: subAdminUserDetailQuery?.data?.result?.id,
      name: subAdminUserDetailQuery?.data?.result?.name,
      mobile: subAdminUserDetailQuery?.data?.result?.mobileNumber,
      countryCode: subAdminUserDetailQuery?.data?.result?.countryName ?? "",
      dialCode: subAdminUserDetailQuery?.data?.result?.countryCode ?? "",
      userRoleChecked: subAdminUserDetailQuery?.data?.result?.roles,
      email: subAdminUserDetailQuery?.data?.result?.email,
      password: "",
      file: subAdminUserDetailQuery?.data?.result?.profilePhoto,
    };
  }, [subAdminUserDetailQuery]);

  return (
    <div className="subadminuserwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() =>
              navigate(`/configuration/users?page=${currentPage}`)
            }
          />
          <div className="editNotice">
            <Trans i18nKey={"user_editUser"} />
          </div>
        </div>
      </div>

      <If
        disableMemo
        condition={
          subAdminUserDetailQuery.isLoading ||
          subAdminUserDetailQuery.isFetching
        }
      >
        <Then>
          <Row>
            <SkeletonTheme
              baseColor="#FFF7E8"
              highlightColor="#fff"
              borderRadius={"10px"}
            >
              <Col xs={7} className="me-1">
                <Row className="my-1">
                  <Col xs={6}>
                    <Skeleton height={"36px"} />
                  </Col>
                  <Col xs={6}>
                    <Skeleton height={"36px"} />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Skeleton height={"150px"} />
                  </Col>
                </Row>
              </Col>
              <Col className="mt-1">
                <Skeleton height={"318px"} width={"270px"} />
              </Col>
            </SkeletonTheme>
          </Row>
        </Then>
        <Else>
          {!!subAdminUserDetailQuery?.data?.result && (
            <div className="px-1">
              <UserForm
                editProfile
                editTrue="edit"
                profileImageName={
                  subAdminUserDetailQuery?.data?.result?.profileName
                }
                getUserMobile={
                  subAdminUserDetailQuery?.data?.result?.countryCode +
                  subAdminUserDetailQuery?.data?.result?.mobileNumber
                }
                buttonName={"user_editUser"}
                initialValues={initialValues}
                validationSchema={schema}
                handleSubmit={handleSubAdminUpdate}
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
}
