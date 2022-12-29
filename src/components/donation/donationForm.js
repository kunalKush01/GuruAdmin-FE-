import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, ButtonGroup, Col, Row } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import AsyncSelectField from "../partials/asyncSelectField";
import { findAllUsersByName } from "../../api/findUser";
import { useSelector } from "react-redux";
import {
  getAllMasterCategories,
  getAllSubCategories,
} from "../../api/expenseApi";
import { CustomReactSelect } from "../partials/customReactSelect";
import FormWithoutFormikForDonation from "./FormWithoutFormikForDonation";

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

export default function DonationForm({
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
        newsQuerClient.invalidateQueries(["donations"]);
        // newsQuerClient.invalidateQueries(["CollectionDetail"]);

        history.push("/donation");
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
              categoryId: e?.SelectedSubCategory?.id,
              amount: e?.Amount,
              masterCategoryId: e?.SelectedMasterCategory?.id,
              mobileNumber: e?.Mobile,
              commitmentId:e?.SelectedCommitmentId?.commitmentId,
            })
          }
          validationSchema={vailidationSchema}
        >
          {(formik) => (
            <FormWithoutFormikForDonation
              formik={formik}
              masterloadOptionQuery={masterloadOptionQuery}
              plusIconDisable
              buttonName={buttonName}
            />
          )}
        </Formik>
      )}
    </FormWaraper>
  );
}
