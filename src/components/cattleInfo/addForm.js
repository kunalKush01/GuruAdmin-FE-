import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { findAllCattle } from "../../api/cattle/cattleMedical";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import FormikRangeDatePicker from "../partials/FormikRangeDatePicker";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomRadioButton from "../partials/customRadioButton";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";

const FormikWrapper = styled.div`
  font: normal normal bold 15px/33px Noto Sans;
`;

const AddCattleForm = ({
  initialValues,
  countryFlag = "in",
  validationSchema,
  getMobile,
  getPurchaserMobile,
  handleSubmit,
  cattleType,
  cattleSource,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState(getMobile ?? "");
  const [purchaserNumber, setPurchaserNumber] = useState(
    getPurchaserMobile ?? ""
  );

  const [imageSpinner, setImageSpinner] = useState(false);
  const [ownerImageUploading, setOwnerImageUploading] = useState(false);

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const loadOption = async (tagId) => {
    const res = await findAllCattle({ cattleId: tagId });
    return res.results;
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["cattleList"]);
        setLoading(false);
        history.push("/cattle/info");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  return (
    <FormikWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          const {
            type,
            source,
            motherId,
            isDead,
            isPregnant,
            isSold,
            isMilking,
            ...formValues
          } = values;
          const data = {
            type: type?.value.toUpperCase(),
            source: source?.value.toUpperCase(),
            motherId: motherId?.tagId,
            isDead: isDead == "NO" ? false : true,
            isPregnant: isPregnant == "NO" ? false : true,
            isSold: isSold == "NO" ? false : true,
            isMilking: isMilking == "NO" ? false : true,
            ...formValues,
          };
          mutation.mutate(data);
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

            <Row className="paddingForm">
              <Col xs={12} md={10}>
                {/* First Row */}
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_tag_id")}
                      placeholder={t("placeHolder_cattle_tag_id")}
                      name="tagId"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="motherId"
                      labelKey="tagId"
                      valueKey="_id"
                      loadOptions={loadOption}
                      label={t("cattle_mother_id")}
                      placeholder={t("placeholder_cattle_mother_id")}
                      defaultOptions
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      labelName={t("dashboard_Recent_DonorType")}
                      placeholder={t("placeholder_cattle_type")}
                      name="type"
                      width="100%"
                      required
                      loadOptions={cattleType}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_breed")}
                      placeholder={t("placeHolder_cattle_breed")}
                      name="breed"
                      required
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
                      name="dob"
                      inline={false}
                      calculateAge
                      label={t("cattle_date_of_birth")}
                      dateFormat=" dd-MM-yyyy"
                      setFieldValue={formik.setFieldValue}
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_age")}
                      placeholder={t("placeHolder_cattle_age")}
                      name="age"
                      required
                      disabled
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="purchaseDate"
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
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="source"
                      loadOptions={cattleSource}
                      labelName={t("cattle_source")}
                      placeholder={t("placeHolder_cattle_source")}
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
                          "ownerCountryName",
                          country?.countryCode
                        );
                        formik.setFieldValue(
                          "ownerCountryCode",
                          country?.dialCode
                        );
                        formik.setFieldValue(
                          "ownerMobile",
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
                      name="ownerId"
                      required
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
                        formik?.values?.cattleImage
                          ? formik?.values?.cattleImage
                          : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue(
                          "cattleImage",
                          `${randomNumber}_${file}`
                        );
                        // formik.setFieldValue("type", type);
                        // setImageName(`${randomNumber}_${file}`);
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("cattleImage", "");
                        // setImageName("");
                      }}
                    />
                  </Col>

                  <Col md={3}>
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
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("ownerImage", "");
                      }}
                    />
                  </Col>
                </Row>
                {/* fifth row */}
                <Row className="pt-2">
                  <label>
                    <Trans i18nKey="cattle_is_dead" />
                  </label>
                  <Col md={1}>
                    <CustomRadioButton
                      name="isDead"
                      id="isDead1"
                      value="YES"
                      label="yes"
                    />
                  </Col>
                  <Col md={10}>
                    <CustomRadioButton
                      name="isDead"
                      id="isDead2"
                      value="NO"
                      label="no"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="deathDate"
                      inline={false}
                      label={t("cattle_date_death")}
                      dateFormat=" dd-MM-yyyy"
                    />
                  </Col>
                  <Col xs={12} md={8}>
                    <CustomTextField
                      label={t("cattle_death_reason")}
                      placeholder={t("placeHolder_cattle_death_reason")}
                      name="deathReason"
                      required
                    />
                  </Col>
                </Row>
                {/* sixth row */}
                <Row className="pt-2">
                  <label>
                    <Trans i18nKey="cattle_is_sold" />
                  </label>
                  <Col md={1}>
                    <CustomRadioButton
                      name="isSold"
                      id="isSold1"
                      value="YES"
                      label="yes"
                    />
                  </Col>
                  <Col md={10}>
                    <CustomRadioButton
                      name="isSold"
                      id="isSold2"
                      value="NO"
                      label="no"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_purchaser_name")}
                      placeholder={t("placeHolder_cattle_purchaser_name")}
                      name="purchaserName"
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomCountryMobileNumberField
                      value={purchaserNumber}
                      defaultCountry={countryFlag}
                      label={t("cattle_purchaser_number")}
                      placeholder={t("placeHolder_cattle_purchaser_number")}
                      onChange={(phone, country) => {
                        setPurchaserNumber(phone);
                        formik.setFieldValue(
                          "purchaserCountryCode",
                          country?.countryCode
                        );
                        formik.setFieldValue(
                          "purchaserDialCode",
                          country?.dialCode
                        );
                        formik.setFieldValue(
                          "purchaserMobile",
                          phone?.replace(country?.dialCode, "")
                        );
                      }}
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_purchaser_id")}
                      placeholder={t("placeHolder_cattle_purchaser_id")}
                      name="purchaserId"
                      required
                    />
                  </Col>

                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="soldDate"
                      inline={false}
                      label={t("cattle_sold_date")}
                      dateFormat=" dd-MM-yyyy"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_sold_price")}
                      type="number"
                      placeholder={t("placeHolder_cattle_sold_price")}
                      name="soldPrice"
                      required
                    />
                  </Col>
                </Row>
                {/* seventh row */}
                <Row className="pt-2">
                  <label>
                    <Trans i18nKey="cattle_is_milking" />
                  </label>
                  <Col md={1}>
                    <CustomRadioButton
                      name="isMilking"
                      id="isMilking1"
                      value="YES"
                      label="yes"
                    />
                  </Col>
                  <Col md={10}>
                    <CustomRadioButton
                      name="isMilking"
                      id="isMilking2"
                      value="NO"
                      label="no"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("cattle_milk_quantity")}
                      placeholder={t("placeHolder_cattle_milk_quantity")}
                      name="milkQuantity"
                      type="number"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 2))
                      }
                    />
                  </Col>
                </Row>
                {/* eighth row */}
                <Row className="pt-2">
                  <label>
                    <Trans i18nKey="cattle_is_pregnant" />
                  </label>
                  <Col md={1}>
                    <CustomRadioButton
                      name="isPregnant"
                      id="isPregnant1"
                      value="YES"
                      label="yes"
                    />
                  </Col>
                  <Col md={10}>
                    <CustomRadioButton
                      name="isPregnant"
                      id="isPregnant2"
                      value="NO"
                      label="no"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="deliveryDate"
                      inline={false}
                      label={t("cattle_delivery_date")}
                      dateFormat=" dd-MM-yyyy"
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      name="pregnantDate"
                      inline={false}
                      label={t("cattle_pregnancy_date")}
                      dateFormat=" dd-MM-yyyy"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="btn-Published mt-3">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="d-flex align-items-center m-auto"
                  type="submit"
                >
                  {!props.plusIconDisable && (
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                  )}
                  <span>
                    <Trans i18nKey={`${buttonName}`} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </FormikWrapper>
  );
};

export default AddCattleForm;
