import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createBoxCollection } from "../../api/donationBoxCollectionApi";
import { createExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationBoxForm from "../../components/DonationBox/donationBoxForm";

import "../../assets/scss/viewCommon.scss";
import { useQuery } from "@tanstack/react-query";
import { getDonationBoxCustomFields } from "../../api/customFieldsApi";
import { getAllAccounts } from "../../api/profileApi";
export default function AddNews() {
  const handleCollectionBox = async (payload) => {
    return createBoxCollection(payload);
  };

  const navigate = useNavigate();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);
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
  const initialValues = {
    Id: "",
    CreatedBy: loggedInUser,
    Body: "",
    Amount: "",
    accountId: "",
    DateTime: new Date(),
    customFields: customFieldsList.reduce((acc, field) => {
      acc[field.fieldName] = "";
      return acc;
    }, {}),
  };

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              navigate(`/hundi?page=${currentPage}&filter=${currentFilter}`)
            }
          />
          <div className="addNews">
            <Trans i18nKey={"DonationBox_AddDonationBox"} />
          </div>
        </div>
        {/* <div className="addNews">
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
        <DonationBoxForm
          handleSubmit={handleCollectionBox}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="DonationBox_AddCollectionBox"
          customFieldsList={customFieldsList}
          flattenedAccounts={flattenedAccounts}
        />
      </div>
    </div>
  );
}
