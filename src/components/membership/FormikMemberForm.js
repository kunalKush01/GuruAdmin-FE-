import { Form } from "formik";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row, Spinner } from "reactstrap";
import { TextArea } from "../partials/CustomTextArea";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { DatePicker, Checkbox, Card, Button as AntdButton, Upload } from "antd";
import "../../../src/assets/scss/common.scss";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import CustomRadioButton from "../partials/customRadioButton";
import CustomFieldLocationForDonationUser from "../partials/customFieldLocationForDonationUser";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../../axiosApi/authApiInstans";
import { getMasterByKey, getMastersByKeys } from "../../api/membershipApi";
import { uploadFile } from "../../api/sharedStorageApi";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";

const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);

function FormikMemberForm({
  formik,
  loading,
  showPrompt,
  states,
  country,
  city,
  districtPincode,
  correspondenceStates,
  correspondenceCountry,
  correspondenceCity,
  correspondenceDistrictPincode,
  schema,
  mode,
  ...props
}) {
  const { t } = useTranslation();
  const customRequest = async ({ file, onSuccess, onError, name }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile(formData);
      if (response && response.data.result) {
        formik.setFieldValue(name, response.data.result.filePath);
        onSuccess(response.data.result.filePath);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      onError(new Error("Error uploading file"));
    }
  };

  const [isSameAsHome, setIsSameAsHome] = useState(false);
  function extractEnumMasters(schemaObject) {
    const enumMasters = []; // Initialize an array to store enumMaster keys

    function traverse(obj) {
      if (obj && typeof obj === "object") {
        // Check if the current object has an enumMaster property
        if (obj.enumMaster) {
          enumMasters.push({ enumKey: obj.enumMaster, title: obj.title }); // Store the enumMaster key
        }
        // Recursively traverse each property of the object
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === "object") {
            traverse(obj[key]);
          }
        });
      }
    }

    traverse(schemaObject);
    return enumMasters; // Return the array of all enumMasters
  }

  const enumMasters = extractEnumMasters(schema);

  const masterQuery = useQuery(
    ["MastersKeys", ...enumMasters.map((master) => master.enumKey)], // Use enumKeys for unique query keys
    () => getMastersByKeys(enumMasters.map((master) => master.enumKey)), // Fetch master data using the enumKeys
    {
      enabled: enumMasters.length > 0, // Only run the query if enumMasters is not empty
      keepPreviousData: true, // Keep previous data while fetching new data
    }
  );

  // Process the fetched data
  const masterItems = useMemo(
    () => masterQuery.data ?? [], // Fallback to an empty array if there's no data
    [masterQuery.data] // Only recalculate when the query data changes
  );

  // Flatten the results from the fetched data
  const firstValues = masterItems.map((item) =>
    item.values ? Object.values(item.values) : []
  );
  const firstValueResult = firstValues.map((values) =>
    values.length > 0 ? values[0] : null
  );
  const handleCheckboxChange = (e) => {
    setIsSameAsHome(e.target.checked);
    if (e.target.checked) {
      formik.setFieldValue("correspondenceAddLine1", formik.values.addLine1);
      formik.setFieldValue("correspondenceAddLine2", formik.values.addLine2);
      formik.setFieldValue("correspondenceCountry", formik.values.country);
      formik.setFieldValue("correspondenceState", formik.values.state);
      formik.setFieldValue("correspondenceCity", formik.values.city);
      formik.setFieldValue("correspondenceDistrict", formik.values.district);
      formik.setFieldValue("correspondencePin", formik.values.pin);
      formik.setFieldValue("correspondenceLocation", "");
    } else {
      formik.setFieldValue("correspondenceAddLine1", "");
      formik.setFieldValue("correspondenceAddLine2", "");
      formik.setFieldValue("correspondenceCountry", "");
      formik.setFieldValue("correspondenceState", "");
      formik.setFieldValue("correspondenceCity", "");
      formik.setFieldValue("correspondenceDistrict", "");
      formik.setFieldValue("correspondencePin", "");
    }
  };
  const renderFormField = (name, fieldSchema) => {
    const hasDateFormat = fieldSchema.format === "date";
    const hasNumberFormat = fieldSchema.format === "number";
    const hasEnum = Array.isArray(fieldSchema.enum);
    const hasUrl =
      fieldSchema.format === "Url" || fieldSchema?.items?.format === "Url";
    const isRequired = fieldSchema.isRequired;
    const dateValidation = fieldSchema.dateValidation;
    const isMultipleUpload = fieldSchema.isMultiple;
    const enumKey = fieldSchema.enumMaster;
    if (hasDateFormat) {
      return (
        <Col
          xs={12}
          sm={6}
          lg={3}
          key={name}
          className="customtextfieldwrapper"
        >
          <label>
            {t(fieldSchema.title)}
            {isRequired && <span className="text-danger">*</span>}
          </label>
          <CustomDatePickerComponent
            format="DD MMM YYYY"
            onChange={(date) => {
              if (date) {
                const formattedDate = date.format("DD MMM YYYY");
                formik.setFieldValue(name, formattedDate);
              } else {
                formik.setFieldValue(name, "");
              }
            }}
            value={
              formik.values[name]
                ? moment(formik.values[name], "DD MMM YYYY")
                : ""
            }
            disabledDate={
              dateValidation
                ? (current) =>
                    current &&
                    (current.isSame(moment(), "day") ||
                      current.isAfter(moment()))
                : null
            }
          />
          {formik.errors[name] && (
            <div className="text-danger">{formik.errors[name]}</div>
          )}
        </Col>
      );
    }
    if (hasUrl) {
      return (
        <Col
          xs={12}
          sm={6}
          lg={3}
          key={name}
          className="customtextfieldwrapper"
        >
          <label>
            {t(fieldSchema.title)}{" "}
            {isRequired && <span className="text-danger">*</span>}
          </label>
          <Upload
            className="uploadIdCard"
            name={name}
            listType="picture"
            customRequest={({ file, onSuccess, onError }) =>
              customRequest({
                file,
                onSuccess,
                onError,
                name,
                isMultiple: isMultipleUpload,
              })
            }
            style={{ width: "100%" }}
            // multiple={isMultipleUpload}
            // maxCount={!isMultipleUpload && 1}
            maxCount={1}
          >
            <AntdButton
              icon={
                <img
                  src={uploadIcon}
                  alt="Upload Icon"
                  style={{ width: 16, height: 16 }}
                />
              }
              style={{ width: "100%" }}
            >
              {t(fieldSchema.title)}
            </AntdButton>
          </Upload>{" "}
        </Col>
      );
    }

    if (hasEnum || enumKey) {
      const loadOptions =
        enumKey && firstValueResult
          ? firstValueResult
              .find((result, index) => {
                return enumMasters[index]?.enumKey.trim() === enumKey.trim();
              })
              ?.filter((value) => value !== "")
              .map((value) => ({
                id: value,
                name: t(value),
              }))
          : fieldSchema.enum.map((value) => ({
              id: value,
              name: t(value),
            }));
      const options = [
        { id: "", name: "Select Option" },
        ...(Array.isArray(loadOptions) ? loadOptions : []),
      ];

      return (
        <Col
          xs={12}
          sm={6}
          lg={3}
          key={name}
          className="customtextfieldwrapper"
        >
          <FormikCustomReactSelect
            labelName={t(fieldSchema.title || name)}
            loadOptions={options}
            name={name}
            labelKey="name"
            valueKey="id"
            width
            required={isRequired}
          />
        </Col>
      );
    }
    if (hasNumberFormat) {
      return (
        <Col xs={12} sm={6} lg={3} key={name}>
          <div className="d-flex flex-column membershipMobileField">
            <CustomCountryMobileNumberField
              label={t(fieldSchema.title || name)}
              name={name}
              placeholder={t(`Enter ${fieldSchema.title}`)}
              required={isRequired}
              value={formik.values[name] || ""}
              defaultCountry="in"
              onChange={(value) => formik.setFieldValue(name, value)}
            />
            {formik.errors[name] && (
              <div className="text-danger">{formik.errors[name]}</div>
            )}
          </div>
        </Col>
      );
    }

    switch (fieldSchema.type) {
      case "string":
        return (
          <Col xs={12} sm={6} lg={3} key={name}>
            <CustomTextField
              label={t(fieldSchema.title || name)}
              name={name}
              placeholder={t(`Enter ${fieldSchema.title}`)}
              required={isRequired}
            />
          </Col>
        );
      case "boolean":
        return (
          <Col xs={12} sm={6} lg={3} key={name}>
            <Checkbox name={name}>{t(fieldSchema.title || name)}</Checkbox>
          </Col>
        );
      case "date":
        return (
          <Col xs={12} sm={6} lg={3} key={name}>
            <CustomDatePickerComponent
              format="DD MMM YYYY"
              onChange={(date) => {
                if (date) {
                  formik.setFieldValue(name, date.format("DD MMM YYYY"));
                } else {
                  formik.setFieldValue(name, "");
                }
              }}
              value={
                formik.values[name]
                  ? moment(formik.values[name], "DD MMM YYYY")
                  : null
              }
            />
            {formik.errors[name] && (
              <div className="text-danger">{formik.errors[name]}</div>
            )}
          </Col>
        );
      case "object":
        return (
          <Col xs={12} key={name}>
            {renderSection(name, fieldSchema)}
          </Col>
        );
      case "array":
        return (
          <Col xs={12} key={name}>
            {fieldSchema.items
              ? fieldSchema.items.map((itemSchema, index) => (
                  <Row key={index}>
                    {renderFormField(`${name}[${index}]`, itemSchema)}
                  </Row>
                ))
              : null}
          </Col>
        );
      default:
        return null;
    }
  };

  const renderSection = useCallback(
    (sectionKey, sectionSchema) => {
      // Check if the section is `familyInfo` and skip rendering it
      if (sectionKey === "familyInfo") {
        return null;
      }

      return (
        <Row key={sectionKey}>
          <Col xs={12} className="mb-2">
            <div className="addAction">
              <Trans i18nKey={sectionSchema["title"]} />
            </div>
            <Card>
              <Row>
                {sectionSchema && sectionSchema.properties
                  ? Object.keys(sectionSchema.properties).map((fieldKey) =>
                      renderFormField(
                        fieldKey,
                        sectionSchema.properties[fieldKey]
                      )
                    )
                  : null}
              </Row>
            </Card>
          </Col>
        </Row>
      );
    },
    [renderFormField]
  );

  const formSections = useMemo(() => {
    if (schema && schema.properties) {
      return Object.keys(schema.properties)
        .filter((sectionKey) => sectionKey !== "addressInfo")
        .map((sectionKey) => {
          if (sectionKey === "contactInfo") {
            return (
              <React.Fragment key={sectionKey}>
                {renderSection(sectionKey, schema.properties[sectionKey])}
                {/* Home address */}
                <Col xs={12} className="mb-2">
                  <div className="addAction">
                    <Trans i18nKey={"member_add_info"} />
                  </div>
                  <Card>
                    <Row key="addressSection">
                      <Col xs={12} sm={12} md={12}>
                        <div className="addHeading">
                          <Trans i18nKey={"member_home_add"} />
                        </div>
                        <div className="card mb-1" id="membAddCard">
                          <div
                            className={
                              formik.values.searchType !== "isPincode"
                                ? "card-body"
                                : "card-body pb-0"
                            }
                          >
                            <Row>
                              <Col
                                xs={12}
                                sm={4}
                                md={4}
                                className="customtextfieldwrapper"
                              >
                                <label>Search Address</label>
                              </Col>
                              <Col xs={12} sm={4} md={4}>
                                <CustomRadioButton
                                  name="searchType"
                                  id="isPincode"
                                  value="isPincode"
                                  label={t("label_pincode")}
                                />
                              </Col>
                              <Col xs={12} sm={4} md={4}>
                                <CustomRadioButton
                                  label={t("label_googlemap")}
                                  name="searchType"
                                  id="isGoogleMap"
                                  value="isGoogleMap"
                                  checked={
                                    formik.values.searchType == "" ||
                                    formik.values.searchType == "isGoogleMap"
                                  }
                                />
                              </Col>
                              <Col xs={12} sm={4} md={4} className="py-1"></Col>
                              {formik.values.searchType === "isPincode" ? (
                                <Col
                                  xs={12}
                                  sm={8}
                                  md={8}
                                  className="py-1 memberAddInput"
                                >
                                  <CustomTextField
                                    type="number"
                                    name="pincode"
                                    placeholder="Enter Pincode"
                                    value={formik.values.pincode}
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        "pincode",
                                        e.target.value
                                      );
                                    }}
                                    required
                                  />
                                </Col>
                              ) : (
                                <Col
                                  xs={12}
                                  sm={8}
                                  md={8}
                                  className="memberAddInput"
                                  style={{ marginTop: "15px" }}
                                >
                                  <CustomFieldLocationForDonationUser
                                    setFieldValue={formik.setFieldValue}
                                    values={formik.values}
                                    type="home"
                                  />
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <CustomTextField
                          label={t("label_add1")}
                          name="addLine1"
                          placeholder=""
                          required
                        />
                      </Col>{" "}
                      <Col xs={12} sm={4} md={4}>
                        <CustomTextField
                          label={t("label_add2")}
                          name="addLine2"
                          placeholder=""
                          required
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <FormikCustomReactSelect
                          labelName={t("label_country")}
                          loadOptions={country?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(item.name),
                            };
                          })}
                          name="country"
                          labelKey="name"
                          valueKey="id"
                          width
                          onChange={(val) => {
                            if (val) {
                              formik.setFieldValue("country", val);
                              formik.setFieldValue("pincode", "");
                              formik.setFieldValue("pin", "");
                              formik.setFieldValue("district", "");
                            }
                          }}
                          required
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <FormikCustomReactSelect
                          labelName={t("label_state")}
                          loadOptions={states?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(item.name),
                            };
                          })}
                          name="state"
                          labelKey="name"
                          valueKey="id"
                          width
                          disabled={!formik.values.country}
                          onChange={(val) => {
                            if (val) {
                              formik.setFieldValue("pincode", "");
                              formik.setFieldValue("state", val);
                              formik.setFieldValue("city", "");
                            }
                          }}
                          required
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <FormikCustomReactSelect
                          labelName={t("label_city")}
                          loadOptions={city?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(item.name),
                            };
                          })}
                          name="city"
                          labelKey="name"
                          valueKey="id"
                          onChange={(val) => {
                            if (val) {
                              formik.setFieldValue("pincode", "");
                              formik.setFieldValue("city", val);
                            }
                          }}
                          disabled={!formik.values.state}
                          width
                          required
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <CustomTextField
                          label={t("label_district")}
                          name="district"
                          placeholder="Enter District"
                          onChange={(e) => {
                            formik.setFieldValue("pincode", "");
                            formik.setFieldValue("district", e.target.value);
                            formik.setFieldValue("pin", "");
                          }}
                          required
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <FormikCustomReactSelect
                          labelName={t("label_pin")}
                          loadOptions={districtPincode?.map((item) => {
                            return {
                              ...item,
                              name: item.name,
                            };
                          })}
                          name="pin"
                          labelKey="name"
                          valueKey="id"
                          width
                          required
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                {/* Correspondence address */}
                <Col xs={12} className="mb-2">
                  <div className="addAction">
                    <Trans i18nKey={"member_add_info"} />
                  </div>
                  <Card>
                    <Row key="correspondenceAddressSection">
                      <Col xs={12} sm={12} md={12}>
                        <div className="addHeading d-flex justify-content-between align-items-center">
                          <div>
                            <Trans i18nKey={"member_cor_add"} />
                          </div>
                          <div>
                            <Checkbox onChange={handleCheckboxChange}>
                              <Trans i18nKey={"member_same_add"} />
                            </Checkbox>
                          </div>
                        </div>
                        <div className="card mb-1" id="membAddCard">
                          <div
                            className={
                              formik.values.correspondenceSearchType !==
                              "isCorrespondencePincode"
                                ? "card-body"
                                : "card-body pb-0"
                            }
                          >
                            <Row>
                              <Col
                                xs={12}
                                sm={4}
                                md={4}
                                className="customtextfieldwrapper"
                              >
                                <label>Search Address</label>
                              </Col>
                              <Col xs={12} sm={4} md={4}>
                                <CustomRadioButton
                                  disabled={isSameAsHome}
                                  name="correspondenceSearchType"
                                  id="isCorrespondencePincode"
                                  value="isCorrespondencePincode"
                                  label={t("label_pincode")}
                                />
                              </Col>
                              <Col xs={12} sm={4} md={4}>
                                <CustomRadioButton
                                  disabled={isSameAsHome}
                                  label={t("label_googlemap")}
                                  name="correspondenceSearchType"
                                  id="isCorrespondenceGoogleMap"
                                  value="isCorrespondenceGoogleMap"
                                  checked={
                                    formik.values.correspondenceSearchType ==
                                      "" ||
                                    formik.values.correspondenceSearchType ==
                                      "isCorrespondenceGoogleMap"
                                  }
                                />
                              </Col>
                              <Col xs={12} sm={4} md={4} className="py-1"></Col>
                              {formik.values.correspondenceSearchType ===
                              "isCorrespondencePincode" ? (
                                <Col
                                  xs={12}
                                  sm={8}
                                  md={8}
                                  className="py-1 memberAddInput"
                                >
                                  <CustomTextField
                                    type="number"
                                    name="correspondencePincode"
                                    placeholder="Enter Pincode"
                                    value={formik.values.correspondencePincode}
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        "correspondencePincode",
                                        e.target.value
                                      );
                                    }}
                                    required
                                    disabled={isSameAsHome}
                                  />
                                </Col>
                              ) : (
                                <Col
                                  xs={12}
                                  sm={8}
                                  md={8}
                                  className="memberAddInput"
                                  style={{ marginTop: "15px" }}
                                >
                                  <CustomFieldLocationForDonationUser
                                    setFieldValue={formik.setFieldValue}
                                    values={formik.values}
                                    type="correspondence"
                                    disabled={isSameAsHome}
                                  />
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <CustomTextField
                          label={t("label_add1")}
                          name="correspondenceAddLine1"
                          placeholder=""
                          disabled={isSameAsHome}
                        />
                      </Col>{" "}
                      <Col xs={12} sm={4} md={4}>
                        <CustomTextField
                          label={t("label_add2")}
                          name="correspondenceAddLine2"
                          placeholder=""
                          disabled={isSameAsHome}
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <FormikCustomReactSelect
                          labelName={t("label_country")}
                          loadOptions={correspondenceCountry?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(item.name),
                            };
                          })}
                          name="correspondenceCountry"
                          labelKey="name"
                          valueKey="id"
                          width
                          disabled={isSameAsHome}
                          onChange={(val) => {
                            if (val) {
                              formik.setFieldValue(
                                "correspondenceCountry",
                                val
                              );
                              formik.setFieldValue("correspondencePincode", "");
                              formik.setFieldValue("correspondencePin", "");
                              formik.setFieldValue(
                                "correspondenceDistrict",
                                ""
                              );
                            }
                          }}
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <FormikCustomReactSelect
                          labelName={t("label_state")}
                          loadOptions={correspondenceStates?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(item.name),
                            };
                          })}
                          name="correspondenceState"
                          labelKey="name"
                          valueKey="id"
                          width
                          disabled={
                            !formik.values.correspondenceCountry || isSameAsHome
                          }
                          onChange={(val) => {
                            if (val) {
                              formik.setFieldValue("correspondencePincode", "");
                              formik.setFieldValue("correspondenceState", val);
                              formik.setFieldValue("correspondenceCity", "");
                            }
                          }}
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <FormikCustomReactSelect
                          labelName={t("label_city")}
                          loadOptions={correspondenceCity?.map((item) => {
                            return {
                              ...item,
                              name: ConverFirstLatterToCapital(item.name),
                            };
                          })}
                          name="correspondenceCity"
                          labelKey="name"
                          valueKey="id"
                          onChange={(val) => {
                            if (val) {
                              formik.setFieldValue("correspondencePincode", "");
                              formik.setFieldValue("correspondenceCity", val);
                            }
                          }}
                          disabled={
                            !formik.values.correspondenceState || isSameAsHome
                          }
                          width
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <CustomTextField
                          disabled={isSameAsHome}
                          label={t("label_district")}
                          name="correspondenceDistrict"
                          placeholder="Enter District"
                          onChange={(e) => {
                            formik.setFieldValue("correspondencePincode", "");
                            formik.setFieldValue(
                              "correspondenceDistrict",
                              e.target.value
                            );
                            formik.setFieldValue("correspondencePin", "");
                          }}
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <FormikCustomReactSelect
                          disabled={isSameAsHome}
                          labelName={t("label_pin")}
                          loadOptions={correspondenceDistrictPincode?.map(
                            (item) => {
                              return {
                                ...item,
                                name: item.name,
                              };
                            }
                          )}
                          name="correspondencePin"
                          labelKey="name"
                          valueKey="id"
                          width
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </React.Fragment>
            );
          }

          // Render other sections normally
          return renderSection(sectionKey, schema.properties[sectionKey]);
        });
    }
    return null;
  }, [
    schema,
    formik.values.correspondenceLocation,
    formik.values.homeLocation,
    formik.values.correspondenceSearchType,
    formik.values.searchType,
    country,
    states,
    city,
    districtPincode,
    correspondenceCountry,
    correspondenceStates,
    correspondenceCity,
    correspondenceDistrictPincode,
    isSameAsHome,
    formik,
    firstValueResult,
  ]);
  return (
    <Form>
      {formSections}
      <div className="btn-Published">
        {loading ? (
          <Button color="primary" className="add-trust-btn" disabled>
            <Spinner size="md" />
          </Button>
        ) : (
          <Button color="primary" className="addAction-btn" type="submit">
            {!props.plusIconDisable && (
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
            )}
            <span>Save</span>
          </Button>
        )}
      </div>
    </Form>
  );
}

export default FormikMemberForm;
