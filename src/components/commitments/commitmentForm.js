import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getAllMasterCategories } from "../../api/expenseApi";
import FormWithoutFormikForCommitment from "./FormWithoutFormikforCommitment";
const FormWaraper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
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
`;

export default function CommitmentForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
}) {
  const history = useHistory();
  const newsQuerClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );

  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      console.log("error=", data);
      if (!data.error) {
        newsQuerClient.invalidateQueries(["Commitments"]);
        newsQuerClient.invalidateQueries(["CommitmentDetail"]);

        history.push("/commitment");
      }
    },
  });

  return (
    <FormWaraper className="FormikWraper">
      {!masterloadOptionQuery.isLoading && (
          <Formik
            // enableReinitialize
            initialValues={{
              ...initialValues,
            }}
            onSubmit={(e) =>
              newsMutation.mutate({
                donarName:e?.donarName,
                commitmentId:e.Id,
                categoryId: e?.SelectedSubCategory?.id,
                amount: e?.Amount,
                masterCategoryId: e?.SelectedMasterCategory?.id,
                mobileNumber: e?.Mobile,
                commitmentEndDate: e.DateTime,
              })
            }
            validationSchema={vailidationSchema}
          >
            {(formik) => (
              <>
                <FormWithoutFormikForCommitment
                  formik={formik}
                  masterloadOptionQuery={masterloadOptionQuery}
                  plusIconDisable
                  buttonName={buttonName}
                />
              </>
            )}
          </Formik>
        )}
    </FormWaraper>
  );
}
