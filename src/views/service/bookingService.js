import React, { useState } from "react";
import { Formik, Field } from "formik";
import { Button, Row, Col } from "antd";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import { useTranslation } from "react-i18next";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import CustomTextField from "../../components/partials/customTextField";
import moment from "moment";

const BookingService = ({ serviceData }) => {
  const [rows, setRows] = useState([
    { id: Date.now(), service: "", date: null, amount: "", persons: "" },
  ]);
  const { t } = useTranslation();
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

  // This will return the correct amount from the service
  const getAmount = (serviceId) => {
    const service = serviceData.find((s) => s._id === serviceId);
    return service ? service.amount : null;
  };

  return (
    <div>Hello World </div>
    // <Formik
    //   initialValues={{ rows }}
    //   onSubmit={(values) => {
    //     // Log the submitted values or perform further actions
    //     console.log("Form Submitted:", values);
    //   }}
    // >
    //   {({ values, setFieldValue, handleSubmit }) => (
    //     <form onSubmit={handleSubmit}>
    //       {values.rows.map((row, index) => (
    //         <div key={row.id} style={{ marginBottom: "20px" }}>
    //           <Row gutter={16}>
    //             {/* Select Service */}
    //             <Col xs={24} sm={6}>
    //               <FormikCustomReactSelect
    //                 labelName={t("select_service")}
    //                 name={`rows[${index}].service`}
    //                 placeholder={t("select_service")}
    //                 loadOptions={serviceOptions}
    //                 onChange={(value) => {
    //                   // If service is removed, reset the amount
    //                   if (!value) {
    //                     setFieldValue(`rows[${index}].service`, ""); 
    //                     setFieldValue(`rows[${index}].amount`, ""); 
    //                     setFieldValue(`rows[${index}].date`, ""); 
    //                   } else {
    //                     setFieldValue(`rows[${index}].service`, value);
    //                     setFieldValue(`rows[${index}].date`, "");
    //                     const amount = getAmount(value.value); 
    //                     setFieldValue(`rows[${index}].amount`, amount);
    //                   }
    //                 }}
    //                 value={values.rows[index]?.service || null}
    //                 width
    //               />
    //             </Col>

    //             {/* Select Date */}
    //             <Col xs={24} sm={6}>
    //               <FormikCustomReactSelect
    //                 labelName={t("select_date")}
    //                 name={`rows[${index}].date`}
    //                 placeholder={t("select_date")}
    //                 loadOptions={dateOptions(values.rows[index]?.service || "")}
    //                 onChange={(value) =>
    //                   setFieldValue(`rows[${index}].date`, value)
    //                 }
    //                 value={values.rows[index]?.date || null}
    //                 width
    //               />
    //             </Col>

    //             {/* Amount */}
    //             <Col xs={24} sm={5}>
    //               <Field name={`rows[${index}].amount`}>
    //                 {({ field }) => (
    //                   <CustomTextField
    //                     {...field}
    //                     label={t("amount")}
    //                     type="number"
    //                     placeholder={t("amount")}
    //                     disabled={true} 
    //                     value={values.rows[index]?.amount || ""} 
    //                     width="100%"
    //                   />
    //                 )}
    //               </Field>
    //             </Col>

    //             {/* Number of Persons */}
    //             <Col xs={24} sm={5} className="me-1">
    //               <Field name={`rows[${index}].persons`}>
    //                 {({ field }) => (
    //                   <CustomTextField
    //                     {...field}
    //                     label={t("no_of_person")}
    //                     type="number"
    //                     placeholder={t("no_of_person")}
    //                     onChange={(e) =>
    //                       setFieldValue(
    //                         `rows[${index}].persons`,
    //                         e.target.value
    //                       )
    //                     }
    //                     value={values.rows[index]?.persons || ""}
    //                     width="100%"
    //                   />
    //                 )}
    //               </Field>
    //             </Col>

    //             {/* Delete Button */}
    //             {values.rows.length > 1 && (
    //               <Col
    //                 style={{
    //                   display: "flex",
    //                   justifyContent: "center",
    //                   alignItems: "center",
    //                   marginTop: "15px",
    //                 }}
    //               >
    //                 <img
    //                   src={deleteIcon}
    //                   className="cursor-pointer"
    //                   alt="Delete"
    //                   width={30}
    //                   height={30}
    //                   style={{
    //                     cursor: "pointer",
    //                   }}
    //                   onClick={() => {
    //                     const newRows = values.rows.filter(
    //                       (_, i) => i !== index
    //                     );
    //                     setFieldValue("rows", newRows);
    //                   }}
    //                 />
    //               </Col>
    //             )}
    //           </Row>
    //         </div>
    //       ))}

    //       <Button
    //         className="me-1"
    //         type="primary"
    //         onClick={() => {
    //           const newRow = {
    //             id: Date.now(),
    //             service: "",
    //             date: null,
    //             amount: "",
    //             persons: "",
    //           };
    //           setFieldValue("rows", [...values.rows, newRow]);
    //         }}
    //         style={{ marginTop: "20px" }}
    //       >
    //         Add Row
    //       </Button>

    //       <Button
    //         type="primary"
    //         htmlType="submit"
    //         style={{ marginTop: "20px" }}
    //       >
    //         Submit
    //       </Button>
    //     </form>
    //   )}
    // </Formik>
  );
};

export default BookingService;
