import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { findAllCattle } from "../../api/cattle/cattleMedical";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import FormikRangeDatePicker from "../partials/FormikRangeDatePicker";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";

const FormikWrapper = styled.div``;

const AddMedicalInfoForm = ({
  initialValues,
  countryFlag = "in",
  validationSchema,
  getCommitmentMobile,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile ?? "");
  const [loading, setLoading] = useState(false);

  console.log(loading);

  const loadOption = async (tagId) => {
    const res = await findAllCattle({ cattleId: tagId });
    return res.results;
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
    <FormikWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          mutation.mutate({
            cattleId: values?.cattleCalfId?._id,
            symptoms: values?.cattleSymptoms,
            doctorName: values?.DrName,
            doctorNumber: values?.Mobile,
            countryCode: values?.dialCode,
            countryName: values?.countryCode,
            medicine: values?.treatmentMedicine,
            expenseAmount: values?.price,
            treatmentDate: values?.startDate,
            dosage: values?.dosage,
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
              <Col xs={12} md={9}>
                <Row>
                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="cattleCalfId"
                      labelKey="tagId"
                      valueKey="_id"
                      loadOptions={loadOption}
                      label={t("cattle_calf_id")}
                      placeholder={t("placeHolder_cattle_calf_id")}
                      defaultOptions
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_treatment_medicine")}
                      placeholder={t("placeHolder_cattle_treatment_medicine")}
                      name="treatmentMedicine"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_dosage")}
                      placeholder={t("placeHolder_cattle_dosage")}
                      name="dosage"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_dr_name")}
                      placeholder={t("placeHolder_cattle_dr_name")}
                      name="DrName"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomCountryMobileNumberField
                      value={phoneNumber}
                      defaultCountry={countryFlag}
                      label={t("dashboard_Recent_DonorNumber")}
                      placeholder={t("placeHolder_mobile_number")}
                      onChange={(phone, country) => {
                        setPhoneNumber(phone);
                        formik.setFieldValue(
                          "countryCode",
                          country?.countryCode
                        );
                        formik.setFieldValue("dialCode", country?.dialCode);
                        formik.setFieldValue(
                          "Mobile",
                          phone?.replace(country?.dialCode, "")
                        );
                      }}
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_purchase_price")}
                      type="number"
                      placeholder={t("placeHolder_cattle_purchase_price")}
                      name="price"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_symptoms")}
                      placeholder={t("placeHolder_cattle_symptoms")}
                      name="cattleSymptoms"
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
                  name="startDate"
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
                  className="addNotice-btn "
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
    </FormikWrapper>
  );
};

export default AddMedicalInfoForm;
