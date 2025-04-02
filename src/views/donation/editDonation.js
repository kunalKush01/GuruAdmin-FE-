import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getDonationCustomFields } from "../../api/customFieldsApi";
import { createDonation, updateDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/viewCommon.scss";
import DonationForm from "../../components/donation/donationForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";
import { Tag } from "antd";
import { updateSuspense } from "../../api/suspenseApi";
export default function EditDonation() {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const { record, isEdit } = location.state || {};
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const remark = searchParams.get("remark");
  const amount = searchParams.get("amount");
  const donorMapped = searchParams.get("donorMapped");
  const modeOfPayment = searchParams.get("modeOfPayment");
  const dateTime = searchParams.get("dateTime");
  const sId = searchParams.get("sId");
  console.log(sId);
  const handleCreateDonation = async (payload) => {
    try {
      console.log("Updating Donation with:", payload);

      // First, update the donation
      await updateDonation(payload);

      if (sId) {
        const suspensePayload = {
          donorMapped: true,
          transactionDate: dateTime,
          bankNarration: remark,
          amount: amount,
          modeOfPayment: modeOfPayment,
        };

        console.log("Updating Suspense with:", suspensePayload);
        await updateSuspense({ id: sId, updatedData: suspensePayload });
      }

      console.log("Donation and Suspense updated successfully!");
    } catch (error) {
      console.error("Error updating donation or suspense:", error);
    }
  };
  const customFieldsQuery = useQuery(
    ["custom-fields"],
    async () => await getDonationCustomFields(),
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
    Amount: Yup.string()
      .matches(/^(0|[1-9]\d*)(\.\d+)?$/, "invalid_amount") // Allows 0, positive integers, and positive decimals
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
  const initialValues = {
    Mobile: "",
    countryCode: "in",
    dialCode: "91",
    SelectedUser: record ? record.user || "" : "",
    donarName: record ? record.donarName || "" : "",
    SelectedMasterCategory:
      record && record?.masterCategory
        ? {
            name: record.masterCategory.name || "",
            id: record.masterCategory.id || "", // Ensure `id` is set
          }
        : "",

    SelectedSubCategory:
      record && record?.category
        ? {
            name: record.category.name || "",
            id: record.category.id || "",
          }
        : "",

    SelectedCommitmentId: "",

    Amount: amount || "",
    isGovernment: "NO",
    createdBy: ConverFirstLatterToCapital(loggedInUser),
    modeOfPayment: {
      value: "online",
      label: t("online"),
    },
    bankName: "",
    chequeNum: "",
    chequeDate: "",
    chequeStatus: "",
    bankNarration: "",
    donationRemarks: remark || "",
    customFields: customFieldsList.reduce((acc, field) => {
      acc[field.fieldName] = "";
      return acc;
    }, {}),
    paymentScreenShot: record ? record.paymentScreenShot || "" : null,
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
            <Trans i18nKey={"donation_Editdonation"} />
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
      <div className="mt-1">
        <DonationForm
          handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          validationSchema={schema}
          showTimeInput
          buttonName={"donation_Editdonation"}
          customFieldsList={customFieldsList}
          donorMapped={donorMapped}
          sId={sId}
          isEdit={isEdit}
          donationId={record ? record._id : ""}
        />
      </div>
    </div>
  );
}
