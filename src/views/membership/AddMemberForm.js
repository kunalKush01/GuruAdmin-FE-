import React from "react";
import { Trans } from "react-i18next";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/viewCommon.scss";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";
import AddForm from "../../components/membership/AddForm";
import { createMember } from "../../api/membershipApi";
export default function AddMemberForm() {
  const history = useHistory();
  const handleCreateDonation = async (payload) => {
    // console.log("payload :",payload)
    return createMember(payload);
  };
  const initialValues = {
    //** Address Information */
    searchType: "",
    addLine1: "",
    addLine2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
    pin: "",

    //** Corresponding Address Information */
    correspondencePincode: "",
    correspondenceSearchType: "",
    correspondenceAddLine1: "",
    correspondenceAddLine2: "",
    correspondenceCity: "",
    correspondenceDistrict: "",
    correspondenceState: "",
    correspondenceCountry: "",
    correspondencePin: "",
  };
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/membership")}
          />
          <div className="addAction">
            <Trans i18nKey={"add_memberShip_member"} />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <AddForm
          handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          // validationSchema={schema}
        />
      </div>
    </div>
  );
}
