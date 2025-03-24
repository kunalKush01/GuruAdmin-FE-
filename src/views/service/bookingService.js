import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { Button, Row, Col, Select } from "antd";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../components/partials/customTextField";
import moment from "moment";
import { createBooking, getServiceById } from "../../api/serviceApi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";

const BookingService = ({ serviceData, setShowBookingForm }) => {
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
  const CustomDateSelectComponent = ({
    dates = [],
    value = [],
    onChange,
    availability = [],
    ...props
  }) => {
    const handleDateChange = (selectedDates) => {
      if (!selectedDates) return;
  
      let validDates = [];
  
      selectedDates.forEach((selectedDate) => {
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
          } else if (totalCapacity === booked) {
            toast.error(`This date is fully booked. Please select another date.`);
            return; // Skip adding this date
          }
        }
  
        validDates.push(formattedDate);
      });
  
      onChange(validDates);
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
  
  // const CustomDateSelectComponent = ({
  //   dates = [],
  //   value = [],
  //   onChange,
  //   availability = [],
  //   ...props
  // }) => {
  //   const handleDateChange = (selectedDates) => {
  //     if (!selectedDates) return;

  //     let validDates = [];

  //     selectedDates.forEach((selectedDate) => {
  //       const formattedDate = moment(selectedDate, "DD MMM YYYY").format(
  //         "DD MMM YYYY"
  //       );

  //       const selectedAvailability = availability?.find(
  //         (item) => item.date === formattedDate
  //       );

  //       if (selectedAvailability) {
  //         const { totalCapacity, booked, locked, available } =
  //           selectedAvailability;

  //         if (locked > 0) {
  //           toast.warning(
  //             `We are trying to make service available for you, please try after some time. (Please try some other service or wait for the same.)`
  //           );
  //         } else if (totalCapacity === booked) {
  //           toast.error(
  //             `This date is fully booked. Please select another date.`
  //           );
  //         } else {
  //           validDates.push(formattedDate);
  //         }
  //       } else {
  //         validDates.push(formattedDate); // Allow removing previously selected dates
  //       }
  //     });

  //     onChange(validDates);
  //   };

  //   return (
  //     <div id="sevaBooking">
  //       <Select
  //         {...props}
  //         value={value}
  //         onChange={handleDateChange}
  //         mode="multiple"
  //         placeholder="Select Dates"
  //         style={{ width: "100%", height: "auto" }}
  //         allowClear
  //         className="custom-date-select mt-0"
  //       >
  //         {dates.map((date, index) => {
  //           const formattedDate = moment(date).format("DD MMM YYYY");

  //           const dateAvailability = availability?.find(
  //             (item) => item.date === formattedDate
  //           );

  //           const isAvailable =
  //             !dateAvailability || // Allow dates without availability
  //             (dateAvailability.available > 0 && dateAvailability.locked === 0);

  //           return (
  //             <Select.Option
  //               key={index}
  //               value={formattedDate}
  //               disabled={!isAvailable}
  //             >
  //               {formattedDate}
  //             </Select.Option>
  //           );
  //         })}
  //       </Select>
  //     </div>
  //   );
  // };
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setSubmitting(true);

    try {
      const bookingData = {
        serviceId: values.service?.value,
        count: values.persons,
        dates: values.dates,
        trustId: trustId,
      };

      let response;

      response = await createBooking(bookingData);

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
            service: "",
            dates: [],
            amount: "",
            persons: "",
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
                    loadOptions={serviceOptions}
                    onChange={async (value) => {
                      if (!value) {
                        setFieldValue("service", "");
                        setFieldValue("amount", "");
                        setFieldValue("dates", []);
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
                  <label className="mb-0">{t("select_date")}</label>
                  <CustomDateSelectComponent
                    dates={availableDates}
                    value={values.dates}
                    onChange={(dates) => setFieldValue("dates", dates)}
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
