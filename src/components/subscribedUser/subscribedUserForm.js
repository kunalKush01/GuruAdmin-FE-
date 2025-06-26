import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import "../../assets/scss/common.scss";

export default function SubscribedUserForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  validationSchema,
  initialValues,
  showTimeInput,
  getNumber,
  addDonationUser,
  buttonName = "",
  ...props
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const redirectTo = searchParams.get("redirect");
  const dialCodeFromUrl = searchParams.get("dialCode");
  const mobileNumberFromUrl = searchParams.get("mobileNumber");

  const categoryQueryClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        addDonationUser
          ? categoryQueryClient.invalidateQueries(["donations"])
          : categoryQueryClient.invalidateQueries(["subscribedUser"]);
        setLoading(false);
        addDonationUser
          ? navigate(
              `/${redirectTo}/add?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}}&dialCode=${encodeURIComponent(
                dialCode
              )}&mobileNumber=${encodeURIComponent(
                mobileNumber
              )}&name=${encodeURIComponent(name)}`
            )
          : navigate("/subscribed-user");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(getNumber ?? "");
  const [dialCode, setDialCode] = useState(dialCodeFromUrl || "");
  const [mobileNumber, setMobileNumber] = useState(mobileNumberFromUrl || "");
  const [name, setName] = useState("");

  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        // enableReinitialize
        initialValues={{
          ...initialValues,
          mobile: getNumber || initialValues.mobile,
        }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          categoryMutation.mutate({
            email: e.email,
            mobileNumber: e.mobile.toString(),
            countryCode: e?.dialCode,
            countryName: e?.countryCode,
            name: e.name,
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
            <Row className="paddingForm">
              <Col xs={12}>
                <Row>
                  <Col xs={12} sm={6} md={4}>
                    <CustomTextField
                      label={t("user_name")}
                      placeholder={t("placeHolder_user_name")}
                      name="name"
                      required
                      onInput={(e) => {
                        e.target.value = e.target.value.slice(0, 30);
                        setName(e.target.value);
                      }}
                      autoFocus
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4}>
                    <CustomCountryMobileNumberField
                      value={phoneNumber}
                      label={t("dashboard_Recent_DonorNumber")}
                      defaultCountry={initialValues?.countryCode ?? "IN"}
                      placeholder={t("placeHolder_mobile_number")}
                      onChange={(phone, country) => {
                        setPhoneNumber(phone);
                        setDialCode(country?.dialCode);
                        setMobileNumber(phone?.replace(country?.dialCode, ""));
                        formik.setFieldValue(
                          "countryCode",
                          country?.countryCode
                        );
                        formik.setFieldValue("dialCode", country?.dialCode);
                        formik.setFieldValue(
                          "mobile",
                          phone?.replace(country?.dialCode, "")
                        );
                      }}
                      required
                    />
                    {formik.errors.mobile && (
                      <div
                      // style={{
                      //   height: "20px",
                      //   font: "normal normal bold 11px/33px Noto Sans",
                      // }}
                      >
                        {formik.errors.mobile && (
                          <div className="text-danger">
                            <Trans i18nKey={formik.errors.mobile} />
                          </div>
                        )}
                      </div>
                    )}
                    {/* <CustomTextField
                      label={t("dashboard_Recent_DonorNumber")}
                      placeholder={t("placeHolder_mobile_number")}
                      name="mobile"
                      required
                      type="number"
                      pattern="[6789][0-9]{9}"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 12))
                      }
                    /> */}
                  </Col>
                  <Col xs={12} sm={6} md={4}>
                    <CustomTextField
                      label={t("subscribed_user_email")}
                      name="email"
                      placeholder={t("placeHolder_email")}
                      required
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published  mt-lg-3">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
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
}
