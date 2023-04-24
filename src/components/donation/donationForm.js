import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  getAllMasterCategories
} from "../../api/expenseApi";
import FormWithoutFormikForDonation from "./FormWithoutFormikForDonation";

const FormWaraper = styled.div`
  .FormikWraper {
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
  .addUser{
    font-size: 13px;
  }
  .addUser >span{
    text-decoration: underline;
    color: #ff8744;
  }
`;

export default function DonationForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const donationQuerClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
const [loading, setLoading] = useState(false)
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
      if (!data.error) {
        donationQuerClient.invalidateQueries(["donations"]);
        setLoading(false)
        history.push("/donation");
      }else if(data?.error){
        setLoading(false)
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  return (
    <FormWaraper className="FormikWraper">
      {!masterloadOptionQuery.isLoading && (
        <Formik
          // enableReinitialize
          initialValues={{
            ...initialValues,
          }}
          onSubmit={(e) =>{
            setShowPrompt(false)
            setLoading(true)
            donationMutation.mutate({
              categoryId: e?.SelectedSubCategory?.id,
              amount: e?.Amount,
              masterCategoryId: e?.SelectedMasterCategory?.id,
              donarName:e?.donarName,
              mobileNumber: e?.Mobile.toString(),
              commitmentId:e?.SelectedCommitmentId?.commitmentId,
            })}
          }
          validationSchema={vailidationSchema}
        >
          {(formik) => (
            
            <FormWithoutFormikForDonation
              formik={formik}
              masterloadOptionQuery={masterloadOptionQuery}
              loading={loading}
              paidDonation={initialValues?.SelectedUser?.id}
              plusIconDisable
              showPrompt={showPrompt}
              buttonName={buttonName}
            />
          )}
        </Formik>
      )}
    </FormWaraper>
  );
}
