import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForDonation from "./FormWithoutFormikForDonation";

const FormWrapper = styled.div`
  .FormikWrapper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addDonation-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .donationContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
  }
  .btn-secondary {
    background-color: #fff7e8 !important;
    color: #583703 !important ;
    border: none;
    font: normal normal bold 20px/20px noto sans !important ;
    box-shadow: none !important ;
    :hover {
      color: #fff !important;
      background-color: #ff8744 !important;
    }
    .secondary.active {
      color: #fff !important;
    }
  }
  .addUser {
    font-size: 13px;
  }
  .addUser > span {
    text-decoration: underline;
    color: #ff8744;
  }
`;

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
    <FormWrapper className="FormikWrapper">
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
              articleUnit: e?.articleUnit?.id,
              articleQuantity: e?.articleQuantity,
              articleRemarks: e?.remarks,
              isArticle: toggleState,
              isGovernment:
                !payDonation && e?.isGovernment === "YES" ? true : false,
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
    </FormWrapper>
  );
}
