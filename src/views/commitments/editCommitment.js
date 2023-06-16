import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as yup from "yup";
import {
  getCommitmentDetail,
  updateCommitmentDetail,
} from "../../api/commitmentApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import CommitmentForm from "../../components/commitments/commitmentForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const CommitmentWarapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .editCommitment {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const schema = yup.object().shape({
  Mobile: yup
    .string()
    
    .required("expenses_mobile_required"),
  SelectedUser: yup.mixed().required("user_select_required"),
  donarName: yup
    .string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "donation_donar_name_only_letters"
    ).trim(),
  SelectedMasterCategory: yup.mixed().required("masterCategory_required"),
  SelectedSubCategory: yup.mixed(),
  Amount: yup
    .string()
    .matches(/^[1-9][0-9]*$/, "invalid_amount")
    .required("amount_required"),
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

export default function EditCommitment() {
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
      Id: commitmentDetailQuery?.data?.result?.id,
      Mobile: commitmentDetailQuery?.data?.result?.user?.mobileNumber,
      countryCode:commitmentDetailQuery?.data?.result?.user?.countryName ?? "",
      dialCode:commitmentDetailQuery?.data?.result?.user?.countryCode ?? "",
      SelectedUser: commitmentDetailQuery?.data?.result?.user,
      donarName: commitmentDetailQuery?.data?.result?.donarName,
      SelectedMasterCategory:
        commitmentDetailQuery?.data?.result?.masterCategory,
      SelectedSubCategory: commitmentDetailQuery?.data?.result?.category,
      createdBy: commitmentDetailQuery?.data?.result?.createdBy.name,
      Amount: commitmentDetailQuery?.data?.result?.amount,
      DateTime: moment(commitmentDetailQuery?.data?.result?.commitmentEndDate)
        .utcOffset("+0530")
        .toDate(),
    };
  }, [commitmentDetailQuery]);

  return (
    <CommitmentWarapper>
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
            <div className="ms-md-3 mt-1 mb-3">
              <CommitmentForm
                vailidationSchema={schema}
                disbleCategoryOnEdit
                getCommimentMobile={commitmentDetailQuery?.data?.result?.user?.countryCode + commitmentDetailQuery?.data?.result?.user?.mobileNumber}
                initialValues={initialValues}
                showTimeInput
                handleSubmit={handleCommitmentUpdate}
                buttonName={"save_changes"}
              />
            </div>
          )}
        </Else>
      </If>
    </CommitmentWarapper>
  );
}
