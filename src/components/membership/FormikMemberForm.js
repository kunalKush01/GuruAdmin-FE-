import { Form } from "formik";
import React, { useMemo, useCallback } from "react";
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
  schema,
  ...props
}) {
  const { t } = useTranslation();

  const renderFormField = useCallback(
    (name, fieldSchema) => {
      const hasDateFormat = fieldSchema.format === "date";
      const hasEnum = Array.isArray(fieldSchema.enum);
      const hasUrl = fieldSchema.format === "Url";
      if (hasDateFormat) {
        return (
          <Col
            xs={12}
            sm={6}
            lg={3}
            key={name}
            className="customtextfieldwrapper"
          >
            <label>{t(fieldSchema.title)}</label>
            <CustomDatePickerComponent format="DD MMM YYYY" />
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
            <label>{t(fieldSchema.title)}</label>
            <Upload
              name="image"
              listType="picture"
              // customRequest={customRequest}
              style={{ width: "100%" }}
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

      if (hasEnum) {
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
              loadOptions={fieldSchema.enum.map((value) => ({
                id: value,
                name: t(value),
              }))}
              name={name}
              labelKey="name"
              valueKey="id"
              width
            />
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
              />
            </Col>
          );
        case "boolean":
          return (
            <Col
              xs={12}
              sm={6}
              lg={3}
              key={name}
              className="customtextfieldwrapper"
            >
              <Checkbox name={name}>{t(fieldSchema.title || name)}</Checkbox>
            </Col>
          );
        case "date":
          return (
            <Col xs={12} sm={6} lg={3} key={name}>
              <CustomDatePickerComponent
                label={t(fieldSchema.title || name)}
                name={name}
              />
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
    },
    [t]
  );

  const renderSection = useCallback(
    (sectionKey, sectionSchema) => (
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
    ),
    [renderFormField]
  );

  const formSections = useMemo(() => {
    if (schema && schema.properties) {
      return Object.keys(schema.properties).map((sectionKey) =>
        renderSection(sectionKey, schema.properties[sectionKey])
      );
    }
    return null;
  }, [schema, renderSection]);

  return (
    <Form>
      {formSections}
      <Row>
        <Col xs={12} sm={12} md={12}>
          <label
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: "15px",
              fontWeight: "bold",
              color: "#533810",
            }}
          >
            Search Address
          </label>
          <div className="card mb-1">
            <div
              className={
                formik.values.searchType !== "isPincode"
                  ? "card-body"
                  : "card-body pb-0"
              }
            >
              <Row>
                <Col xs={12} sm={6} md={6}>
                  <CustomRadioButton
                    name="searchType"
                    id="isPincode"
                    value="isPincode"
                    label={t("label_pincode")}
                  />
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <CustomRadioButton
                    label={t("label_googlemap")}
                    name="searchType"
                    id="isGoogleMap"
                    value="isGoogleMap"
                  />
                </Col>
                {formik.values.searchType === "isPincode" ? (
                  <Col xs={12} sm={6} md={6} className="pb-0">
                    <CustomTextField
                      name="pincode"
                      placeholder="Enter Pincode"
                      value={formik.values.pincode}
                      onChange={(e) => {
                        formik.setFieldValue("pincode", e.target.value);
                      }}
                      required
                    />
                  </Col>
                ) : (
                  <Col
                    xs={12}
                    sm={6}
                    md={12}
                    className="pb-0"
                    style={{ marginTop: "10px" }}
                  >
                    <CustomFieldLocationForDonationUser
                      setFieldValue={formik.setFieldValue}
                      values={formik?.values}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <CustomTextField
            label={t("label_add1")}
            name="addLine1"
            placeholder=""
          />
        </Col>{" "}
        <Col xs={12} sm={6} md={6}>
          <CustomTextField
            label={t("label_add2")}
            name="addLine2"
            placeholder=""
          />
        </Col>
        <Col xs={12} sm={6} md={6}>
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
                // setDistrictPincode(null);
              }
            }}
          />
        </Col>
        <Col xs={12} sm={6} md={6}>
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
          />
        </Col>
        <Col xs={12} sm={6} md={6}>
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
          />
        </Col>
        <Col xs={12} sm={6} md={6}>
          <CustomTextField
            label={t("label_district")}
            name="district"
            placeholder="Enter District"
            onChange={(e) => {
              formik.setFieldValue("pincode", "");
              formik.setFieldValue("district", e.target.value);
              formik.setFieldValue("pin", "");
              if (e.target.value == "") {
                // setDistrictPincode([]);
              }
            }}
          />
        </Col>
        <Col xs={12} sm={6} md={6}>
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
          />
        </Col>
      </Row>
      <div className="btn-Published d-none">
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
            <span> Add</span>
          </Button>
        )}
      </div>
    </Form>
  );
}

export default FormikMemberForm;
