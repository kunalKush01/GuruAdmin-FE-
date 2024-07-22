import React from "react";
import { Trans } from "react-i18next";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";
import { createDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationForm from "../../components/donation/donationForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";

const handleCreateDonation = async (payload) => {
  return createDonation(payload);
};
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
  Amount: Yup.string()
    .matches(/^[1-9][0-9]*$/, "invalid_amount")
    .required("amount_required"),
});

export default function AddDonation() {
  const history = useHistory();
  // const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");

  const initialValues = {
    Mobile: "",
    countryCode: "in",
    dialCode: "91",
    SelectedUser: "",
    donarName: "",
    SelectedMasterCategory: "",
    SelectedSubCategory: "",
    SelectedCommitmentId: "",
    Amount: "",
    isGovernment: "NO",
    createdBy: ConverFirstLatterToCapital(loggedInUser),
  };
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              history.push(
                `/donation?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"donation_Adddonation"} />
          </div>
        </div>
      </div>
      <div className="ms-md-3 mt-1">
        <DonationForm
          handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="donation_Adddonation"
        />
      </div>
    </div>
  );
}
