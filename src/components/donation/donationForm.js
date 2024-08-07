import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
}) {
  const history = useHistory();
  const donationQueryClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
  const trustId = localStorage.getItem("trustId");
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
        donationQueryClient.invalidateQueries(["donations"]);
        setLoading(false);
        const type = donation_type || "Donation";
        history.push(`/donation?type=${type}`);
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [toggleState, setToggleState] = useState(false);
  return (
    <div className="FormikWrapper">
      {!masterloadOptionQuery.isLoading && (
        <Formik
          initialValues={{
            ...initialValues,
          }}
          onSubmit={(e) => {
            setShowPrompt(false);
            setLoading(true);
            const transformedCustomFields = Object.entries(e.customFields).map(
              ([key, field]) => ({
                fieldName: key,
                fieldType:
                  typeof field.value === "boolean"
                    ? "Boolean"
                    : typeof field.value === "number"
                    ? "Number"
                    : typeof field.value === "string" &&
                      !isNaN(Date.parse(field.value))
                    ? "Date"
                    : "String", // Default to String for other types
                isRequired: false,
                value: field.value !== undefined ? field.value : field,
                trustId: trustId,
              })
            );
            donationMutation.mutate({
              categoryId: e?.SelectedSubCategory?.id,
              amount: e?.Amount,
              masterCategoryId: e?.SelectedMasterCategory?.id,
              donarName: e?.donarName,
              mobileNumber: e?.Mobile.toString(),
              countryCode: e?.dialCode,
              countryName: e?.countryCode,
              commitmentId: e?.SelectedCommitmentId?.commitmentId,
              articleType: e?.articleType,
              articleItem: e?.articleItem,
              articleWeight: e?.articleWeight,
              articleUnit: e?.articleUnit?.value,
              articleQuantity: e?.articleQuantity,
              articleRemark: e?.remarks,
              isArticle: donation_type == "Donation" ? false : true,
              isGovernment:
                !payDonation && e?.isGovernment === "YES" ? true : false,
              modeOfPayment: e?.modeOfPayment?.value,
              bankName: e?.bankName?.value,
              chequeNum: e?.chequeNum,
              chequeDate: e?.chequeDate,
              chequeStatus: e?.chequeStatus?.value,
              bankNarration: e?.bankNarration,
              donationRemarks: e?.donationRemarks,
              customFields: transformedCustomFields,
            });
          }}
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
            />
          )}
        </Formik>
      )}
    </div>
  );
}
