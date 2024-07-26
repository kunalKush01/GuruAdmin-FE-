import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import { getCommitmentDetail } from "../../api/commitmentApi";
import { createDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationForm from "../../components/donation/donationForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";

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

export default function PayDonation() {
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
    ["donations", commitmentId, langSelection, selectedLang.id],
    async () =>
      await getCommitmentDetail({
        commitmentId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const handlePayDonation = async (payload) => {
    return createDonation(payload);
  };
  const initialValues = useMemo(() => {
    return {
      Id: commitmentDetailQuery?.data?.result?.id,
      Mobile: commitmentDetailQuery?.data?.result?.user?.mobileNumber,
      countryCode: commitmentDetailQuery?.data?.result?.user?.countryName ?? "",
      dialCode: commitmentDetailQuery?.data?.result?.user?.countryCode ?? "",
      SelectedUser: commitmentDetailQuery?.data?.result?.user,
      donarName: commitmentDetailQuery?.data?.result?.donarName,
      SelectedMasterCategory:
        commitmentDetailQuery?.data?.result?.masterCategory,
      SelectedSubCategory: commitmentDetailQuery?.data?.result?.category,
      SelectedCommitmentId: {
        commitmentId: commitmentDetailQuery?.data?.result?.commitmentId,
        paidAmount: commitmentDetailQuery?.data?.result?.paidAmount,
        amount: commitmentDetailQuery?.data?.result?.amount,
      },
      createdBy: commitmentDetailQuery?.data?.result?.createdBy.name,
      Amount:
        commitmentDetailQuery?.data?.result?.amount -
        commitmentDetailQuery?.data?.result?.paidAmount,
      DateTime: moment(
        commitmentDetailQuery?.data?.result?.commitmentEndDate
      ).toDate(),
    };
  }, [commitmentDetailQuery]);

  return (
    <div className="listviewwrapper" style={{ padding: 0 }}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ padding: 0, margin: 0 }}
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ padding: 0, margin: 0 }}
        >
          <img
            src={arrowLeft}
            className="me-2 cursor-pointer"
            onClick={() =>
              currentCategory === null
                ? history.push("/commitment")
                : history.push(
                    `/commitment?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                  )
            }
          />
          <div className="editCommitment" style={{ padding: 0, margin: 0 }}>
            <Trans i18nKey={"pay_donation"} />
          </div>
        </div>
      </div>
      <If condition={commitmentDetailQuery.isLoading} diableMemo>
        <Then>
          <Row style={{ padding: 0, margin: 0 }}>
            <SkeletonTheme
              baseColor="#FFF7E8"
              highlightColor="#fff"
              borderRadius={"10px"}
            >
              <Col xs={7} className="me-1" style={{ padding: 0, margin: 0 }}>
                <Row className="my-1" style={{ padding: 0, margin: 0 }}>
                  <Col xs={6} style={{ padding: 0, margin: 0 }}>
                    <Skeleton height={"36px"} />
                  </Col>
                  <Col xs={6} style={{ padding: 0, margin: 0 }}>
                    <Skeleton height={"36px"} />
                  </Col>
                </Row>
                <Row className="mt-4" style={{ padding: 0, margin: 0 }}>
                  <Col style={{ padding: 0, margin: 0 }}>
                    <Skeleton height={"36px"} />
                  </Col>
                </Row>
              </Col>
              <Col className="mt-1" style={{ padding: 0, margin: 0 }}>
                <Skeleton height={"36px"} width={"270px"} />
              </Col>
            </SkeletonTheme>
          </Row>
        </Then>
        <Else>
          {!commitmentDetailQuery?.isLoading && (
            <div
              className="ms-md-3 mt-1 mb-3"
              style={{ padding: 0, margin: 0 }}
            >
              <DonationForm
                validationSchema={schema}
                initialValues={initialValues}
                payDonation
                showTimeInput
                getCommitmentMobile={
                  commitmentDetailQuery?.data?.result?.user?.countryCode +
                  commitmentDetailQuery?.data?.result?.user?.mobileNumber
                }
                handleSubmit={handlePayDonation}
                buttonName={"payment"}
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
}
