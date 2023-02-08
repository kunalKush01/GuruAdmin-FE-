import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createCommitment } from "../../api/commitmentApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import CommitmentForm from "../../components/commitments/commitmentForm";

const CommitmentWarapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addCommitment {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateCommitment = async (payload) => {
  return createCommitment(payload);
};
const schema = yup.object().shape({
  Mobile: yup.string().min(9 ,"Mobile Number must me 10 digits").required("expenses_mobile_required"),
  SelectedUser: yup.mixed().required("user_select_required"),
  donarName: yup.string().matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      'donation_donar_name_only_letters'
  ),
  SelectedMasterCategory: yup.mixed().required("masterCategory_required"),
  SelectedSubCategory: yup.mixed(),  
  Amount:yup.number().required("amount_required"),
  
});



export default function AddCommitment() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector(state=>state.auth.userDetail.name)
  const initialValues = {
    Mobile:"",
    SelectedUser: "",
    donarName: "",
    SelectedMasterCategory: "",
    SelectedSubCategory:"",
    createdBy:loggedInUser,
    Amount:"",
    DateTime:new Date()
  };
  return (
    <CommitmentWarapper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/commitment")}
          />
          <div className="addCommitment">
            <Trans i18nKey={"add_commitment"} />
          </div>
        </div>
      </div>
      <div className="ms-3 mt-1 mb-3">
        <CommitmentForm
          handleSubmit={handleCreateCommitment}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="add_commitment"
        />
      </div>
    </CommitmentWarapper>
  );
}
