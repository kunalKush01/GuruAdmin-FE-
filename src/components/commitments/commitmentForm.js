import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { flatMap } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForCommitment from "./FormWithoutFormikforCommitment";
import "../../assets/scss/common.scss";

export default function CommitmentForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  disableOnEdit,
  validationSchema,
  initialValues,
  getCommitmentMobile,
}) {
  const history = useHistory();
  const commitmentQueryClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
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
    <div className="formwraper FormikWrapper">
      {!masterloadOptionQuery.isLoading && (
        <Formik
          initialValues={{
            ...initialValues,
          }}
          onSubmit={(e) => {
            setShowPrompt(false);
            setLoading(true);
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
              />
            </>
          )}
        </Formik>
      )}
    </div>
  );
}
