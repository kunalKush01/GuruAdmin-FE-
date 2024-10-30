import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import { FormikWrapper } from "../../views/dharmshala-management/dharmshalaStyles";
import CustomTextField from "../partials/customTextField";
import "./dropdown.css";
import "../../assets/scss/common.scss";

const AddBookingForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");
  const [correct, isCorrect] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["bookingList"]);
        setLoading(false);
        isCorrect(true);
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  const handleFormSubmit = (values) => {
    setLoading(true);
    setShowPrompt(false);
    const {
      startDate,
      endDate,
      count,
      status,
      earlyCheckIn,
      lateCheckout,
      ...otherValues
    } = values;

    const data = {
      startDate,
      endDate,
      count,
      status,
      earlyCheckIn,
      lateCheckout,
      ...otherValues,
    };

    mutation.mutate(data);
    history.push(`/booking/info`);
  };

  return (
    <div className="FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
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
                {/* First Row */}
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_booking_id")}
                      placeholder={t("placeHolder_booking_id")}
                      name="Booking ID"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      type="date"
                      label={t("dharmshala_booking_start_date")}
                      placeholder={t("placeHolder_booking_start_date")}
                      name="Start Date"
                      required
                      autoFocus
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      type="date"
                      label={t("dharmshala_booking_end_date")}
                      placeholder={t("placeHolder_booking_end_date")}
                      name="End Date"
                      required
                      autoFocus
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_booking_count")}
                      placeholder={t("placeHolder_booking_count")}
                      name="Count"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      type="select"
                      label={t("dharmshala_booking_status")}
                      name="status"
                      required
                      autoFocus
                    >
                      <option value="requested">{t("requested")}</option>
                      <option value="accepted">{t("accepted")}</option>
                      <option value="reserved">{t("reserved")}</option>
                      <option value="confirmed">{t("confirmed")}</option>
                      <option value="checkedIn">{t("checkedIn")}</option>
                      <option value="completed">{t("completed")}</option>
                      <option value="cancelled">{t("cancelled")}</option>
                      <option value="maintenance">{t("maintenance")}</option>
                    </CustomTextField>
                  </Col>

                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_booking_early_check_in")}
                      name="earlyCheckIn"
                      required
                      autoFocus
                      type="select"
                      value={formik.values.earlyCheckIn}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="true">{t("yes")}</option>
                      <option value="false">{t("no")}</option>
                    </CustomTextField>
                  </Col>

                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_booking_late_check_out")}
                      name="lateCheckOut"
                      required
                      autoFocus
                      type="select"
                      value={formik.values.lateCheckOut}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="true">{t("yes")}</option>
                      <option value="false">{t("no")}</option>
                    </CustomTextField>
                  </Col>
                </Row>
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

export default AddBookingForm;
