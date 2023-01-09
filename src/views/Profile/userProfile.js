import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createNews } from "../../api/newsApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { CustomDropDown } from "../../components/partials/customDropDown";
import ProfileForm from "../../components/Profile/profileForm";

const ProfileWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addProfile {
    color: #583703;
    display: flex;
    align-items: center;
  }

  
`;
const handleCreateNews = async (payload) => {
  return createNews(payload);
};
const schema = yup.object().shape({
  name: yup.string().required("name_required"),
  EmailId: yup.string().email('email_invalid').required('email_required'),
  Contact: yup.number()
  .typeError("number_type")
  .positive("cant_start_minus")
  .integer("number_in_point")
  .min(8)
  .required('number_required'),
  Address:  yup.string().required("address_required"),
  Temple:yup.string().required("Temple_name_required"),
  documents:yup.string().required("doc_required"),
});



export default function AddProfile() {
  const trustDetail = useSelector((sate)=>sate.auth.trustDetail)
  const userDetail = useSelector((state)=>state.auth.userDetail) 
  const history = useHistory();
  const langArray = useSelector(state=>state.auth.availableLang)

  const initialValues={
    Id:userDetail?.id??"",
    name: userDetail?.name??"",
    EmailId: userDetail?.email??"",
    Contact: userDetail?.mobileNumber??"",
    Address:  trustDetail?.address??"",
    Temple:trustDetail?.name??"",
    Type: trustDetail?.type??"",
    documents:trustDetail?.trustDocumnent??"",
  }  
  return (
    <ProfileWarper>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/")}
          />
          <div className="addProfile">
            <Trans i18nKey={"userProfile"} />
          </div>
        </div>
        <div className="addProfile">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div>
        
      </div>
        <ProfileForm 
            handleSubmit={handleCreateNews} 
            initialValues={initialValues} 
            vailidationSchema={schema}
            buttonLabel={"update_profile"}
        />
    </ProfileWarper>
  );
}
