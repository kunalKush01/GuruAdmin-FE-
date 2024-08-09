import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForCommitment from "./FormWithoutFormikforCommitment";
import "../../../src/assets/scss/common.scss";
export default function CommitmentForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  disableOnEdit,
  validationSchema,
  initialValues,
  getCommitmentMobile,
  customFieldsList,
  paidAmount,
}) {
  const history = useHistory();
  const commitmentQueryClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
  const trustId = localStorage.getItem("trustId");

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );

  const commitmentMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        commitmentQueryClient.invalidateQueries(["Commitments"]);
        commitmentQueryClient.invalidateQueries(["CommitmentDetail"]);
        setLoading(false);
        history.push("/commitment");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <div className="formwrapper FormikWrapper">
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
                  typeof field === "object" &&
                  field !== null &&
                  !Array.isArray(field)
                    ? "Select"
                    : typeof field.value === "boolean"
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
            commitmentMutation.mutate({
              donarName: e?.donarName,
              commitmentId: e.Id,
              categoryId: e?.SelectedSubCategory?.id,
              amount: e?.Amount,
              masterCategoryId: e?.SelectedMasterCategory?.id,
              mobileNumber: e?.Mobile.toString(),
              countryCode: e?.dialCode,
              countryName: e?.countryCode,
              commitmentStartDate: e?.startDate,
              commitmentEndDate: e.endDate,
              customFields: transformedCustomFields,
            });
          }}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <>
              <FormWithoutFormikForCommitment
                formik={formik}
                masterloadOptionQuery={masterloadOptionQuery}
                loading={loading}
                editCommitment={disableOnEdit}
                countryFlag={initialValues?.countryCode}
                plusIconDisable
                getCommitmentMobile={getCommitmentMobile}
                showPrompt={showPrompt}
                buttonName={buttonName}
                customFieldsList={customFieldsList}
                paidAmount={paidAmount}
              />
            </>
          )}
        </Formik>
      )}
    </div>
  );
}
