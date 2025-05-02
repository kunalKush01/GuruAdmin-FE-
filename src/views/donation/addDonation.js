import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getDonationCustomFields } from "../../api/customFieldsApi";
import { createDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/viewCommon.scss";
import DonationForm from "../../components/donation/donationForm";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import "../../assets/scss/viewCommon.scss";
import { Tag } from "antd";
import { getAllAccounts } from "../../api/profileApi";
export default function AddDonation() {
  const history = useHistory();
  const { t } = useTranslation();
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
  const handleCreateDonation = async (payload) => {
    return createDonation(payload);
  };
  const customFieldsQuery = useQuery(
    ["custom-fields"],
    async () => await getDonationCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const customFieldsList = customFieldsQuery?.data?.customFields ?? [];
  const { data } = useQuery(["Accounts"], () => getAllAccounts(), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching member data:", error);
    },
  });

  const accountsItem = useMemo(() => {
    return data?.result ?? [];
  }, [data]);
  const flattenedAccounts = accountsItem.map((item) => ({
    label: item.name,
    value: item.id,
    ...item,
  }));

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
    SelectedUser: "",
    donarName: "",
    SelectedMasterCategory: "",
    SelectedSubCategory: "",
    SelectedCommitmentId: "",
    Amount: amount || "",
    isGovernment: "NO",
    createdBy: ConverFirstLatterToCapital(loggedInUser),
    modeOfPayment: {
      value: modeOfPayment || "Cash",
      label:
        ((modeOfPayment == "online" || modeOfPayment == "") && t("online")) ||
        t("cash"),
    },
    accountId: "",
    bankName: "",
    chequeNum: "",
    chequeDate: "",
    chequeStatus: "",
    bankNarration: "",
    donationRemarks: remark || "",
    isCorpus: false,
    corpusPurpose: "",
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
              history.push(
                `/donation?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`
              )
            }
          />
          <div className="addAction">
            <Trans i18nKey={"donation_Adddonation"} />
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
          buttonName="donation_Adddonation"
          customFieldsList={customFieldsList}
          donorMapped={donorMapped}
          flattenedAccounts={flattenedAccounts}
          sId={sId}
        />
      </div>
    </div>
  );
}
