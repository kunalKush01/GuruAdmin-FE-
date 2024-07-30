import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useMemo, useRef, useState } from "react";
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

export default function ExpensesForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  expensesId,
  editLogs,
  validationSchema,
  initialValues,
  expenseTypeArr,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const uploadInvoice = useRef();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const expenseQueryClient = useQueryClient();

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
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
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
          });
        }}
        validationSchema={validationSchema}
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
            <div className="paddingForm">
              <Row>
                <Col xs={12} md={7}>
                  <Row>
                    <Col xs="12" md="6">
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
                    <Col xs={12} md={6}>
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
                    {(formik.values?.expenseType?.value === "assets" ||
                      formik.values?.expenseType?.value === "consumable") && (
                      <>
                        <Col xs={12} md={6}>
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
                        <Col xs={12} md={6}>
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
                        <Col xs={12} md={6}>
                          <CustomTextField
                            label={t("cattle_expense_order_quantity")}
                            type="number"
                            placeholder={t(
                              "placeHolder_cattle_expense_order_quantity"
                            )}
                            name="orderQuantity"
                            onBlur={() => {
                              if (formik.values?.perItemAmount) {
                                formik.setFieldValue(
                                  "Amount",
                                  formik.values?.orderQuantity *
                                    formik.values?.perItemAmount
                                );
                              }
                            }}
                            required
                            autoFocus
                            onInput={(e) =>
                              (e.target.value = e.target.value.slice(0, 30))
                            }
                          />
                        </Col>
                        <Col xs={12} md={6}>
                          <CustomTextField
                            type="number"
                            name="perItemAmount"
                            label={t("price_per_item")}
                            placeholder={t("placeHolder_price_per_item")}
                            onBlur={() => {
                              if (formik.values?.orderQuantity) {
                                formik.setFieldValue(
                                  "Amount",
                                  formik.values?.orderQuantity *
                                    formik.values?.perItemAmount
                                );
                              }
                            }}
                            required
                          />
                        </Col>
                      </>
                    )}
                    <Col
                      xs={12}
                      md={6}
                      className={
                        (formik.values?.expenseType?.value === "assets" ||
                          formik.values?.expenseType?.value === "consumable") &&
                        "opacity-75"
                      }
                    >
                      <CustomTextField
                        type="number"
                        label={t("amount")}
                        placeholder={t("enter_price_manually")}
                        name="Amount"
                        disabled={
                          formik.values?.expenseType?.value === "assets" ||
                          formik.values?.expenseType?.value === "consumable"
                        }
                        required
                      />
                    </Col>
                    {(formik.values?.expenseType?.value === "assets" ||
                      formik.values?.expenseType?.value === "consumable") && (
                      <>
                        <Col xs={12} md={8}>
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
                  <Row className="">
                    <Col xs={12} md={6} className="opacity-75">
                      <CustomTextField
                        label={t("added_by")}
                        name="AddedBy"
                        disabled
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col xs={12}>
                      <FormikCustomDatePicker
                        label={t("donation_select_date")}
                        name="DateTime"
                        pastDateNotAllowed
                        // showTimeInput={showTimeInput}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {editLogs && (
                <Row>
                  <div>
                    <Trans i18nKey={"Logs"} />
                  </div>
                  <Col lg={9} className="my-lg-2">
                    <LogListTable data={expenseLog} />
                  </Col>
                </Row>
              )}
            </div>

            <div className="btn-Published mb-2 mt-lg-2">
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
        )}
      </Formik>
    </div>
  );
}
