import { DatePicker, Drawer, Input, Collapse } from "antd";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { CloudLightning, Plus, Trash, Trash2 } from "react-feather";
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
  activeFilterData,
  rowId,
  removedData,
}) {
  const { t } = useTranslation();
  const [fieldOptions, setFieldOptions] = useState([]);
  const trustId = localStorage.getItem("trustId");
  const modName = ConverFirstLatterToCapital(moduleName);
  const [filterRows, setFilterRows] = useState([{ id: 1 }]);
  const [selectedFields, setSelectedFields] = useState([]);
  const formikRef = useRef();
  const isMobileView = window.innerWidth <= 768;
  const handleFieldChange = (value, rowId, formik) => {
    const previousValue = formik.values[`fieldName${rowId}`]?.value;
    if (previousValue) {
      // Remove previous value from selectedFields
      setSelectedFields((prev) =>
        prev.filter((field) => field !== previousValue)
      );
    }

    if (value && value.value) {
      // Add new value to selectedFields
      setSelectedFields((prev) => [...prev, value.value]);
      formik.setFieldValue(`filterValue${rowId}`, "");
      formik.setFieldValue(`fieldName${rowId}`, value);

      // Save the type of the selected field
      const selectedField = fieldOptions.find(
        (option) => option.value === value.value
      );
      if (selectedField) {
        formik.setFieldValue(`fieldType${rowId}`, selectedField.type);
      }
    } else {
      formik.setFieldValue(`fieldName${rowId}`, "");
      formik.setFieldValue(`fieldType${rowId}`, "");
    }
  };
  useEffect(() => {
    const donation_excludeField = [
      "articleItem",
      "articleQuantity",
      "articleRemark",
      "articleType",
      "articleUnit",
      "articleWeight",
      "isArticle",
    ];
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
    let finalExcludeFields = excludeFields;

    if (moduleName === "Article_Donation") {
      finalExcludeFields = excludeFields;
    } else {
      finalExcludeFields = [...excludeFields, ...donation_excludeField];
    }

    const getFields = async () => {
      const options = await fetchFields(trustId, modName, finalExcludeFields);
      setFieldOptions(options);
    };
    getFields();
  }, [trustId, moduleName]);
  const getFilteredFieldOptions = () =>
    fieldOptions.filter((option) => !selectedFields.includes(option.value));
  const renderFilterTypeOptions = (fieldType) => {
    switch (fieldType) {
      case "String":
        return [
          { value: "contain", label: t("contains") },
          { value: "equal", label: t("equal") },
        ];
      case "ObjectID":
        return [
          { value: "contain", label: t("contains") },
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
      case "Boolean":
        return [{ value: "equal", label: t("equal") }];
      default:
        return [{ value: "", label: t("select_option") }];
    }
  };

  const renderFilterValueInput = (field, filterType, index, formik) => {
    const value = field ? field.value : null;
    const enumValue = field ? field.enum : null;
    const selectedField = fieldOptions.find((option) => option.value === value);
    const fieldType = selectedField ? selectedField.type : null;
    switch (fieldType) {
      case "String":
        if (Array.isArray(enumValue) && enumValue.length > 0) {
          return (
            <div className="w-100">
              <FormikCustomReactSelect
                name={`filterValue${index}`}
                labelKey="label"
                valueKey="value"
                options={enumValue.map((item) => ({
                  value: item,
                  label: ConverFirstLatterToCapital(item),
                }))}
                placeholder={t("Select Value")}
                width="100"
              />
            </div>
          );
        } else {
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
      case "Date":
        if (filterType && filterType.value === "inRange") {
          return (
            <RangePicker
              id="dateRangePickerANTD"
              format="DD MMM YYYY"
              placeholder={[t("Start Date"), t("End Date")]}
              onChange={(dates) => {
                if (dates && dates.length) {
                  formik.setFieldValue(`filterValue${index}`, dates);
                } else {
                  formik.setFieldValue(`filterValue${index}`, []);
                }
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
                if (date) {
                  const selectedDate = moment(date).add(1, "day").utc();
                  formik.setFieldValue(`filterValue${index}`, selectedDate);
                } else {
                  formik.setFieldValue(`filterValue${index}`, null);
                }
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
          <div className="w-100">
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
          </div>
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
    const deletedFieldValue = formik.values[`fieldName${id}`]?.value;

    if (deletedFieldValue) {
      setFieldOptions((prevOptions) => {
        // Ensure no duplicate options
        if (
          !prevOptions.some(
            (option) => option.value === deletedFieldValue
          )
        ) {
          return [
            ...prevOptions,
            { value: deletedFieldValue, label: deletedFieldValue },
          ];
        }
        return prevOptions;
      });
      setSelectedFields((prev) =>
        prev.filter((field) => field !== deletedFieldValue)
      );
    }
    if (filterRows.length > 1) {
      setFilterRows((prevRows) => prevRows.filter((row) => row.id !== id));
      formik.setFieldValue(`fieldName${id}`, undefined);
      formik.setFieldValue(`filterType${id}`, undefined);
      formik.setFieldValue(`filterValue${id}`, undefined);
    }
  };
// console.log(activeFilterData)
  useEffect(() => {
    if (formikRef) {
      if (activeFilterData && activeFilterData != {}) {
        //**start: if there is no active filter */
        if (Object.keys(activeFilterData).length === 0) {
          setFilterRows([{ id: 1 }]);
          const removedRows = filterRows.filter((row) => {
            return Object.values(removedData).some(
              (filter) => filter.index === row.id.toString()
            );
          });
          // Restore removed field options and remove from selected fields
          removedRows.forEach((row) => {
            const deletedFieldValue =
              formikRef.current?.values[`fieldName${row.id}`]?.value;
            if (deletedFieldValue) {
              // Add deleted field back to options
              setFieldOptions((prevOptions) => {
                // Ensure no duplicate options
                if (
                  !prevOptions.some(
                    (option) => option.value === deletedFieldValue
                  )
                ) {
                  return [
                    ...prevOptions,
                    { value: deletedFieldValue, label: deletedFieldValue },
                  ];
                }
                return prevOptions;
              });

              // Remove the field from selected fields
              setSelectedFields((prev) =>
                prev.filter((field) => field !== deletedFieldValue)
              );
            }
            if (formikRef.current) {
              formikRef.current.setFieldValue(`fieldName${row.id}`, "");
              formikRef.current.setFieldValue(`filterType${row.id}`, "");
              formikRef.current.setFieldValue(`filterValue${row.id}`, "");
            }
            // Reset the Formik values for the removed row
          });
        } else {
          const updatedFilterRows = filterRows.filter((row) => {
            return Object.values(activeFilterData).some(
              (filter) => filter.index === row.id.toString()
            );
          });
          setFilterRows(updatedFilterRows);
        }
        //**end */

        //**start: get back field after delete filter */
        if (rowId) {
          const deletedFieldValue =
            formikRef.current?.values[`fieldName${rowId}`]?.value;

          if (deletedFieldValue) {
            setFieldOptions((prevOptions) => {
              // Ensure no duplicate options
              if (
                !prevOptions.some(
                  (option) => option.value === deletedFieldValue
                )
              ) {
                return [
                  ...prevOptions,
                  { value: deletedFieldValue, label: deletedFieldValue },
                ];
              }
              return prevOptions;
            });

            // Remove the field from selected fields
            setSelectedFields((prev) =>
              prev.filter((field) => field !== deletedFieldValue)
            );
          }
          if (formikRef.current) {
            formikRef.current.setFieldValue(`fieldName${rowId}`, "");
            formikRef.current.setFieldValue(`filterType${rowId}`, "");
            formikRef.current.setFieldValue(`filterValue${rowId}`, "");
          }
        }
        //**end */
      }
    } else {
      setFilterRows([{ id: 1 }]);
      if (formikRef.current) {
        formikRef.current.setFieldValue("fieldName1", "");
        formikRef.current.setFieldValue("filterType1", "");
        formikRef.current.setFieldValue("filterValue1", "");
      }
    }
  }, [activeFilterData&&activeFilterData, formikRef, rowId, removedData]);
  return (
    <Drawer
      id="filterDrawer"
      title={t("Apply Filter")}
      onClose={onFilterClose}
      open={filterOpen}
      width={isMobileView ? "100%" : 700}
    >
      <Formik
        innerRef={formikRef}
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
                        ? filterValue[0]
                            .clone()
                            .set({
                              hour: 18,
                              minute: 30,
                              second: 0,
                              millisecond: 0,
                            })
                            .toISOString()
                        : null,
                      toDate: filterValue[1]
                        ? filterValue[1]
                            .clone()
                            .add(1, "day")
                            .set({
                              hour: 18,
                              minute: 30,
                              second: 0,
                              millisecond: 0,
                            })
                            .subtract(1, "millisecond")
                            .toISOString()
                        : null,
                      index: index,
                    };
                  } else if (typeof filterValue === "object") {
                    advancedSearch[fieldName] = {
                      type: filterType,
                      from: filterValue.from || null,
                      to: filterValue.to || null,
                      index: index,
                    };
                  }
                } else if (
                  typeof filterValue =="object"&&
                  moment(filterValue).isValid() 
                ) {
                  const selectedDate = filterValue;
                  if (selectedDate && selectedDate.isValid()) {
                    const fromDate = selectedDate
                      .clone()
                      .subtract(1, "day")
                      .set({
                        hour: 18,
                        minute: 30,
                        second: 0,
                        millisecond: 0,
                      })
                      .toISOString();

                    const toDate = selectedDate
                      .clone()
                      .set({
                        hour: 18,
                        minute: 30,
                        second: 0,
                        millisecond: 0,
                      })
                      .subtract(1, "millisecond")
                      .toISOString();

                    advancedSearch[fieldName] = {
                      type: "inRange",
                      fromDate: fromDate,
                      toDate: toDate,
                      index: index,
                    };
                  }
                } else {
                  const actualValue =
                    typeof filterValue === "object" && "value" in filterValue
                      ? filterValue.value
                      : filterValue;
                  advancedSearch[fieldName] = {
                    type: filterType,
                    value: actualValue,
                    index: index,
                  };
                }
              }
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
                    loadOptions={getFilteredFieldOptions()}
                    placeholder={t("Select Field")}
                    onChange={(value) =>
                      handleFieldChange(value, row.id, formik)
                    }
                    width="100"
                  />
                </Col>
                <Col xs={3} sm={3} lg={3}>
                  <FormikCustomReactSelect
                    name={`filterType${row.id}`}
                    labelKey="label"
                    valueKey="value"
                    loadOptions={renderFilterTypeOptions(
                      formik.values[`fieldType${row.id}`]
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
