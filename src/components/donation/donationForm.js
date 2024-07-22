import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForDonation from "./FormWithoutFormikForDonation";
import "../../assets/scss/common.scss";

export default function DonationForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  payDonation,
  getCommitmentMobile,
  validationSchema,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const donationQueryClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [loading, setLoading] = useState(false);
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
        history.push("/donation");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [toggleState, setToggleState] = useState(false);

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
              articleUnit: e?.articleUnit?.id,
              articleQuantity: e?.articleQuantity,
              articleRemarks: e?.remarks,
              isArticle: toggleState,
              isGovernment:
                !payDonation && e?.isGovernment === "YES" ? true : false,
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
            />
          )}
        </Formik>
      )}
    </div>
  );
}
