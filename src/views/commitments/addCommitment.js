import moment from "moment";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { createCommitment } from "../../api/commitmentApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import CommitmentForm from "../../components/commitments/commitmentForm";
import { useQuery } from "@tanstack/react-query";
import { getPledgeCustomFields } from "../../api/customFieldsApi";
import "../../../src/assets/scss/common.scss";
import { Tag } from "antd";

export default function AddCommitment() {
  const handleCreateCommitment = async (payload) => {
    return createCommitment(payload);
  };
  const customFieldsQuery = useQuery(
    ["custom-fields"],
    async () => await getPledgeCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const customFieldsList = customFieldsQuery?.data?.customFields ?? [];
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
    SelectedSubCategory: Yup.mixed(),
    Amount: Yup.string()
      .matches(/^[1-9][0-9]*$/, "invalid_amount")
      .required("amount_required"),
    customFields: Yup.object().shape(
      customFieldsList.reduce((acc, field) => {
        if (field.isRequired) {
          acc[field.fieldName] = Yup.mixed().required(
            `${field.fieldName} is required`
          );
        }
        return acc;
      }, {})
    ),
  });

  const navigate = useNavigate();
  // const langArray = useSelector((state) => state.auth.availableLang);
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentStatus = searchParams.get("status");

  const initialValues = {
    Mobile: "",
    countryCode: "in",
    dialCode: "91",
    SelectedUser: "",
    donarName: "",
    SelectedMasterCategory: "",
    SelectedSubCategory: "",
    createdBy: loggedInUser,
    Amount: "",
    startDate: moment().startOf("day"),
    endDate: moment().add(1, "year").startOf("day"),
    customFields: customFieldsList.reduce((acc, field) => {
      acc[field.fieldName] = "";
      return acc;
    }, {}),
  };
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              navigate(
                `/commitment?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
              )
            }
          />
          <div className="addCommitment">
            <Trans i18nKey={"add_commitment"} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: "15px", marginBottom: "0" }}>Current User :</p>
          <Tag
            color="#ff8744"
            style={{
              marginLeft: "8px",
              borderRadius: "5px",
              backgroundColor: "#ff8744",
              color: "white",
            }}
          >
            {loggedInUser}
          </Tag>
        </div>
      </div>
      <div className="mt-1 mb-3">
        <CommitmentForm
          handleSubmit={handleCreateCommitment}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName="add_commitment"
          customFieldsList={customFieldsList}
        />
      </div>
    </div>
  );
}
