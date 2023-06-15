import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { Prompt } from "react-router-dom";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";

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
`;

export default function SubscribedUserForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  getNumber,
  addDonationUser,
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const categoryQuerClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        addDonationUser
          ? categoryQuerClient.invalidateQueries(["donations"])
          : categoryQuerClient.invalidateQueries(["subscribedUser"]);
        setLoading(false);
        addDonationUser
          ? history.push(
              `/donation/add?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`
            )
          : history.push("/subscribed-user");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(getNumber ?? "");

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
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
        validationSchema={vailidationSchema}
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
              <Col xs={12}>
                <Row>
                  <Col xs={12} sm={6} md={4}>
                    <CustomTextField
                      label={t("user_name")}
                      placeholder={t("placeHolder_user_name")}
                      name="name"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
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
                        style={{
                          height: "20px",
                          font: "normal normal bold 11px/33px Noto Sans",
                        }}
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
                  className="addNotice-btn "
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
    </FormWaraper>
  );
}
