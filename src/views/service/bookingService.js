import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { Button, Row, Col, Select } from "antd";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../components/partials/customTextField";
import moment from "moment";
import {
  createBooking,
  // updateBooking,
  getServiceById,
} from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";

const BookingService = ({
  serviceData,
  setShowBookingForm,
  isEdit,
  editServiceRecord,
}) => {
  const { t } = useTranslation();
  const trustId = localStorage.getItem("trustId");
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const queryClient = useQueryClient();

  const serviceOptions = serviceData.map((service) => ({
    value: service._id,
    label: service.name,
  }));

  const [availableDates, setAvailableDates] = useState([]);

  // Populate available dates based on selected service
  useEffect(() => {
    if (bookingDetails && bookingDetails.dates) {
      const today = moment().startOf("day");

      const upcomingDates = bookingDetails.dates
        .filter((date) => moment(date).isSameOrAfter(today))
        .map((date) => moment(date).format("DD MMM YYYY"));

      setAvailableDates(upcomingDates);
    }
  }, [bookingDetails]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      const bookingData = {
        serviceId: values.service?.value,
        count: values.persons,
        date: values.date,
        trustId: trustId,
      };

      let response;

      if (isEdit) {
        //**todo update is not done in backend */
        // Editing an existing booking
        // response = await updateBooking(
        //   editServiceRecord.bookingId,
        //   bookingData
        // );
      } else {
        // Creating a new booking
        response = await createBooking(bookingData);
      }

      if (response?.result) {
        Swal.fire({
          title: "Success!",
          text: isEdit
            ? "Booking updated successfully."
            : "Booking created successfully.",
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
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error || "Booking action failed!",
        icon: "error",
        confirmButtonText: "OK",
      });
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
            service: isEdit
              ? serviceOptions.find(
                  (s) => s.label === editServiceRecord?.serviceName
                ) || ""
              : "",
            date: isEdit
              ? editServiceRecord.dates.map((date) =>
                  moment(date).format("DD MMM YYYY")
                )
              : [],
            amount: isEdit ? editServiceRecord.amount.replace("₹", "") : "",
            persons: isEdit ? editServiceRecord.count || "" : "",
          }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={6}>
                  <FormikCustomReactSelect
                    labelName={t("select_service")}
                    name="service"
                    placeholder={t("select_service")}
                    loadOptions={
                      isEdit
                        ? [
                            {
                              value: editServiceRecord?.serviceId,
                              label: editServiceRecord?.serviceName,
                            },
                          ]
                        : serviceOptions
                    }
                    onChange={async (value) => {
                      if (!value) {
                        setFieldValue("service", "");
                        setFieldValue("amount", "");
                        setFieldValue("date", []);
                      } else {
                        setFieldValue("service", value);
                        try {
                          const response = await getServiceById(value.value);
                          if (response?.result) {
                            setBookingDetails(response?.result);
                            setFieldValue(
                              "amount",
                              response.result.amount || ""
                            );
                          }
                        } catch (error) {
                          console.error(
                            "Error fetching service details:",
                            error
                          );
                        }
                      }
                    }}
                    value={values.service || null}
                    width
                  />
                </Col>

                <Col xs={24} sm={6}>
                  <div id="sevaBooking">
                    <label className="mb-0">{t("select_date")}</label>
                    <Select
                      mode="multiple"
                      placeholder="Select Dates"
                      className="custom-date-select mt-0"
                      style={{ width: "100%", height: "auto" }}
                      allowClear
                      value={values.date}
                      onChange={(dates) => setFieldValue("date", dates)}
                    >
                      {availableDates.map((date, index) => (
                        <Select.Option key={index} value={date}>
                          {date}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>

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
                  disabled={isSubmitting || loading}
                  loading={isSubmitting || loading}
                >
                  {loading
                    ? "Submitting..."
                    : isEdit
                    ? "Update Booking"
                    : "Submit"}
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
