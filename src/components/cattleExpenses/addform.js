import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Storage } from "aws-amplify";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";

import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import {
  findAllExpenseName,
  findAllItemId,
} from "../../api/cattle/cattleExpense";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import '../../../src/styles/common.scss';

;
;

const AddExpenseForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const uploadInvoice = useRef();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadOption = async (itemId) => {
    const res = await findAllItemId({ itemId: itemId });
    return res.results;
  };
  const nameLoadOption = async (name) => {
    const res = await findAllExpenseName({ name: name });
    return res.results;
  };
  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const handleUpload = (acceptedFiles, uploadType) => {
    setIsUploading(true);
    Storage.put(
      `temp/${randomNumber}_${acceptedFiles?.name.split(" ").join("-")}`,
      acceptedFiles,
      {
        contentType: acceptedFiles?.type,
      }
    )
      .then((res) => {
        setIsUploading(false);
        const uploadedDocumentName = res.key.split("temp/")[1];
        setFiles(uploadedDocumentName);
      })
      .catch((err) => console.log(err));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["cattleMedicalList"]);
        setLoading(false);
        history.push("/cattle/medical-info");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  return (
    <div className="formikwrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          mutation.mutate({
            purpose: values?.purpose?.value,
            itemId: values?.itemId,
            name: values?.name,
            unit: values?.unit?.value,
            unitType: values?.unitType?.value,
            bill_invoice: values?.bill_invoice,
            quantity: values?.quantity,
            amount: values?.amount,
            date: values?.Date,
          });
        }}
      >
        {(formik) => (
          <Form>
            {showPrompt && (
              <Prompt
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )}

            <Row className="paddingForm">
              <Col xs={12} md={10}>
                <Row>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="purpose"
                      loadOptions={[
                        {
                          label: "Buying Consumable",
                          value: "BUYING_CONSUMABLE",
                        },
                        {
                          label: "Assets",
                          value: "ASSETS",
                        },
                        {
                          label: "General",
                          value: "GENERAL",
                        },
                      ]}
                      labelName={t("cattle_purpose")}
                      placeholder={t("placeHolder_cattle_purpose")}
                      required
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="itemId"
                      labelKey="itemId"
                      valueKey="itemId"
                      loadOptions={loadOption}
                      label={t("cattle_itemId")}
                      onChange={(e) => {
                        formik.setFieldValue("itemId", e);
                        formik.setFieldValue("name", e);
                      }}
                      placeholder={t("placeHolder_cattle_itemId")}
                      defaultOptions
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="name"
                      labelKey="name"
                      valueKey="name"
                      loadOptions={nameLoadOption}
                      label={t("name")}
                      onChange={(e) => {
                        formik.setFieldValue("name", e);
                        formik.setFieldValue("itemId", e);
                      }}
                      placeholder={t("placeHolder_cattle_item_name")}
                      defaultOptions
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="unit"
                      loadOptions={[
                        {
                          label: "Kilograms (KGs)",
                          value: "KG",
                        },
                        {
                          label: "Liters (Ltrs)",
                          value: "ltrs",
                        },
                        {
                          label: "Unit",
                          value: "UNIT",
                        },
                      ]}
                      labelName={t("cattle_unit")}
                      placeholder={t("placeHolder_cattle_unit")}
                      required
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="unitType"
                      loadOptions={[
                        {
                          label: "Consumable",
                          value: "CONSUMABLE",
                        },
                        {
                          label: "Assets",
                          value: "ASSETS",
                        },
                      ]}
                      labelName={t("cattle_expense_unitType")}
                      placeholder={t("placeHolder_cattle_expense_unitType")}
                      required
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <div>
                      <label>
                        <Trans i18nKey={"cattle_expense_bill_invoice"} />
                      </label>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        ref={uploadInvoice}
                        type={"file"}
                        name="bill_invoice"
                        accept=".pdf"
                        onChange={(e) => {
                          if (e.target.files?.length) {
                            handleUpload(e.target.files[0]);
                            // handleUpload(e.target.files[0]).then((e)=>formik.setFieldValue('documents',e.target.files[0].name));
                            formik.setFieldValue(
                              "bill_invoice",
                              `${randomNumber}_${e.target?.files[0]?.name
                                .split(" ")
                                .join("-")}`
                            );
                          }
                        }}
                      />
                      {isUploading ? (
                        <Spinner color="primary" size="sm" />
                      ) : (
                        <Button
                          color="primary"
                          onClick={() => uploadInvoice.current.click()}
                        >
                          <Trans i18nKey="cattle_expense_bill_invoice_upload" />
                        </Button>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_expense_quantity")}
                      type="number"
                      placeholder={t("placeHolder_cattle_expense_quantity")}
                      name="quantity"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dashboard_Recent_DonorAmount")}
                      type="number"
                      placeholder={t("categories_select_amount")}
                      name="amount"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={3}>
                <FormikCustomDatePicker
                  label={t("expenses_Date")}
                  name="Date"
                />
              </Col>
            </Row>

            <div className="btn-Published mt-3">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="d-flex align-items-center m-auto "
                  type="submit"
                >
                  {!props.plusIconDisable && (
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                  )}
                  <span>
                    <Trans i18nKey={`${buttonName}`} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddExpenseForm;
