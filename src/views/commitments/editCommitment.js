import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import {
  getCommitmentDetail,
  updateCommitmentDetail,
} from "../../api/commitmentApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import CommitmentForm from "../../components/commitments/commitmentForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";
import { getPledgeCustomFields } from "../../api/customFieldsApi";

export default function EditCommitment() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customFieldDataString = queryParams.get("customFieldData");
  const customFieldData = customFieldDataString
    ? JSON.parse(decodeURIComponent(customFieldDataString))
    : {};

  const history = useHistory();
  const { commitmentId } = useParams();
  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentStatus = searchParams.get("status");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const customFieldsQuery = useQuery(
    ["custom-fields"],
    async () => await getPledgeCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const customFieldsList = customFieldsQuery?.data?.customFields ?? [];
  const schema = Yup.object().shape({
    Mobile: Yup.string().required("expenses_mobile_required"),
    SelectedUser: Yup.mixed().required("user_select_required"),
    donarName: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "donation_donar_name_only_letters"
      )
      .trim(),
    SelectedMasterCategory: Yup.mixed().required("masterCategory_required"),
    SelectedSubCategory: Yup.mixed(),
    Amount: Yup.string()
      .matches(/^[1-9][0-9]*$/, "invalid_amount")
      .required("amount_required"),
    customFields: Yup.object().shape(
      customFieldsList.reduce((acc, field) => {
        if (field.isRequired) {
          acc[field.fieldName] = Yup.mixed().required(
            `${field.fieldName} is required`
          );
        }
        return acc;
      }, {})
    ),
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
  const commitmentDetailQuery = useQuery(
    ["CommitmentDetail", commitmentId, langSelection, selectedLang.id],
    async () =>
      await getCommitmentDetail({
        commitmentId,
        languageId: getLangId(langArray, langSelection),
      })
  );
  const handleCommitmentUpdate = async (payload) => {
    return updateCommitmentDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };

  const initialValues = useMemo(() => {
    return {
      Id: commitmentDetailQuery?.data?.result?._id,
      Mobile: commitmentDetailQuery?.data?.result?.user?.mobileNumber,
      countryCode: commitmentDetailQuery?.data?.result?.user?.countryName ?? "",
      dialCode: commitmentDetailQuery?.data?.result?.user?.countryCode ?? "",
      SelectedUser: commitmentDetailQuery?.data?.result?.user,
      donarName: commitmentDetailQuery?.data?.result?.donarName,
      SelectedMasterCategory:
        commitmentDetailQuery?.data?.result?.masterCategory,
      SelectedSubCategory: commitmentDetailQuery?.data?.result?.category,
      createdBy: commitmentDetailQuery?.data?.result?.createdBy.name,
      Amount: commitmentDetailQuery?.data?.result?.amount,
      endDate: moment(commitmentDetailQuery?.data?.result?.commitmentEndDate)
        .utcOffset("+0530")
        .toDate(),
      startDate: moment(
        commitmentDetailQuery?.data?.result?.commitmentStartDate
      )
        .utcOffset("+0530")
        .toDate(),
      customFields: commitmentDetailQuery?.data?.result?.customFields.reduce(
        (acc, field) => {
          acc[field.fieldName] =
            field.fieldType === "Select"
              ? {
                  label:
                    typeof field.value === "boolean"
                      ? field.value
                        ? "True"
                        : "False"
                      : field.value,
                  value: field.value,
                }
              : typeof field.value === "string" &&
                !isNaN(Date.parse(field.value))
              ? moment(field.value).utcOffset("+0530").toDate()
              : field.value ?? "";
          return acc;
        },
        {}
      ),
    };
  }, [commitmentDetailQuery]);

  return (
    <div className="commitmentwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/commitment?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="editCommitment">
            <Trans i18nKey={"edit_commitment"} />
          </div>
        </div>
      </div>
      <If condition={commitmentDetailQuery.isLoading} diableMemo>
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
          {!commitmentDetailQuery?.isLoading && (
            <div className="mt-1 mb-3">
              <CommitmentForm
                validationSchema={schema}
                disableOnEdit
                getCommitmentMobile={
                  commitmentDetailQuery?.data?.result?.user?.countryCode +
                  commitmentDetailQuery?.data?.result?.user?.mobileNumber
                }
                initialValues={initialValues}
                showTimeInput
                handleSubmit={handleCommitmentUpdate}
                buttonName={"save_changes"}
                customFieldsList={customFieldsList}
                paidAmount={commitmentDetailQuery?.data?.result?.paidAmount}
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
}
