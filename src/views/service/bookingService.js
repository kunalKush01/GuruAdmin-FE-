import React, { useState } from "react";
import { Formik, Field } from "formik";
import { Button, Row, Col } from "antd";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../components/partials/customTextField";
import moment from "moment";
import { createBooking } from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";

const BookingService = ({ serviceData, setShowBookingForm }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const trustId = localStorage.getItem("trustId");
  const [loading, setLoading] = useState(false); // Track API call status
  const queryClient = useQueryClient();
  const serviceOptions = serviceData.map((service) => ({
    value: service._id,
    label: service.name,
  }));

  const dateOptions = (serviceId) => {
    const service = serviceData.find((s) => s._id === serviceId.value);
    return service
      ? service.dates.map((date) => ({
          value: date,
          label: moment(date).format("DD MMM YYYY"),
        }))
      : [];
  };

  const getAmount = (serviceId) => {
    const service = serviceData.find((s) => s._id === serviceId);
    return service ? service.amount : null;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      // Prepare the data as per the backend API structure
      const bookingData = {
        serviceId: values.service?.value,
        count: values.persons,
        date: values.date?.value,
        trustId: trustId,
      };

      // Call your backend API to create the booking
      const response = await createBooking(bookingData);

      if (response?.result) {
        Swal.fire({
          title: "Success!",
          text: "Booking created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries("bookedService");
        setShowBookingForm(false);
        resetForm();
      } else if (response.error) {
        Swal.fire({
          title: "Error!",
          text: "No slots available",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      // console.log("Booking Created:", response.data);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error || "Booking creation failed!",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Booking creation failed:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column">
      <img
        src={arrowLeft}
        width={25}
        style={{ cursor: "pointer" }}
        className="mb-1"
        onClick={() => setShowBookingForm(false)}
      />
      <div className="formwrapper FormikWrapper">
        <Formik
          initialValues={{
            service: "",
            date: null,
            amount: "",
            persons: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                {/* Select Service */}
                <Col xs={24} sm={6}>
                  <FormikCustomReactSelect
                    labelName={t("select_service")}
                    name="service"
                    placeholder={t("select_service")}
                    loadOptions={serviceOptions}
                    onChange={(value) => {
                      if (!value) {
                        setFieldValue("service", "");
                        setFieldValue("amount", "");
                        setFieldValue("date", "");
                      } else {
                        setFieldValue("service", value);
                        setFieldValue("date", "");
                        const amount = getAmount(value.value);
                        setFieldValue("amount", amount);
                      }
                    }}
                    value={values.service || null}
                    width
                  />
                </Col>

                {/* Select Date */}
                <Col xs={24} sm={6}>
                  <FormikCustomReactSelect
                    labelName={t("select_date")}
                    name="date"
                    placeholder={t("select_date")}
                    loadOptions={dateOptions(values.service || "")}
                    onChange={(value) => setFieldValue("date", value)}
                    value={values.date || null}
                    width
                  />
                </Col>

                {/* Amount */}
                <Col xs={24} sm={6}>
                  <Field name="amount">
                    {({ field }) => (
                      <CustomTextField
                        {...field}
                        label={t("amount")}
                        type="number"
                        placeholder={t("amount")}
                        disabled={true}
                        value={values.amount || ""}
                        width="100%"
                      />
                    )}
                  </Field>
                </Col>

                {/* Number of Persons */}
                <Col xs={24} sm={6}>
                  <Field name="persons">
                    {({ field }) => (
                      <CustomTextField
                        {...field}
                        label={t("no_of_person")}
                        type="number"
                        placeholder={t("no_of_person")}
                        onChange={(e) =>
                          setFieldValue("persons", e.target.value)
                        }
                        value={values.persons || ""}
                        width="100%"
                      />
                    )}
                  </Field>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: "20px" }}
                  disabled={isSubmitting || loading} // Disable while submitting
                  loading={isSubmitting || loading} // Show loading animation
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BookingService;
