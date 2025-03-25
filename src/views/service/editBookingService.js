import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { Button, Row, Col, Select } from "antd";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../components/partials/customTextField";
import moment from "moment";
import { getServiceById, updateBooking } from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useHistory } from "react-router-dom";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { toast } from "react-toastify";

const EditBookingService = () => {
  const history = useHistory();
  const { bookingId, serviceId } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const trustId = localStorage.getItem("trustId");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (serviceId) {
        try {
          const response = await getServiceById(serviceId);
          if (response?.result) {
            setBookingDetails(response.result);
          }
        } catch (error) {
          console.error("Error fetching service details:", error);
        }
      }
    };

    fetchBookingDetails();
  }, [serviceId]);
  const [availableDates, setAvailableDates] = useState([]);

  // Populate available dates based on selected service
  useEffect(() => {
    if (bookingDetails && bookingDetails.serviceDates) {
      const today = moment().startOf("day");

      const upcomingDates = bookingDetails.serviceDates
        .filter((item) => moment(item.date).isSameOrAfter(today))
        .map((item) => moment(item.date).format("DD MMM YYYY"));

      setAvailableDates(upcomingDates);
    }
  }, [bookingDetails]);
  const CustomDateSelectComponent = ({
    dates = [],
    value = [],
    onChange,
    availability = [],
    ...props
  }) => {
    const handleDateChange = (selectedDate) => {
      if (!selectedDate) return;

      const formattedDate = moment(selectedDate, "DD MMM YYYY").format(
        "DD MMM YYYY"
      );

      const selectedAvailability = availability?.find(
        (item) => item.date === formattedDate
      );

      if (selectedAvailability) {
        const { totalCapacity, booked, locked } = selectedAvailability;

        if (locked > 0 && totalCapacity > 0) {
          toast.warning(
            `We are trying to make service available for you, please try after some time. (Please try some other service or wait for the same.)`
          );
          return;
        } else if (totalCapacity === booked) {
          toast.error(`This date is fully booked. Please select another date.`);
          return;
        }
      }

      onChange([formattedDate]); // Always send as an array with one element
    };

    return (
      <div id="sevaBooking">
        <Select
          {...props}
          value={value[0] || null} // Ensure only one value is selected
          onChange={handleDateChange}
          placeholder="Select a Date"
          style={{ width: "100%", height: "auto" }}
          allowClear
          className="custom-date-select mt-0"
        >
          {dates.map((date, index) => {
            const formattedDate = moment(date).format("DD MMM YYYY");

            const dateAvailability = availability?.find(
              (item) => item.date === formattedDate
            );

            const isFullyBooked =
              dateAvailability &&
              dateAvailability.totalCapacity === dateAvailability.booked;

            if (isFullyBooked) return null; // Hide fully booked dates

            return (
              <Select.Option key={index} value={formattedDate}>
                {formattedDate}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      const bookingData = {
        serviceId: values.service?.value,
        count: values.persons,
        serviceDate: values.date,
        trustId: trustId,
      };

      let response;

      response = await updateBooking(bookingId, bookingData);

      if (response?.result) {
        Swal.fire({
          title: "Success!",
          text: "Booking update successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries("bookedService");
        history.push("/service-booked");
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
        onClick={() => history.push("/service-booked")}
      />
      <div className="formwrapper FormikWrapper">
        <Formik
          initialValues={{
            service: bookingDetails
              ? {
                  value: bookingDetails._id,
                  label: bookingDetails.name,
                }
              : "",
            date: [],
            amount: bookingDetails?.amount || "",
            persons: bookingDetails?.countPerDay || "",
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
                    loadOptions={[
                      {
                        value: bookingDetails?._id,
                        label: bookingDetails?.name,
                      },
                    ]}
                    onChange={async (value) => {
                      if (!value) {
                        setFieldValue("service", "");
                        setFieldValue("amount", "");
                        setFieldValue("date", []);
                        setFieldValue("persons", "");
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
                            setFieldValue(
                              "persons",
                              response.result.countPerDay || ""
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
                  <label className="mb-0">{t("select_date")}</label>
                  <CustomDateSelectComponent
                    dates={availableDates}
                    value={values.date}
                    onChange={(dates) => setFieldValue("date", dates)}
                    availability={bookingDetails?.availability || []}
                  />
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
              </Row>
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: "20px" }}
                  disabled={isSubmitting || loading}
                  loading={isSubmitting || loading}
                >
                  {loading ? "Submitting..." : "Update Booking"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditBookingService;
