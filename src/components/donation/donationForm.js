import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllMasterCategories } from "../../api/expenseApi";
import "../../assets/scss/common.scss";
import FormWithoutFormikForDonation from "./FormWithoutFormikForDonation";

export default function DonationForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  payDonation,
  getCommitmentMobile,
  validationSchema,
  initialValues,
  showTimeInput,
  customFieldsList,
  sId,
  donorMapped,
  isEdit,
  donationId
}) {
  const history = useHistory();
  const donationQueryClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
  const [currentEtag, setCurrentEtag] = useState(null);
  const searchParams = new URLSearchParams(history.location.search);
  const donation_type = searchParams.get("type");

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );

  const donationMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        if (data?.etag) {
          setCurrentEtag(data.etag);
        }
        donationQueryClient.invalidateQueries(["donations"]);
        setLoading(false);
        const type = donation_type || "Donation";
        history.push(`/donation?type=${type}`);
        toast.success("Donation created successfully");
      } else if (data?.error || data === undefined) {
        setLoading(false);
        toast.error(data?.error || "Error creating donation");
      }
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error(
          "This donation has been modified by another user. Please refresh and try again."
        );
      } else {
        toast.error("Error creating donation. Please try again.");
      }
      setLoading(false);
    },
  });

  const [showPrompt, setShowPrompt] = useState(true);
  const [toggleState, setToggleState] = useState(false);

  const handleFormSubmit = (values) => {
    setShowPrompt(false);
    setLoading(true);

    const transformedCustomFields = Object.entries(values.customFields).map(
      ([key, field]) => ({
        fieldName: key,
        fieldType:
          typeof field === "object" && field !== null && !Array.isArray(field)
            ? "Select"
            : typeof field.value === "boolean"
            ? "Boolean"
            : typeof field.value === "number"
            ? "Number"
            : typeof field.value === "string" && !isNaN(Date.parse(field.value))
            ? "Date"
            : "String",
        value: field.value !== undefined ? field.value : field,
      })
    );

    const etag = values?.SelectedCommitmentId?.etag || currentEtag;

    // Construct the payload with etag
    const payload = {
      etag,
      categoryId: values?.SelectedSubCategory?.id,
      amount: values?.Amount,
      masterCategoryId: values?.SelectedMasterCategory?.id,
      donarName: values?.donarName,
      mobileNumber: values?.Mobile.toString(),
      countryCode: values?.dialCode,
      countryName: values?.countryCode,
      commitmentId: values?.SelectedCommitmentId?.commitmentId,
      etag: values?.SelectedCommitmentId?.etag || currentEtag,
      articleType: values?.articleType,
      articleItem: values?.articleItem,
      articleWeight: values?.articleWeight,
      articleUnit: values?.articleUnit?.value,
      articleQuantity: values?.articleQuantity,
      articleRemark: values?.remarks,
      isArticle: donation_type === "Donation" ? false : true,
      isGovernment:
        !payDonation && values?.isGovernment === "YES" ? true : false,
      modeOfPayment: values?.modeOfPayment?.value,
      bankName: values?.bankName?.value,
      chequeNum: values?.chequeNum,
      chequeDate: values?.chequeDate,
      chequeStatus: values?.chequeStatus?.value,
      bankNarration: values?.bankNarration,
      donationRemarks: values?.donationRemarks,
      customFields: transformedCustomFields,
      sId,
      donorMapped,
      paymentScreenShot: values?.paymentScreenShot,
      donationId: isEdit && donationId,
      paidStatus: isEdit && "Paid",
    };

    donationMutation.mutate(payload);
  };

  // Update etag when commitment is selected
  useEffect(() => {
    if (initialValues?.SelectedCommitmentId?.etag) {
      setCurrentEtag(initialValues.SelectedCommitmentId.etag);
    }
  }, [initialValues?.SelectedCommitmentId]);

  return (
    <div className="FormikWrapper">
      {!masterloadOptionQuery.isLoading && (
        <Formik
          initialValues={{
            ...initialValues,
          }}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <FormWithoutFormikForDonation
              formik={formik}
              masterloadOptionQuery={masterloadOptionQuery}
              loading={loading}
              article={toggleState}
              setArticle={setToggleState}
              countryFlag={initialValues?.countryCode}
              paidDonation={initialValues?.SelectedUser?.id}
              payDonation={payDonation}
              getCommitmentMobile={getCommitmentMobile}
              plusIconDisable
              showPrompt={showPrompt}
              buttonName={buttonName}
              customFieldsList={customFieldsList}
              currentEtag={currentEtag}
              isEdit={isEdit}
            />
          )}
        </Formik>
      )}
    </div>
  );
}
