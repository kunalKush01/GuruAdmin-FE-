import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import FormikRangeDatePicker from "../partials/FormikRangeDatePicker";
import CustomRadioButton from "../partials/customRadioButton";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";

const FormikWrapper = styled.div``;

const AddCattleForm = ({
  initialValues,
  countryFlag = "in",
  validationSchema,
  getMobile,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(getMobile ?? "");
  const [imageSpinner, setImageSpinner] = useState(false);
  const [ownerImageUploading, setOwnerImageUploading] = useState(false);

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  return (
    <FormikWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {
          setShowPrompt(false);
        }}
      >
        {(formik) => (
          <Form>
            {showPrompt && (
              <Prompt
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )}

            <Row>
              <Col xs={12} md={10} className="bg-danger">
                {/* <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_tag_id")}
                      placeholder={t("placeHolder_cattle_tag_id")}
                      name="TagID"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="motherID"
                      loadOptions={[]}
                      labelKey="title"
                      valueKey="id"
                      labelName={t("cattle_mother_id")}
                      placeholder={t("placeholder_cattle_mother_id")}
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      labelName={t("cattle_type")}
                      placeholder={t("placeholder_cattle_type")}
                      name="cattleType"
                      width="100%"
                      required
                      loadOptions={[]}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_breed")}
                      placeholder={t("placeHolder_cattle_breed")}
                      name="breed"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  
                  
                  
                  <Col md={8}>
                    <Row>
                      
                    </Row>
                  </Col>
                </Row> */}
                {/* First Row */}
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_tag_id")}
                      placeholder={t("placeHolder_cattle_tag_id")}
                      name="TagID"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="motherID"
                      loadOptions={[]}
                      labelKey="title"
                      valueKey="id"
                      labelName={t("cattle_mother_id")}
                      placeholder={t("placeholder_cattle_mother_id")}
                      width="100%"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      labelName={t("cattle_type")}
                      placeholder={t("placeholder_cattle_type")}
                      name="cattleType"
                      width="100%"
                      required
                      loadOptions={[]}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_breed")}
                      placeholder={t("placeHolder_cattle_breed")}
                      name="breed"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                </Row>
                {/* second row */}
                <Row>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="dateOfBirth"
                      inline={false}
                      label={t("cattle_date_birth")}
                      dateFormat=" dd-MM-yyyy"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_age")}
                      placeholder={t("placeHolder_cattle_age")}
                      name="age"
                      required
                      disabled
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="purchasedDate"
                      inline={false}
                      label={t("cattle_date_purchased")}
                      dateFormat=" dd-MM-yyyy"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_purchase_price")}
                      placeholder={t("placeHolder_cattle_purchase_price")}
                      name="purchasePrice"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="source"
                      loadOptions={[]}
                      labelName={t("cattle_source")}
                      placeholder={t("placeholder_cattle_source")}
                      width="100%"
                    />
                  </Col>
                </Row>
                {/* third row */}
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_owner_name")}
                      placeholder={t("placeHolder_cattle_owner_name")}
                      name="ownerName"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomCountryMobileNumberField
                      value={phoneNumber}
                      defaultCountry={countryFlag}
                      label={t("cattle_owner_number")}
                      placeholder={t("placeHolder_cattle_owner_number")}
                      onChange={(phone, country) => {
                        setPhoneNumber(phone);
                        formik.setFieldValue(
                          "countryCode",
                          country?.countryCode
                        );
                        formik.setFieldValue("dialCode", country?.dialCode);
                        formik.setFieldValue(
                          "Mobile",
                          phone?.replace(country?.dialCode, "")
                        );
                      }}
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_owner_id")}
                      placeholder={t("placeHolder_cattle_owner_Id")}
                      name="ownerID"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                </Row>
                {/* forth row */}
                <Row>
                  <Col md={2}>
                    <div className="ImagesVideos">
                      <Trans i18nKey={"cattle_cow_image"} />{" "}
                    </div>
                    <ImageUpload
                      bg_plus={thumbnailImage}
                      imageSpinner={imageSpinner}
                      acceptFile="image/*"
                      svgNotSupported
                      setImageSpinner={setImageSpinner}
                      editTrue="edit"
                      editedFileNameInitialValue={
                        formik?.values?.cowImage
                          ? formik?.values?.cowImage
                          : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue(
                          "cowImage",
                          `${randomNumber}_${file}`
                        );
                        formik.setFieldValue("type", type);
                        setImageName(`${randomNumber}_${file}`);
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("cowImage", "");
                        setImageName("");
                      }}
                    />
                  </Col>

                  <Col md={2}>
                    <div className="ImagesVideos">
                      <Trans i18nKey={"cattle_owner_image"} />{" "}
                    </div>
                    <ImageUpload
                      bg_plus={thumbnailImage}
                      imageSpinner={ownerImageUploading}
                      acceptFile="image/*"
                      svgNotSupported
                      setImageSpinner={setOwnerImageUploading}
                      editTrue="edit"
                      editedFileNameInitialValue={
                        formik?.values?.ownerImage
                          ? formik?.values?.ownerImage
                          : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue(
                          "ownerImage",
                          `${randomNumber}_${file}`
                        );
                        formik.setFieldValue("type", type);
                        setImageName(`${randomNumber}_${file}`);
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("ownerImage", "");
                        setImageName("");
                      }}
                    />
                  </Col>
                </Row>
                {/* fifth row */}
                <Row>
                  <Col md={1}>
                    <CustomRadioButton
                      name="isPregnant"
                      id="isPregnant1"
                      label="yes"
                    />
                  </Col>
                  <Col md={1}>
                    <CustomRadioButton
                      name="isPregnant"
                      id="isPregnant2"
                      label="no"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </FormikWrapper>
  );
};

export default AddCattleForm;
