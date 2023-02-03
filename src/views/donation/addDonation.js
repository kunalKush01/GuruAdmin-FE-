import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import * as yup from "yup";
import { createDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationForm from "../../components/donation/donationForm";

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

const handleCreateDonation = async (payload) => {
  return createDonation(payload);
};
const schema = yup.object().shape({
  Mobile: yup.string().required("expenses_mobile_required").min(10).max(10),
  SelectedUser: yup.mixed().required("user_select_required"),
  donarName: yup.string().matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      'donation_donar_name_only_letters'
  ),
  SelectedMasterCategory: yup.object().required("masterCategory_required"),
  // SelectedSubCategory: yup.object().required("subCategory_required"),
  // SelectedCommitmentId:yup.object().required("commitmentID_required"),
  Amount: yup.number().required("amount_required"),
});

export default function AddNews() {
  const history = useHistory();

  // useEffect(() => {
    
  
  //   return () => {
      
  //     console.log("rj moving to another page")
  //     Swal.fire({
  //       title: `<img src="${""}"/>`,
  //       html: `
  //                               <h3 class="swal-heading">news_delete</h3>
  //                               <p></p>news_sure</p>
  //                               `,
  //       showCloseButton: false,
  //       showCancelButton: true,
  //       focusConfirm: true,
  //       cancelButtonText: `cancel`,
  //       cancelButtonAriaLabel:"cancel",

  //       confirmButtonText: `Confirm`,
  //       confirmButtonAriaLabel: "Confirm",
        
        
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //        history.push("/")
  //       }else if(result.isDismissed){
  //         history.push("/donation/add")
  //       }

  //     });
  //   }
  // }, [])
  // console.log("rj history",history.location.pathname );
  


  const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);
  const initialValues = {
    Mobile: "",
    SelectedUser: "",
    donarName: "",
    SelectedMasterCategory: "",
    SelectedSubCategory: "",
    SelectedCommitmentId: "",
    Amount: "",
    createdBy: loggedInUser,
  };
  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/donation")}
          />
          <div className="addNews">
            <Trans i18nKey={"donation_Adddonation"} />
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
        <DonationForm
          handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="donation_Adddonation"
        />
      </div>
    </NewsWarper>
  );
}
