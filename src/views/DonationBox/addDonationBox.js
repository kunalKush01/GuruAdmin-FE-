import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createBoxCollection } from "../../api/donationBoxCollectionApi";
import { createExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationBoxForm from "../../components/DonationBox/donationBoxForm";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCollectionBox = async (payload) => {
  return createBoxCollection(payload);
};
const schema = yup.object().shape({
  // CreatedBy: yup.string().required("news_tags_required"),
  Amount: yup.number().required("donation_box_amount_required"),
  Body: yup.string().required("donation_box_desc_required"),
  DateTime: yup.string(),
});

const initialValues = {
  Id:"",
  CreatedBy: "admin",
  Body: "",
  Amount: "",
  DateTime: new Date(),
};

export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);

  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/Hundi")}
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
      <div className="ms-3 mt-1">
        <DonationBoxForm
          handleSubmit={handleCollectionBox}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="DonationBox_AddCollectionBox"
        />
      </div>
    </NewsWarper>
  );
}
