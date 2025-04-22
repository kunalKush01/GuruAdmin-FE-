import { useQuery } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import * as Yup from "yup";
import {
  getCollectionBoxDetail,
  updateCollectionBoxDetail,
} from "../../api/donationBoxCollectionApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationBoxForm from "../../components/DonationBox/donationBoxForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

import "../../assets/scss/viewCommon.scss";
import { getDonationBoxCustomFields } from "../../api/customFieldsApi";
import { getAllAccounts } from "../../api/profileApi";
export default function EditDonationBox() {
  const customFieldsQuery = useQuery(
    ["custom-fields"],
    async () => await getDonationBoxCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const customFieldsList = customFieldsQuery?.data?.customFields ?? [];
  const { data } = useQuery(["Accounts"], () => getAllAccounts(), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching member data:", error);
    },
  });

  const accountsItem = useMemo(() => {
    return data?.result ?? [];
  }, [data]);
  const flattenedAccounts = accountsItem.map((item) => ({
    label: item.name,
    value: item.id,
    ...item,
  }));
  const schema = Yup.object().shape({
    // CreatedBy: Yup.string().required("news_tags_required"),
    Amount: Yup.string()
      .matches(/^[1-9][0-9]*$/, "invalid_amount")
      .required("amount_required"),
    Body: Yup.string().required("donation_box_desc_required").trim(),
    accountId: Yup.mixed().required("Required"),
    DateTime: Yup.string(),
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

  const history = useHistory();

  const { donationBoxId } = useParams();

  const langArray = useSelector((state) => state.auth.availableLang);
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const [langSelection, setLangSelection] = useState(
    ConverFirstLatterToCapital(selectedLang.name)
  );

  const collectionBoxDetailQuery = useQuery(
    ["BoxCollectionDetail", donationBoxId, langSelection, selectedLang.id],
    async () =>
      await getCollectionBoxDetail({
        donationBoxId,
        languageId: getLangId(langArray, langSelection),
      })
  );

  const handleUpdate = async (payload) => {
    return updateCollectionBoxDetail({
      ...payload,
      languageId: getLangId(langArray, langSelection),
    });
  };
  const selectedAccount = flattenedAccounts.find(
    (acc) => acc.value === collectionBoxDetailQuery?.data?.result?.accountId
  );
  const selectedAccountOption = selectedAccount
    ? { label: selectedAccount.label, value: selectedAccount.value }
    : null;

  const initialValues = useMemo(() => {
    return {
      Id: collectionBoxDetailQuery?.data?.result?.id,
      CreatedBy: loggedInUser,
      Body: he?.decode(collectionBoxDetailQuery?.data?.result?.remarks ?? ""),
      Amount: collectionBoxDetailQuery?.data?.result?.amount,
      DateTime: moment(collectionBoxDetailQuery?.data?.result?.collectionDate)
        .utcOffset("+0530")
        .toDate(),
      accountId: selectedAccountOption || "",
      customFields: collectionBoxDetailQuery?.data?.result?.customFields.reduce(
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
              : field.value ?? ""; // Use nullish coalescing to handle undefined values
          return acc;
        },
        {}
      ),
    };
  }, [collectionBoxDetailQuery]);
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/hundi?page=${currentPage}&filter=${currentFilter}`)
            }
          />
          <div className="editNews">
            <Trans i18nKey={"DonationBox_EditCollectionBox"} />
          </div>
        </div>
      </div>
      <If
        condition={
          collectionBoxDetailQuery.isLoading ||
          collectionBoxDetailQuery.isFetching
        }
        diableMemo
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
          {!collectionBoxDetailQuery.isFetching && (
            <div className="mt-1">
              <DonationBoxForm
                buttonName={"save_changes"}
                editLogs
                validationSchema={schema}
                collectionId={donationBoxId}
                initialValues={initialValues}
                showTimeInput
                handleSubmit={handleUpdate}
                customFieldsList={customFieldsList}
                flattenedAccounts={flattenedAccounts}
              />
            </div>
          )}
        </Else>
      </If>
    </div>
  );
}
