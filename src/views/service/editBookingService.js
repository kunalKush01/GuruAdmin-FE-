import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { Button, Row, Col, Select, Typography } from "antd";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../components/partials/customTextField";
import moment from "moment";
import {
  getBookingById,
  getServiceById,
  updateBooking,
} from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { toast } from "react-toastify";

const EditBookingService = () => {
  const navigate = useNavigate();
  const { bookingId, serviceId } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const trustId = localStorage.getItem("trustId");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!serviceId || !bookingId) return; // Ensure both IDs exist

      try {
        const response = await getBookingById(bookingId);
        const serviceResponse = await getServiceById(serviceId);
        if (response?.result) {
          setBookingDetails(response.result);
        }
        if (serviceResponse?.result) {
          setServiceDetail(serviceResponse.result);
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchBookingDetails();
  }, [serviceId, bookingId]);
  const [availableDates, setAvailableDates] = useState([]);

  // Populate available dates based on selected service
  useEffect(() => {
    if (serviceDetail && serviceDetail.serviceDates) {
      const today = moment().startOf("day");

      const upcomingDates = serviceDetail.serviceDates
        .filter((item) => moment(item.date).isSameOrAfter(today))
        .map((item) => moment(item.date).format("DD MMM YYYY"));

      setAvailableDates(upcomingDates);
    }
  }, [serviceDetail]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [etag, setEtag] = useState(null);
  const CustomDateSelectComponent = ({
    dates = [],
    value = [],
    onChange,
    availability = [],
    ...props
  }) => {
    useEffect(() => {
      if (value.length > 0) {
        const formattedDate = moment(value[0], "DD MMM YYYY").format(
          "DD MMM YYYY"
        );

        const selectedService = serviceDetail?.serviceDates.find(
          (item) => moment(item.date).format("DD MMM YYYY") === formattedDate
        );

        if (selectedService) {
          setEtag(selectedService.eTag);
        }
      }
    }, [value, serviceDetail]);

    const handleDateChange = (selectedDate) => {
      if (!selectedDate) {
        // Clear the selection
        setSelectedAvailability(null);
        onChange([]); // Reset value
        return;
      }
      const formattedDate = moment(selectedDate, "DD MMM YYYY").format(
        "DD MMM YYYY"
      );
      const selectedEtag = serviceDetail.serviceDates.find(
        (item) => moment(item.date).format("DD MMM YYYY") === formattedDate
      );

      if (selectedEtag) {
        setEtag(selectedEtag.eTag);
      }
      const selectedAvailability = availability?.find(
        (item) => item.date === formattedDate
      );

      if (selectedAvailability) {
        const { totalCapacity, booked, locked } = selectedAvailability;

        if (locked > 0 && totalCapacity > 0) {
          toast.warning(
            `We are trying to make service available for you, please try after some time. (Please try some other service or wait for the same.)`
          );
          // return;
        } else if (totalCapacity === booked) {
          toast.error(`This date is fully booked. Please select another date.`);
          return;
        }
        setSelectedAvailability(selectedAvailability);
      } else {
        setSelectedAvailability(null); // Reset if no availability data found
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
        eTag: etag,
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
        navigate("/service-booked");
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
        onClick={() => navigate("/service-booked")}
      />
      <div className="formwrapper FormikWrapper">
        <Formik
          initialValues={{
            service: serviceDetail
              ? {
                  value: serviceDetail._id,
                  label: serviceDetail.name,
                }
              : "",
            date: bookingDetails?.bookedSlots[0]?.date
              ? [
                  moment(bookingDetails.bookedSlots[0].date).format(
                    "DD MMM YYYY"
                  ),
                ]
              : [],
            amount: serviceDetail?.amount || "",
            persons: bookingDetails?.bookedSlots[0]?.count || "",
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
                        value: serviceDetail?._id,
                        label: serviceDetail?.name,
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
                        setFieldValue("date", []); // ✅ Always clear previous dates when changing service
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
                    availability={serviceDetail?.availability || []}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Field name="persons">
                    {({ field }) => (
                      <CustomTextField
                        {...field}
                        label={t("counts")}
                        type="number"
                        placeholder={t("counts")}
                        onChange={(e) =>
                          setFieldValue("persons", e.target.value)
                        }
                        value={values.persons || ""}
                        width="100%"
                      />
                    )}
                  </Field>
                  {values.date?.length > 0 &&
                  selectedAvailability &&
                  selectedAvailability?.available ? (
                    <>
                      <Typography.Text type="success" strong>
                        Slots available:
                      </Typography.Text>{" "}
                      <Typography.Text strong>
                        {selectedAvailability?.available}
                      </Typography.Text>
                    </>
                  ) : (
                    ""
                  )}
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
                  {loading ? t("update_booking") : t("update_booking")}
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
