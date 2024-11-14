import { DatePicker, Drawer, Input } from "antd";
import { Formik, Form, Field } from "formik";
import React from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import "../../assets/scss/common.scss";
import FormikCustomReactSelect from "./formikCustomReactSelect";
import CustomTextField from "./customTextField";
const { RangePicker } = DatePicker;
import '../../assets/scss/common.scss'
import moment from "moment";
function AddFilterSection({ onFilterClose, filterOpen, onSubmitFilter }) {
  const { t } = useTranslation();

  // Options for the field and filter type select inputs
  const fieldOptions = [
    { value: "name", label: t("Name") },
    { value: "dob", label: t("Date of Birth") },
    { value: "mobile", label: t("Mobile Number") },
  ];

  const filterTypeOptions = [
    { value: "", label: t("select_option") },
    { value: "contains", label: t("contains") },
    { value: "equal", label: t("equal") },
    { value: "inRange", label: t("inRange") },
  ];

  // Function to render dynamic input based on selected field
  const renderFilterValueInput = (field, index, formik) => {
    const value = field ? field.value : null;

    const handleChange = (e) => {
      // Reset the value if field is changed
      if (formik.values[`fieldName${index}`] !== field.value) {
        formik.setFieldValue(`filterValue${index}`, ""); // Clear the value
      } else {
        formik.setFieldValue(`filterValue${index}`, e.target.value);
      }
    };

    switch (value) {
      case "name":
        return (
          <CustomTextField
            name={`filterValue${index}`}
            placeholder={t("Enter Name")}
            type="text"
            onChange={handleChange}
          />
        );
      case "dob":
        return (
          <RangePicker
            id="datePickerANTD"
            format="DD MMM YYYY"
            placeholder={t("Select Date")}
            onChange={(date) => {
              const formattedStartDate = moment(date).format("DD MMM YYYY");
              formik.setFieldValue(`filterValue${index}`, formattedStartDate);
            }}
          />
        );
      case "mobile":
        return (
          <CustomTextField
            name={`filterValue${index}`}
            placeholder={t("Enter Mobile Number")}
            type="number"
            onChange={handleChange}
          />
        );
      default:
        return (
          <CustomTextField
            name={`filterValue${index}`}
            placeholder={t("Enter Value")}
            type="text"
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <Drawer
      id="filterDrawer"
      title={t("Apply Filter")}
      onClose={onFilterClose}
      open={filterOpen}
      width={700}
    >
      <Formik
        initialValues={{}}
        onSubmit={(values) => {
          console.log("Form Values:", values);
          onSubmitFilter(values);
          onFilterClose();
        }}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={12} sm={6} lg={4} className='d-flex'>
                <label className="filterLable">Field Name:</label>
              </Col>
              <Col xs={12} sm={6} lg={3} className='d-flex'>
                <label className="filterLable">Filter Type:</label>
              </Col>
              <Col xs={12} sm={6} lg={5} className='d-flex'>
                <label className="filterLable">Field Value:</label>
              </Col>
            </Row>
            {[1, 2, 3].map((index) => (
              <Row className="mb-2" key={index}>
                {/* Field Selection */}
                <Col xs={12} sm={6} lg={4}>
                  <FormikCustomReactSelect
                    name={`fieldName${index}`}
                    labelKey="label"
                    valueKey="value"
                    loadOptions={fieldOptions}
                    placeholder={t("Select Field")}
                    required
                    onChange={(value) => {
                      // Reset the filterValue when field name changes
                      formik.setFieldValue(`filterValue${index}`, "");
                      formik.setFieldValue(`fieldName${index}`, value);
                    }}
                    width="100"
                  />
                </Col>

                {/* Filter Type Selection */}
                <Col xs={12} sm={6} lg={3}>
                  <FormikCustomReactSelect
                    name={`filterType${index}`}
                    labelKey="label"
                    valueKey="value"
                    loadOptions={filterTypeOptions}
                    placeholder={t("Select Filter")}
                    required
                    width="100"
                  />
                </Col>

                {/* Filter Value Input */}
                <Col xs={12} sm={6} lg={5}>
                  <Field name={`filterValue${index}`}>
                    {() =>
                      renderFilterValueInput(
                        formik.values[`fieldName${index}`],
                        index,
                        formik
                      )
                    }
                  </Field>
                </Col>
              </Row>
            ))}

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <Button
                color="primary"
                className="addAction-btn"
                type="submit"
              >
                <Plus size={15} strokeWidth={4} />
                <span>{t("Apply Filters")}</span>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}

export default AddFilterSection;
