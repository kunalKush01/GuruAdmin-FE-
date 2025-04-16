import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { getAllExpensesLogs } from "../../api/expenseApi";
import LogListTable from "../DonationBox/logListTable";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import RichTextField from "../partials/richTextEditorField";
import AsyncSelectField from "../partials/asyncSelectField";
import {
  findAllExpenseName,
  findAllItemId,
} from "../../api/cattle/cattleExpense";
import { Storage } from "aws-amplify";
import "../../assets/scss/common.scss";
import { DatePicker } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import moment from "moment";
const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);
export default function ExpensesForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  expensesId,
  editLogs,
  validationSchema,
  initialValues,
  expenseTypeArr,
  customFieldsList,
  paymentModeArr,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const uploadInvoice = useRef();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const expenseQueryClient = useQueryClient();
  const trustId = localStorage.getItem("trustId");

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
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentExpenseType = searchParams.get("expenseType");
  const currentFilter = searchParams.get("filter");

  const expenseMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        expenseQueryClient.invalidateQueries(["Expenses"]);
        expenseQueryClient.invalidateQueries(["ExpensesDetail"]);
        setLoading(false);
        history.push(
          `/internal_expenses?page=${currentPage}&expenseType=${currentExpenseType}&filter=${currentFilter}`
        );
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const expenseLogQuery = useQuery(
    ["expenseLog"],
    () =>
      getAllExpensesLogs({
        // ...pagination,
        expenseId: expensesId,
      }),
    {
      keepPreviousData: true,
    }
  );

  const expenseLog = useMemo(
    () => expenseLogQuery?.data?.results ?? [],
    [expenseLogQuery]
  );
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        //enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          const transformedCustomFields = Object.entries(e?.customFields).map(
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
              value: field.value !== undefined ? field.value : field,
              paymentMode: e?.paymentMode?.value,
            })
          );
          expenseMutation.mutate({
            expenseId: e?.Id,
            title: e?.Title,
            expenseType: e?.expenseType?.value?.toUpperCase(),
            name: e?.name?.name,
            itemId: e?.itemId?._id,
            orderQuantity: e?.orderQuantity,
            pricePerItem: e?.perItemAmount,
            amount: e?.orderQuantity
              ? e?.perItemAmount * e?.orderQuantity
              : e?.Amount,
            billInvoice: e?.bill_invoice,
            description: e?.Body,
            expenseDate: e?.DateTime,
            paymentMode: e?.paymentMode?.value,
            customFields: transformedCustomFields,
          });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => {
          useEffect(() => {
            if (formik.values?.orderQuantity && formik.values?.perItemAmount) {
              const newAmount =
                Number(formik.values.orderQuantity) *
                Number(formik.values.perItemAmount);
              formik.setFieldValue("Amount", newAmount);
            }
            if (
              formik.values?.orderQuantity == "" ||
              formik.values?.perItemAmount == ""
            ) {
              {
                /* formik.setFieldValue("Amount", ""); */
              }
            }
          }, [formik.values.orderQuantity, formik.values.perItemAmount]);
          return (
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
              <div className="paddingForm">
                <Row>
                  <Col xs={12} md={6} lg={4}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      name="Title"
                      placeholder={t("placeHolder_title")}
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      autoFocus
                      required
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <FormikCustomReactSelect
                      labelName={t("dashboard_Recent_DonorType")}
                      name="expenseType"
                      loadOptions={expenseTypeArr}
                      placeholder={t("placeHolder_expense_type")}
                      required
                      disabled={editLogs}
                      width={"100"}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <label>
                      {t("donation_select_date")}
                      <span className="text-danger">*</span>
                    </label>
                    <CustomDatePickerComponent
                      format="DD MMM YYYY"
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = date.format("DD MMM YYYY");
                          formik.setFieldValue("DateTime", formattedDate);
                        } else {
                          formik.setFieldValue("DateTime", "");
                        }
                      }}
                      value={
                        formik.values["DateTime"]
                          ? moment(formik.values["DateTime"], "DD MMM YYYY")
                          : null
                      }
                      disabledDate={(current) =>
                        current < moment().startOf("day")
                      }
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <FormikCustomReactSelect
                      labelName={t("Payment_Mode")}
                      name="paymentMode"
                      loadOptions={paymentModeArr}
                      placeholder={t("Payment_Mode")}
                      required
                      width={"100"}
                    />
                  </Col>
                  {(formik.values?.expenseType?.value === "assets" ||
                    formik.values?.expenseType?.value === "consumable") && (
                    <>
                      <Col xs={12} md={6} lg={4}>
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
                          required={
                            formik.values?.expenseType?.value === "assets" ||
                            formik.values?.expenseType?.value === "consumable"
                          }
                        />
                      </Col>
                      <Col xs={12} md={6} lg={4}>
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
                          required={
                            formik.values?.expenseType?.value === "assets" ||
                            formik.values?.expenseType?.value === "consumable"
                          }
                        />
                      </Col>
                      <Col xs={12} md={6} lg={4}>
                        <CustomTextField
                          label={t("cattle_expense_order_quantity")}
                          type="number"
                          placeholder={t(
                            "placeHolder_cattle_expense_order_quantity"
                          )}
                          name="orderQuantity"
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          required={
                            formik.values?.expenseType?.value === "assets" ||
                            formik.values?.expenseType?.value === "consumable"
                          }
                        />
                      </Col>
                      <Col xs={12} md={6} lg={4}>
                        <CustomTextField
                          type="number"
                          name="perItemAmount"
                          label={t("price_per_item")}
                          placeholder={t("placeHolder_price_per_item")}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          required={
                            formik.values?.expenseType?.value === "assets" ||
                            formik.values?.expenseType?.value === "consumable"
                          }
                        />
                      </Col>
                    </>
                  )}
                  <Col xs={12} md={6} lg={4}>
                    <CustomTextField
                      type="number"
                      label={t("amount")}
                      placeholder={t("enter_price_manually")}
                      name="Amount"
                      value={formik.values.Amount || ""}
                      onChange={(e) => {
                        formik.setFieldValue("Amount", e.target.value);
                      }}
                      required
                      disabled={
                        formik.values?.expenseType?.value === "assets" ||
                        formik.values?.expenseType?.value === "consumable"
                      }
                    />
                  </Col>
                  {(formik.values?.expenseType?.value === "assets" ||
                    formik.values?.expenseType?.value === "consumable") && (
                    <>
                      <Col xs={12} md={6} lg={4}>
                        <div>
                          <label>
                            <Trans i18nKey={"cattle_expense_bill_invoice"} />
                          </label>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                          <input
                            ref={uploadInvoice}
                            type={"file"}
                            className="upload-invoice"
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
                    </>
                  )}
                  {customFieldsList &&
                    customFieldsList.map((field) => {
                      const isSelectField =
                        field.masterValues && field.masterValues.length > 0;

                      return (
                        <Col xs={12} md={6} lg={4} key={field._id}>
                          {field.fieldType === "Boolean" ? (
                            <FormikCustomReactSelect
                              labelName={field.fieldName}
                              name={`customFields.${field.fieldName}`}
                              loadOptions={[
                                { value: true, label: "True" },
                                { value: false, label: "False" },
                              ]}
                              required={field.isRequired}
                              width
                              placeholder={`Select ${field.fieldName}`}
                            />
                          ) : field.fieldType === "Date" ? (
                            <>
                              <label>
                                {field.fieldName}
                                {field.isRequired && "*"}
                              </label>
                              <CustomDatePicker
                                id="datePickerANTD"
                                format="DD MMM YYYY"
                                onChange={(date) => {
                                  if (date) {
                                    formik.setFieldValue(
                                      `customFields.${field.fieldName}`,
                                      date.format("DD MMM YYYY")
                                    );
                                  } else {
                                    formik.setFieldValue(
                                      `customFields.${field.fieldName}`,
                                      null
                                    );
                                  }
                                }}
                                // needConfirm
                              />
                              {formik.errors.customFields &&
                                formik.errors.customFields[field.fieldName] && (
                                  <div className="text-danger">
                                    <Trans
                                      i18nKey={
                                        formik.errors.customFields[
                                          field.fieldName
                                        ]
                                      }
                                    />
                                  </div>
                                )}
                            </>
                          ) : isSelectField ? (
                            <FormikCustomReactSelect
                              labelName={field.fieldName}
                              name={`customFields.${field.fieldName}`}
                              loadOptions={
                                field.masterValues &&
                                field.masterValues.map((item) => ({
                                  value: item.value,
                                  label: item.value,
                                }))
                              }
                              width
                              required={field.isRequired}
                              placeholder={`Select ${field.fieldName}`}
                              valueKey="value"
                              labelKey="label"
                            />
                          ) : (
                            <CustomTextField
                              label={field.fieldName}
                              name={`customFields.${field.fieldName}`}
                              type={
                                field.fieldType === "String"
                                  ? "text"
                                  : field.fieldType.toLowerCase()
                              }
                              required={field.isRequired}
                              placeholder={`Enter ${field.fieldName}`}
                            />
                          )}
                        </Col>
                      );
                    })}
                </Row>
                <Row>
                  <Col xs={12} className="mt-1">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="Body"
                    />
                  </Col>
                </Row>
                {editLogs && (
                  <Row>
                    <div className="commonSmallFont">
                      <Trans i18nKey={"Logs"} />
                    </div>
                    <Col lg={12} md={12} className="my-lg-2">
                      <LogListTable data={expenseLog} />
                    </Col>
                  </Row>
                )}
              </div>

              <div className="btn-Published mt-lg-2">
                {loading ? (
                  <Button color="primary" className="add-trust-btn" disabled>
                    <Spinner size="md" />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="addAction-btn "
                    type="submit"
                  >
                    {plusIconDisable && (
                      <span>
                        <Plus className="me-1" size={15} strokeWidth={4} />
                      </span>
                    )}
                    <span>
                      <Trans i18nKey={`${buttonName}`} />
                    </span>
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
