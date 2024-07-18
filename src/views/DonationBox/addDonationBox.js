import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createBoxCollection } from "../../api/donationBoxCollectionApi";
import { createExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationBoxForm from "../../components/DonationBox/donationBoxForm";

import '../../styles/viewCommon.scss';
;

const handleCollectionBox = async (payload) => {
  return createBoxCollection(payload);
};
const schema = Yup.object().shape({
  // CreatedBy: Yup.string().required("news_tags_required"),
  Amount: Yup.string()
    .matches(/^[1-9][0-9]*$/, "invalid_amount")
    .required("amount_required"),
  Body: Yup.string().required("donation_box_desc_required").trim(),
  DateTime: Yup.string(),
});

export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);

  const initialValues = {
    Id: "",
    CreatedBy: loggedInUser,
    Body: "",
    Amount: "",
    DateTime: new Date(),
  };

  return (
    <div className="newswrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(`/hundi?page=${currentPage}&filter=${currentFilter}`)
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
      <div className="ms-md-3 mt-1">
        <DonationBoxForm
          handleSubmit={handleCollectionBox}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="DonationBox_AddCollectionBox"
        />
      </div>
    </div>
  );
}
