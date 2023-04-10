import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationForm from "../../components/donation/donationForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const DonationWarapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addDonation {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateDonation = async (payload) => {
  return createDonation(payload);
};
const schema = yup.object().shape({
  Mobile: yup.string().min(9 ,"Mobile Number must be 10 digits").required("expenses_mobile_required"),
  SelectedUser: yup.mixed().required("user_select_required"),
  donarName: yup.string().matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      'donation_donar_name_only_letters'
  ),
  SelectedMasterCategory: yup.mixed().required("masterCategory_required"),
  Amount: yup.number().required("amount_required"),
});

export default function AddDonation() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);


  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get('page')
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get('filter')

  const initialValues = {
    Mobile: "",
    SelectedUser: "",
    donarName: "",
    SelectedMasterCategory: "",
    SelectedSubCategory: "",
    SelectedCommitmentId: "",
    Amount: "",
    createdBy: ConverFirstLatterToCapital(loggedInUser),
  };
  return (
    <DonationWarapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push(`/donation?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`)}
          />
          <div className="addDonation">
            <Trans i18nKey={"donation_Adddonation"} />
          </div>
        </div>
      </div>
      <div className="ms-3 mt-1">
        <DonationForm
          handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="donation_Adddonation"
        />
      </div>
    </DonationWarapper>
  );
}
