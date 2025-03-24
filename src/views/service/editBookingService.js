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
    if (bookingDetails && bookingDetails.dates) {
      const today = moment().startOf("day");

      const upcomingDates = bookingDetails.dates
        .filter((date) => moment(date).isSameOrAfter(today))
        .map((date) => moment(date).format("DD MMM YYYY"));

      setAvailableDates(upcomingDates);
    }
  }, [bookingDetails]);
  const CustomDateSelectComponent = ({
    dates,
    value = [],
    onChange,
    availability,
    ...props
  }) => {
    const handleDateChange = (selectedDates) => {
      if (!selectedDates) return;

      let validDates = [];
      selectedDates.forEach((selectedDate) => {
        const selectedAvailability = availability?.find(
          (item) => item.date === selectedDate
        );

        if (selectedAvailability) {
          const { totalCapacity, booked, locked } = selectedAvailability;

          if (totalCapacity > 0 && locked === 1) {
            toast.warning(
              `We are trying to make service available for you, please try after some time. (Please try some other service or wait for the same.)`
            );
          } else {
            validDates.push(selectedDate);
          }
        } else {
          validDates.push(selectedDate); // Allow removing previously selected dates
        }
      });

      onChange(validDates); // Ensure user can remove dates freely
    };

    return (
      <div id="sevaBooking">
        <Select
          {...props}
          value={value}
          onChange={handleDateChange}
          mode="multiple"
          placeholder="Select Dates"
          style={{ width: "100%", height: "auto" }}
          allowClear
          className="custom-date-select mt-0"
        >
          {dates
            .filter((date) => {
              const dateAvailability = availability?.find(
                (item) => item.date === moment(date).format("DD MMM YYYY")
              );
              return !(
                dateAvailability?.totalCapacity === dateAvailability?.booked
              ); // Hide fully booked dates
            })
            .map((date, index) => (
              <Select.Option
                key={index}
                value={moment(date).format("DD MMM YYYY")}
              >
                {moment(date).format("DD MMM YYYY")}
              </Select.Option>
            ))}
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
        date: values.date,
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
        history.push("/service-booked")
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
            date: bookingDetails
              ? bookingDetails.dates.map((date) =>
                  moment(date).format("DD MMM YYYY")
                )
              : [],
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
