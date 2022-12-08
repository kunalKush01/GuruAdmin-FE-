import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { createCommitment } from "../../api/commitmentApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import CommitmentForm from "../../components/commitments/commitmentForm";

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

const handleCreateCommitment = async (payload) => {
  return createCommitment(payload);
};
const schema = yup.object().shape({
  Mobile: yup.string().required("expenses_mobile_required"),
  // SelectedUser: yup.string().required("user_select_required"),
  // donarName: yup.string().required("donar_name_required"),
  SelectedMasterCategory: yup.object().required("masterCategory_required"),
  SelectedSubCategory: yup.object(),  
  Amount:yup.string().required("amount_required"),
  
});



export default function AddNews() {
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
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2"
            onClick={() => history.push("/commitment")}
          />
          <div className="addNews">
            <Trans i18nKey={"add_commitment"} />
          </div>
        </div>
      </div>
      <CommitmentForm
        handleSubmit={handleCreateCommitment}
        initialValues={initialValues}
        vailidationSchema={schema}
        showTimeInput
        buttonName="add_commitment"
      />
    </NewsWarper>
  );
}
