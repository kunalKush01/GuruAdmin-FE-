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
export default function AddMemberForm() {
  const history = useHistory();

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
  const initialValues = {
    //** Personal Information */
    mobileNumber: "",
    memberName: "",
    aliasName: "",
    inMemoryName: "",
    gender: "",
    maritalStatus: "",
    anniversary: "",
    dateOfBirth: "",

    //** Member Ship Information */
    membership: "",
    branch: "",
    memberNumber: "",
    oldNumber: "",
    membershipType: "",
    dateOfEntry: "", //todo where it isuse?
    dateOfJoining: "",

    //** Contact Information */
    alternativePhone: "",
    email: "",
    phone: "",
    whatsappNumber: "",

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

    //** Other Information */
    occupation: "",
    panNumber: "",
    remark: "",

    //** Upload Information  */
    memberPhoto: "",
    parentPhoto: "",
    anotherPhoto: "",
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
          //   handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          validationSchema={schema}
        />
      </div>
    </div>
  );
}
