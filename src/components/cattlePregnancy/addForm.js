import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { findAllCattle } from "../../api/cattle/cattleMedical";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomRadioButton from "../partials/customRadioButton";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import "../../assets/scss/common.scss";

const AddPregnancyForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadOption = async (tagId) => {
    const res = await findAllCattle({ cattleId: tagId });
    return res.results;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["cattlePregnancyList"]);
        setLoading(false);
        navigate("/cattle/pregnancy-reports");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  return (
    <div className="FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          mutation.mutate({
            pregnancyId: values?.pregnancyId,
            cattleId: values?.cattleId?._id,
            calfId: values?.calfId?._id,
            conceivingDate: values?.conceivingDate,
            pregnancyDate: values?.pregnancyDate,
            status: values?.pregnancyStatus,
          });
        }}
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
            <Col xs={12} sm={6} lg={4}>
            <Row>
                  <Col xs={12}>
                    <AsyncSelectField
                      name="cattleId"
                      labelKey="tagId"
                      valueKey="_id"
                      loadOptions={loadOption}
                      label={t("cattle_id")}
                      placeholder={t("placeHolder_cattle_id")}
                      defaultOptions
                      required
                    />
                  </Col>
                  <Col xs={12}>
                    <AsyncSelectField
                      name="calfId"
                      labelKey="tagId"
                      valueKey="_id"
                      loadOptions={loadOption}
                      label={t("calf_id")}
                      placeholder={t("placeHolder_calf_id")}
                      defaultOptions
                    />
                  </Col>
                  <Col xs={12}>
                    <Row>
                      <label>
                        <Trans i18nKey="cattle_pregnancy_status" />
                      </label>
                      <Col xs={6} sm={3}>
                        <CustomRadioButton
                          name="pregnancyStatus"
                          id="pregnancyStatus1"
                          value="YES"
                          label="Active"
                        />
                      </Col>
                      <Col xs={6} sm={5}>
                        <CustomRadioButton
                          name="pregnancyStatus"
                          id="pregnancyStatus2"
                          value="NO"
                          label="Inactive"
                          customOnChange={() =>
                            formik.setFieldValue("deathReason", "")
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={3}>
                <FormikCustomDatePicker
                  label={t("cattle_conceiving_date")}
                  name="conceivingDate"
                />
              </Col>
              <Col xs={12} md={3}>
                <FormikCustomDatePicker
                  label={t("cattle_delivery_date")}
                  name="pregnancyDate"
                />
              </Col>
            </Row>

            <div className="btn-Published mt-3">
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
                  className="d-flex align-items-center m-auto"
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

export default AddPregnancyForm;
