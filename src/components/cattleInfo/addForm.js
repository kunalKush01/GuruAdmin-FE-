import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import '../../../src/styles/common.scss';

import {
  findAllCattle,
  findAllCattleBreed,
  findAllCattleCategory,
} from "../../api/cattle/cattleMedical";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomRadioButton from "../partials/customRadioButton";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const FormikWrapper = styled.div``;
;

const AddCattleForm = ({
  initialValues,
  countryFlag = "in",
  validationSchema,
  getMobile,
  getPurchaserMobile,
  handleSubmit,
  cattleType,
  breedType,
  cattleSource,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cattleImageName, setCattleImageName] = useState(props.cattleImageName);
  const [ownerImageName, setOwnerImageName] = useState(props.ownerImageName);

  const [phoneNumber, setPhoneNumber] = useState(getMobile ?? "");
  const [purchaserNumber, setPurchaserNumber] = useState(
    getPurchaserMobile ?? ""
  );

  const [imageSpinner, setImageSpinner] = useState(false);
  const [ownerImageUploading, setOwnerImageUploading] = useState(false);
  const [breedList, setBreedList] = useState([]);

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const loadOption = async (tagId) => {
    const res = await findAllCattle({ cattleId: tagId });
    return res.results;
  };

  const categoriesLoadOption = async (category) => {
    const res = await findAllCattleCategory({ name: category });
    return res.results?.map((item) => {
      return { ...item, name: ConverFirstLatterToCapital(item?.name ?? "") };
    });
  };

  const breedLoadOption = async (breed, categoryId) => {
    const res = await findAllCattleBreed({
      cattleCategoryId: categoryId,
      name: breed,
    });

    setBreedList(
      res.results?.map((item) => {
        return { ...item, name: ConverFirstLatterToCapital(item?.name ?? "") };
      })
    );
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
    <div className="formikwrapper">
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
            soldDate,
            deathDate,
            deliveryDate,
            pregnancyDate,
            isSold,
            isMilking,
            cattleImage,
            ownerImage,
            breed,
            ...formValues
          } = values;
          const data = {
            typeId: type?._id,
            breedId: breed?._id,
            source: source?.value.toUpperCase(),
            motherId: motherId?.tagId,
            isDead: isDead == "NO" ? false : true,
            deathDate: isDead == "YES" ? deathDate : "",
            isPregnant: isPregnant == "NO" ? false : true,
            pregnancyDate: isPregnant == "YES" ? pregnancyDate : "",
            deliveryDate: isPregnant == "YES" ? deliveryDate : "",
            isSold: isSold == "NO" ? false : true,
            soldDate: isSold == "YES" ? soldDate : "",
            isMilking: isMilking == "NO" ? false : true,
            cattleImage: props.editThumbnail
              ? cattleImageName
              : values.cattleImage,
            ownerImage: props.editThumbnail
              ? ownerImageName
              : values.ownerImage,
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
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <AsyncSelectField
                      name="type"
                      labelKey="name"
                      valueKey="_id"
                      loadOptions={categoriesLoadOption}
                      onChange={async (e) => {
                        formik.setFieldValue("type", e);
                        await breedLoadOption("", e?._id);
                      }}
                      label={t("categories_select_category")}
                      placeholder={t("placeholder_cattle_type")}
                      defaultOptions
                      required
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <FormikCustomReactSelect
                      name="breed"
                      isSearchable
                      loadOptions={breedList}
                      required
                      labelKey="name"
                      valueKey="_id"
                      labelName={t("cattle_breed")}
                      placeholder={t("placeHolder_cattle_breed")}
                      width="100%"
                    />
                  </Col>
                </Row>
                {/* second row */}
                <Row>
                  <Col xs={12} md={4}>
                    <FormikCustomDatePicker
                      futureDateNotAllowed
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
                      futureDateNotAllowed
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
                    {formik.errors.ownerMobile && (
                      <div
                        style={{
                          height: "20px",
                          font: "normal normal bold 11px/33px Noto Sans",
                        }}
                      >
                        {formik.errors.ownerMobile && (
                          <div className="text-danger">
                            <Trans i18nKey={formik.errors.ownerMobile} />
                          </div>
                        )}
                      </div>
                    )}
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
                      imageName="CattleImage"
                      editTrue="edit"
                      editedFileNameInitialValue={
                        formik?.values?.cattleImage
                          ? formik?.values?.cattleImage
                          : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue("cattleImage", `${file}`);
                        setCattleImageName(`${file}`);
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("cattleImage", "");
                        setCattleImageName("");
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
                      imageName="OwnerImage"
                      setImageSpinner={setOwnerImageUploading}
                      editTrue="edit"
                      editedFileNameInitialValue={
                        formik?.values?.ownerImage
                          ? formik?.values?.ownerImage
                          : null
                      }
                      randomNumber={randomNumber}
                      fileName={(file, type) => {
                        formik.setFieldValue("ownerImage", `${file}`);
                        setOwnerImageName(`${file}`);
                      }}
                      removeFile={(fileName) => {
                        formik.setFieldValue("ownerImage", "");
                        setOwnerImageName("");
                      }}
                    />
                  </Col>
                </Row>
                {/* fifth row */}
                {props.editThumbnail && (
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
                        customOnChange={() =>
                          formik.setFieldValue("deathReason", "")
                        }
                      />
                    </Col>
                    {/* {formik.values.isDead === "YES" ? ( */}
                    <Row
                      className="overflow-hidden animated-height"
                      style={{
                        height: formik.values.isDead === "YES" ? "95px" : "0px",
                      }}
                    >
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
                    {/* ) : (
                    ""
                  )} */}
                  </Row>
                )}
                {/* sixth row */}
                {props.editThumbnail && (
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
                        customOnChange={() => {
                          formik.setFieldValue("purchaserName", "");
                          formik.setFieldValue("purchaserMobile", "");
                          formik.setFieldValue("purchaserId", "");
                          formik.setFieldValue("soldPrice", "");
                        }}
                      />
                    </Col>
                    <Row
                      className="overflow-hidden animated-height"
                      style={{
                        height:
                          formik.values.isSold === "YES" ? "195px" : "0px",
                      }}
                    >
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
                              "purchaserCountryName",
                              country?.countryCode
                            );
                            formik.setFieldValue(
                              "purchaserCountryCode",
                              country?.dialCode
                            );
                            formik.setFieldValue(
                              "purchaserMobile",
                              phone?.replace(country?.dialCode, "")
                            );
                          }}
                          required
                        />
                        {formik.errors.purchaserMobile && (
                          <div
                            style={{
                              height: "20px",
                              font: "normal normal bold 11px/33px Noto Sans",
                            }}
                          >
                            {formik.errors.purchaserMobile && (
                              <div className="text-danger">
                                <Trans
                                  i18nKey={formik.errors.purchaserMobile}
                                />
                              </div>
                            )}
                          </div>
                        )}
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
                  </Row>
                )}
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
                      customOnChange={() => {
                        formik.setFieldValue("milkQuantity", "");
                      }}
                    />
                  </Col>

                  <Col
                    xs={12}
                    md={4}
                    className="overflow-hidden animated-height"
                    style={{
                      height:
                        formik.values.isMilking === "YES" ? "95px" : "0px",
                    }}
                  >
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
                  <Row
                    className="overflow-hidden animated-height"
                    style={{
                      height:
                        formik.values.isPregnant === "YES" ? "80px" : "0px",
                    }}
                  >
                    <Col xs={12} md={4}>
                      <FormikCustomDatePicker
                        name="pregnancyDate"
                        inline={false}
                        label={t("cattle_pregnancy_date")}
                        dateFormat=" dd-MM-yyyy"
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
                  </Row>
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
    </div>
  );
};

export default AddCattleForm;
