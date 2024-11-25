import { DatePicker, Drawer, Input, Collapse } from "antd";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import { Plus, Trash, Trash2 } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import "../../assets/scss/common.scss";
import FormikCustomReactSelect from "./formikCustomReactSelect";
import CustomTextField from "./customTextField";
const { RangePicker } = DatePicker;
import moment from "moment";
import { fetchFields } from "../../fetchModuleFields";
import { ConverFirstLatterToCapital } from "../../utility/formater";
const { Panel } = Collapse;
import deleteIcon from "../../../src/assets/images/icons/category/deleteIcon.svg";
import momentGenerateConfig from "rc-picker/lib/generate/moment";

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
function AddFilterSection({
  onFilterClose,
  filterOpen,
  onSubmitFilter,
  moduleName,
}) {
  const { t } = useTranslation();
  const [fieldOptions, setFieldOptions] = useState([]);
  const trustId = localStorage.getItem("trustId");
  const modName = ConverFirstLatterToCapital(moduleName);
  const [filterRows, setFilterRows] = useState([{ id: 1 }]);

  useEffect(() => {
    const excludeFields = [
      "_id",
      "updatedAt",
      // "createdAt",
      "__v",
      "trustId",
      "receiptLink",
      "receiptName",
      "customFields",
      "user",
      "createdBy",
    ];
    const getFields = async () => {
      const options = await fetchFields(trustId, modName, excludeFields);
      setFieldOptions(options);
    };
    getFields();
  }, [trustId, moduleName]);

  const renderFilterTypeOptions = (fieldType) => {
    switch (fieldType) {
      case "String":
        return [
          { value: "contains", label: t("contains") },
          { value: "equal", label: t("equal") },
        ];
      case "Date":
        return [
          { value: "equal", label: t("equal") },
          { value: "inRange", label: t("inRange") },
        ];
      case "Number":
        return [
          { value: "equal", label: t("equal") },
          { value: "inRange", label: t("inRange") },
          { value: "lessThan", label: t("less_than") },
          { value: "greaterThan", label: t("greater_than") },
        ];
      default:
        return [{ value: "", label: t("select_option") }];
    }
  };

  const renderFilterValueInput = (field, filterType, index, formik) => {
    const value = field ? field.value : null;

    const selectedField = fieldOptions.find((option) => option.value === value);
    const fieldType = selectedField ? selectedField.type : null;
    switch (fieldType) {
      case "String":
        return (
          <div className="w-100">
            <CustomTextField
              name={`filterValue${index}`}
              placeholder={t("Enter Value")}
              type="text"
            />
          </div>
        );
      case "Date":
        if (filterType && filterType.value === "inRange") {
          return (
            <RangePicker
              id="dateRangePickerANTD"
              format="DD MMM YYYY"
              placeholder={[t("Start Date"), t("End Date")]}
              onChange={(dates) => {
                const formattedDates =
                  dates && dates.length
                    ? dates.map((date) => date.toISOString()) // Ensure date is valid and formatted
                    : []; // Handle the case where dates are cleared
                formik.setFieldValue(`filterValue${index}`, formattedDates);
              }}
              style={{ width: "100%" }}
            />
          );
        } else {
          return (
            <CustomDatePicker
              id="datePickerANTD"
              format="DD MMM YYYY"
              placeholder={t("Select Date")}
              onChange={(date) => {
                const formattedDate = date ? moment(date).toISOString() : null;
                formik.setFieldValue(`filterValue${index}`, formattedDate);
              }}
              style={{ width: "100%" }}
            />
          );
        }
      case "Number":
        if (filterType && filterType.value === "inRange") {
          return (
            <div style={{ display: "flex", gap: "5px" }}>
              <CustomTextField
                name={`filterValue${index}.from`}
                placeholder={t("From")}
                type="number"
              />
              <CustomTextField
                name={`filterValue${index}.to`}
                placeholder={t("To")}
                type="number"
              />
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", width: "100%" }}>
              <CustomTextField
                width="100%"
                name={`filterValue${index}`}
                placeholder={t("Enter Number")}
                type="number"
              />
            </div>
          );
        }
      case "Boolean":
        return (
          <FormikCustomReactSelect
            name={`filterValue${index}`}
            labelKey="label"
            valueKey="value"
            loadOptions={[
              { value: true, label: t("True") },
              { value: false, label: t("False") },
            ]}
            placeholder={t("Select Boolean")}
            width="100"
          />
        );
      default:
        return (
          <div className="w-100">
            <CustomTextField
              name={`filterValue${index}`}
              placeholder={t("Enter Value")}
              type="text"
            />
          </div>
        );
    }
  };

  const addRow = () => {
    setFilterRows((prevRows) => [...prevRows, { id: Date.now() }]);
  };

  const deleteRow = (id, formik) => {
    if (filterRows.length > 1) {
      setFilterRows((prevRows) => prevRows.filter((row) => row.id !== id));
      formik.setFieldValue(`fieldName${id}`, undefined);
      formik.setFieldValue(`filterType${id}`, undefined);
      formik.setFieldValue(`filterValue${id}`, undefined);
    }
  };

  const isMobileView = window.innerWidth <= 768;

  return (
    <Drawer
      id="filterDrawer"
      title={t("Apply Filter")}
      onClose={onFilterClose}
      open={filterOpen}
      width={isMobileView ? "100%" : 700}
    >
      <Formik
        initialValues={{}}
        onSubmit={(values) => {
          const advancedSearch = {};
          Object.keys(values).forEach((key) => {
            if (key.startsWith("fieldName")) {
              const index = key.replace("fieldName", "");
              const fieldName = values[key]?.value;
              const filterType = values[`filterType${index}`]?.value;
              const filterValue = values[`filterValue${index}`];
              if (fieldName && filterType) {
                if (filterType === "inRange") {
                  if (Array.isArray(filterValue)) {
                    advancedSearch[fieldName] = {
                      type: filterType,
                      fromDate: filterValue[0]
                        ? moment(filterValue[0]).toISOString()
                        : null,
                      toDate: filterValue[1]
                        ? moment(filterValue[1]).toISOString()
                        : null,
                    };
                  } else if (typeof filterValue === "object") {
                    advancedSearch[fieldName] = {
                      type: filterType,
                      from: filterValue.from || null,
                      to: filterValue.to || null,
                    };
                  }
                } else {
                  advancedSearch[fieldName] = {
                    type: filterType,
                    value: filterValue,
                  };
                }
              }
              // if (fieldName && filterType && filterValue) {
              //   advancedSearch[fieldName] = {
              //     type: filterType,
              //     value: filterValue,
              //   };
              // }
            }
          });

          onSubmitFilter(advancedSearch);
          onFilterClose();
        }}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={4} sm={4} lg={4} className="d-flex">
                <label className="filterLable">Field Name:</label>
              </Col>
              <Col xs={3} sm={3} lg={3} className="d-flex">
                <label className="filterLable">Filter Type:</label>
              </Col>
              <Col xs={5} sm={5} lg={5} className="d-flex">
                <label className="filterLable">Field Value:</label>
              </Col>
            </Row>
            {filterRows.map((row) => (
              <Row
                key={row.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Col xs={4} sm={4} lg={4}>
                  <FormikCustomReactSelect
                    name={`fieldName${row.id}`}
                    labelKey="label"
                    valueKey="value"
                    loadOptions={fieldOptions}
                    placeholder={t("Select Field")}
                    onChange={(value) => {
                      if (value && value.value) {
                        // Check if value and value.value exist
                        formik.setFieldValue(`filterValue${row.id}`, "");
                        formik.setFieldValue(`fieldName${row.id}`, value);

                        // Save the type of the selected field
                        const selectedField = fieldOptions.find(
                          (option) => option.value === value.value
                        );
                        if (selectedField) {
                          formik.setFieldValue(
                            `fieldType${row.id}`,
                            selectedField.type
                          );
                        }
                      } else {
                        formik.setFieldValue(`fieldName${row.id}`, "");
                        formik.setFieldValue(`fieldType${row.id}`, "");
                      }
                    }}
                    width="100"
                  />
                </Col>
                <Col xs={3} sm={3} lg={3}>
                  <FormikCustomReactSelect
                    name={`filterType${row.id}`}
                    labelKey="label"
                    valueKey="value"
                    loadOptions={renderFilterTypeOptions(
                      formik.values[`fieldType${row.id}`] // Pass the field type for the current row
                    )}
                    width="100"
                    placeholder={t("Select Filter")}
                  />
                </Col>
                <Col xs={5} sm={5} lg={5} className="d-flex">
                  <Field name={`filterValue${row.id}`}>
                    {() =>
                      renderFilterValueInput(
                        formik.values[`fieldName${row.id}`],
                        formik.values[`filterType${row.id}`],
                        row.id,
                        formik
                      )
                    }
                  </Field>
                  <img
                    src={deleteIcon}
                    onClick={() => deleteRow(row.id, formik)}
                    style={{
                      margin: "0 0 0 10px",
                      cursor:
                        filterRows.length === 1 ? "not-allowed" : "pointer",
                      width: "35px",
                      height: "35px",
                      opacity: filterRows.length === 1 ? 0.5 : 1,
                    }}
                  />
                </Col>
              </Row>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "15px",
              }}
            >
              <Button
                color="primary"
                onClick={addRow}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  fontSize: "14px",
                }}
                className="secondaryAction-btn"
              >
                <Plus size={15} style={{ marginRight: "5px" }} />
                {t("Add New Filter")}
              </Button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="primary"
                type="submit"
                style={{ padding: "10px 20px" }}
              >
                {t("Apply Filters")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}

export default AddFilterSection;
