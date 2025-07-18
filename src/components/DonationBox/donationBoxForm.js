import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { flatMap } from "lodash";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Col, Row, Spinner } from "reactstrap";
import { getAllBoxCollectionLogs } from "../../api/donationBoxCollectionApi";
import { TextArea } from "../partials/CustomTextArea";
import CustomTextField from "../partials/customTextField";
import LogListTable from "./logListTable";
import "../../assets/scss/common.scss";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { DatePicker } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import moment from "moment";
const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export default function DonationBoxForm({
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  validationSchema,
  collectionId,
  editLogs,
  initialValues,
  showTimeInput,
  customFieldsList,
  flattenedAccounts,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const newsMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        newsQuerClient.invalidateQueries(["Collections"]);
        newsQuerClient.invalidateQueries(["BoxCollectionDetail"]);
        setLoading(false);
        navigate("/hundi");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const hundiLogQuery = useQuery(
    ["hundiLogs"],
    () =>
      getAllBoxCollectionLogs({
        // ...pagination,
        collectionId: collectionId,
        // search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const hundiLogs = useMemo(
    () => hundiLogQuery?.data?.results ?? [],
    [hundiLogQuery]
  );
  const [showPrompt, setShowPrompt] = useState(true);
  const trustId = localStorage.getItem("trustId");
  //**get account options */
  const filteredAccountOptions = useMemo(() => {
    return flattenedAccounts.filter((acc) => {
      return acc.type === "asset" && acc.subType === "petty_cash";
    });
  }, [flattenedAccounts]);

  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
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
              value: field.value !== undefined ? field.value : field,
            })
          );
          newsMutation.mutate({
            collectionId: e?.Id,
            amount: e?.Amount,
            remarks: e?.Body,
            collectionDate: e?.DateTime,
            accountId: e?.accountId?.value,
            customFields: transformedCustomFields,
          });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form>
            {/* {showPrompt && (
              <
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )} */}
            <div className="paddingForm">
              <Row>
                <Col xs={12} md={12}>
                  <Row>
                    <Col xs={12}>
                      <TextArea
                        rows="4"
                        label={t("news_label_Description")}
                        name="Body"
                        autoFocus
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={4} lg={4} className="">
                      <CustomTextField
                        type="number"
                        label={t("categories_select_amount")}
                        placeholder={t("enter_price_manually")}
                        required
                        name="Amount"
                      />
                    </Col>
                    <Col xs={12} md={4} lg={4} className="opacity-75">
                      <CustomTextField
                        label={t("added_by")}
                        name="CreatedBy"
                        disabled
                      />
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                      {/* <FormikCustomDatePicker
                        label={t("donation_select_date")}
                        futureDateNotAllowed
                        name="DateTime"
                      /> */}
                      <label>{t("donation_select_date")}</label>
                      <CustomDatePicker
                        id="datePickerANTD"
                        format="DD MMM YYYY"
                        placeholder={t("select_date")}
                        // needConfirm
                        onChange={(date) =>
                          formik.setFieldValue(
                            "DateTime",
                            date ? date.format("YYYY-MM-DD") : null
                          )
                        }
                        value={
                          formik.values.DateTime
                            ? moment(formik.values.DateTime)
                            : null
                        }
                      />
                    </Col>
                    <Col xs={12} sm={4} lg={4}>
                      <FormikCustomReactSelect
                        labelName={t("Account")}
                        name="accountId"
                        loadOptions={filteredAccountOptions}
                        width
                        required
                      />
                    </Col>
                    {customFieldsList.map((field) => {
                      const isSelectField =
                        field.masterValues && field.masterValues.length > 0;

                      return (
                        <Col
                          xs={12}
                          sm={6}
                          lg={4}
                          md={4}
                          className="pb-1"
                          key={field._id}
                        >
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
                                value={
                                  formik.values.customFields &&
                                  formik.values.customFields[field.fieldName]
                                    ? moment(
                                        formik.values.customFields[
                                          field.fieldName
                                        ],
                                        "DD MMM YYYY"
                                      ) // Parse the date string back to moment object
                                    : null
                                }
                                // needConfirm
                              />
                              {formik.errors.customFields &&
                                formik.errors.customFields[field.fieldName] && (
                                  <div>
                                    <div className="text-danger">
                                      <Trans
                                        i18nKey={
                                          formik.errors.customFields[
                                            field.fieldName
                                          ]
                                        }
                                      />
                                    </div>
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
                </Col>
              </Row>
              {editLogs && (
                <Row>
                  <div>
                    <Trans i18nKey={"Logs"} />
                  </div>
                  <Col lg={12} className="my-lg-2">
                    <LogListTable data={hundiLogs} />
                  </Col>
                </Row>
              )}
            </div>
            <div className="d-flex justify-content-center mt-lg">
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
        )}
      </Formik>
    </div>
  );
}
