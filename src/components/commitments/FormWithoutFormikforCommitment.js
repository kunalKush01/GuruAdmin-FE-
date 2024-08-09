import { Form } from "formik";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import { Button, Col, Row, Spinner } from "reactstrap";
import { getAllSubCategories } from "../../api/expenseApi";
import { findAllUsersByName, findAllUsersByNumber } from "../../api/findUser";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { DatePicker } from "antd";
import "../../../src/assets/scss/common.scss";
import "../../../src/assets/scss/variables/_variables.scss";

import moment from "moment";
import momentGenerateConfig from "rc-picker/lib/generate/moment";

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export default function FormWithoutFormikForCommitment({
  formik,
  masterloadOptionQuery,
  buttonName,
  showTimeInput,
  editCommitment,
  loading,
  countryFlag,
  getCommitmentMobile,
  showPrompt,
  customFieldsList,
  paidAmount,
  ...props
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const { SelectedMasterCategory } = formik.values;
  const [subLoadOption, setSubLoadOption] = useState([]);
  const [noUserFound, setNoUserFound] = useState(false);

  const loadOption = async (name) => {
    const res = await findAllUsersByName({ name: name });
    return res.results;
  };

  useEffect(() => {
    const res = async () => {
      const apiRes = await getAllSubCategories({
        masterId: SelectedMasterCategory?.id,
      });
      setSubLoadOption(apiRes?.results);
    };

    SelectedMasterCategory && res();
  }, [SelectedMasterCategory]);

  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile);

  useUpdateEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user?.id) {
      formik.setFieldValue("Mobile", user.mobileNumber);
      formik.setFieldValue("countryCode", user?.countryName);
      formik.setFieldValue("dialCode", user?.countryCode);
      formik.setFieldValue("donarName", user?.name);
      setPhoneNumber(user?.countryCode + user?.mobileNumber);
      return;
    }
    formik.setFieldValue("Mobile", "");
    formik.setFieldValue("countryCode", "");
    formik.setFieldValue("dialCode", "");
    formik.setFieldValue("donarName", "");
  }, [formik?.values?.SelectedUser]);

  useUpdateEffect(() => {
    if (formik?.values?.Mobile?.toString().length == 10) {
      const results = async () => {
        const res = await findAllUsersByNumber({
          mobileNumber: formik?.values?.Mobile.toString(),
        });
        if (res.result) {
          formik.setFieldValue("SelectedUser", res.result);
        } else {
          setNoUserFound(true);
        }
      };
      results();
    } else if (formik?.values?.Mobile?.toString().length !== 10) {
      formik.setFieldValue("SelectedUser", "");
    } else {
      setNoUserFound(false);
    }
  }, [formik?.values?.Mobile]);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");

  return (
    <div className="formwrapper FormikWrapper">
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
          <Col xs={12} sm={6} lg={4}>
            <CustomCountryMobileNumberField
              value={phoneNumber}
              label={t("dashboard_Recent_DonorNumber")}
              defaultCountry={countryFlag}
              placeholder={t("placeHolder_mobile_number")}
              onChange={(phone, country) => {
                setPhoneNumber(phone);
                formik.setFieldValue("countryCode", country?.countryCode);
                formik.setFieldValue("dialCode", country?.dialCode);
                formik.setFieldValue(
                  "Mobile",
                  phone?.replace(country?.dialCode, "")
                );
              }}
              required
            />
            {formik.errors.Mobile && (
              <div>
                {formik.errors.Mobile && (
                  <div className="text-danger">
                    <Trans i18nKey={formik.errors.Mobile} />
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col xs={12} sm={6} lg={4} className=" pb-1">
            <AsyncSelectField
              name="SelectedUser"
              loadOptions={loadOption}
              labelKey={"name"}
              valueKey={"id"}
              label={t("commitment_Username")}
              placeholder={t("categories_select_user_name")}
              defaultOptions
              required
              disabled
            />
            {noUserFound && (
              <div className="addUser">
                {" "}
                <Trans i18nKey={"add_user_donation"} />{" "}
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/add-user?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}&redirect=commitment`
                    )
                  }
                >
                  <Trans i18nKey={"add_user"} />
                </span>
              </div>
            )}
          </Col>
          {!editCommitment && (
            <Col xs={12} lg={2} sm={6}>
              <label>{t("commitment_select_start_date")}</label>
              <CustomDatePicker
                id="datePickerANTD"
                format="DD MMM YYYY"
                value={
                  formik.values.startDate
                    ? moment(formik.values.startDate, "DD MMM YYYY")
                    : null
                }
                onChange={(date) => {
                  if (date) {
                    const formattedStartDate = date.format("DD MMM YYYY");
                    formik.setFieldValue("startDate", formattedStartDate);
                    const newEndDate = moment(formattedStartDate).add(
                      1,
                      "year"
                    );
                    formik.setFieldValue(
                      "endDate",
                      newEndDate.format("DD MMM YYYY")
                    );
                  }
                }}
              />
            </Col>
          )}
          <Col xs={12} lg={!editCommitment ? 2 : 4} sm={6}>
            <label>{t("commitment_select_end_date")}</label>
            <CustomDatePicker
              id="datePickerANTD"
              format="DD MMM YYYY"
              disabledDate={(currentDate) => {
                return (
                  formik.values.startDate &&
                  currentDate.isBefore(formik.values.startDate, "day")
                );
              }}
              onChange={(date) => {
                formik.setFieldValue(
                  "endDate",
                  date ? date.format("DD MMM YYYY") : null
                );
              }}
              value={
                formik.values.endDate
                  ? moment(formik.values.endDate, "DD MMM YYYY")
                  : null
              }
              pastDateNotAllowed
            />
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <FormikCustomReactSelect
              labelName={t("categories_select_category")}
              name={"SelectedMasterCategory"}
              disabled={editCommitment}
              labelKey={"name"}
              valueKey={"id"}
              loadOptions={
                masterloadOptionQuery?.data?.results &&
                masterloadOptionQuery?.data?.results.map((item) => {
                  return {
                    ...item,
                    name: ConverFirstLatterToCapital(item.name),
                  };
                })
              }
              width={"100"}
              required
            />
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <FormikCustomReactSelect
              labelName={t("category_select_sub_category")}
              loadOptions={subLoadOption.map((cate) => {
                return {
                  ...cate,
                  name: ConverFirstLatterToCapital(cate.name),
                };
              })}
              name={"SelectedSubCategory"}
              labelKey={"name"}
              disabled={editCommitment}
              labelValue={"id"}
              width
            />
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <CustomTextField
              label={t("dashboard_Recent_DonorName")}
              name="donarName"
              placeholder={t("placeHolder_donar_name")}
            />
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <CustomTextField
              type="number"
              label={t("categories_select_amount")}
              placeholder={t("enter_price_manually")}
              name="Amount"
              required
              min={paidAmount}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            className="opacity-75"
            style={{ display: "none" }}
          >
            <CustomTextField
              label={t("created_by")}
              name="createdBy"
              disabled
            />
          </Col>
          {customFieldsList.map((field) => {
            const isSelectField =
              field.masterValues && field.masterValues.length > 0;

            return (
              <Col xs={12} sm={6} lg={4} key={field._id}>
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
                              formik.values.customFields[field.fieldName])
                          : null
                      }
                    />
                    {formik.errors.customFields &&
                      formik.errors.customFields[field.fieldName] && (
                        <div className="text-danger">
                          <Trans
                            i18nKey={
                              formik.errors.customFields[field.fieldName]
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
        <div className="btn-Published ">
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
            <Button color="primary" type="submit">
              <span>
                <Trans i18nKey={buttonName} />
              </span>
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
