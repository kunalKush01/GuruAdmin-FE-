import { Drawer } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import {  } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import CustomTextField from "../partials/customTextField";
import "../../assets/scss/common.scss";
import pincodes from "indian-pincodes";
import CustomRadioButton from "../partials/customRadioButton";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { Country, State, City } from "country-state-city";
import CustomFieldLocationForDonationUser from "../partials/customFieldLocationForDonationUser";
function AddUserDrawerForm({
  onClose,
  open,
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  validationSchema,
  initialValues,
  showTimeInput,
  getNumber,
  addDonationUser,
  onSuccess,
  buttonName = "",
  ...props
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const categoryQueryClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        addDonationUser
          ? categoryQueryClient.invalidateQueries(["donations"])
          : categoryQueryClient.invalidateQueries(["subscribedUser"]);
        setLoading(false);
        onSuccess(true);
        onClose();
      } else if (data?.error) {
        setLoading(false);
        onSuccess(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [districtPincode, setDistrictPincode] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(getNumber ?? "");
  useEffect(() => {
    setPhoneNumber(getNumber ?? "");
  }, [getNumber]);
  useEffect(() => {
    const fetchedCountry = Country.getAllCountries();
    const formattedCountry = fetchedCountry.map((country) => ({
      name: country.name,
      id: country.isoCode,
    }));
    setCountry(formattedCountry);
  }, []);
  return (
    <Drawer title="Add User" onClose={onClose} open={open} width={500}>
      <div className="">
        <Formik
          initialValues={{
            ...initialValues,
            mobile: getNumber || initialValues.mobile,
          }}
          onSubmit={(e) => {
            setShowPrompt(false);
            setLoading(true);

            // Prepare payload
            const payload = {
              ...e,
              email: e.email?.trim() || null,
              mobileNumber: e.mobile
                .toString()
                .replace(new RegExp(`^${e.dialCode}`), ""),
              countryCode: "+" + e?.dialCode,
              countryName: e?.countryCode,
              name: e.name,
              pincode: e.pincode,
              searchType: e.searchType,
              panNum: e.panNum,
              addLine1: e.addLine1,
              addLine2: e.addLine2,
              city: e.city?.name,
              district: e.district,
              state: e.state?.name,
              country: e.country?.name,
              pin: e.pin?.name,
            };

            categoryMutation.mutate(payload);
          }}
          validationSchema={validationSchema}
        >
          {(formik) => {
            useEffect(() => {
              if (formik.values.location) {
                formik.setFieldValue("pincode", "");
              }
            }, [formik.values.location]);
            useEffect(() => {
              if (formik.values.pincode) {
                formik.setFieldValue("location", "");
              }
            }, [formik.values.pincode]);
            useEffect(() => {
              if (formik.values.district) {
                const districtPincodes = pincodes.getPincodesByDistrict(
                  formik.values.district.split(" ")[0]
                );
                if (
                  Array.isArray(districtPincodes) &&
                  districtPincodes.length > 0
                ) {
                  const uniquePincodes = districtPincodes.reduce(
                    (acc, current) => {
                      const isDuplicate = acc.find(
                        (item) => item.pincode === current.pincode
                      );
                      if (!isDuplicate) {
                        acc.push(current);
                      }
                      return acc;
                    },
                    []
                  );

                  const formattedPincodes = uniquePincodes.map((code) => ({
                    name: code.pincode,
                    id: code.pincode,
                  }));
                  setDistrictPincode(formattedPincodes);
                } else {
                  setDistrictPincode([]);
                }
              }
            }, [formik.values.district, formik.values.location]);

            useEffect(() => {
              if (formik.values.pincode) {
                const details = pincodes.getPincodeDetails(
                  Number(formik.values.pincode)
                );
                if (details) {
                  const districtPincodes = pincodes.getPincodesByDistrict(
                    details.district
                  );
                  const uniquePincodes = districtPincodes.reduce(
                    (acc, current) => {
                      const isDuplicate = acc.find(
                        (item) => item.pincode === current.pincode
                      );
                      if (!isDuplicate) {
                        acc.push(current);
                      }
                      return acc;
                    },
                    []
                  );

                  const formattedPincodes = uniquePincodes.map((code) => ({
                    name: code.pincode,
                    id: code.pincode,
                  }));
                  setDistrictPincode(formattedPincodes);
                  const selectedCountry = country.find(
                    (c) => c.name === details.country
                  );
                  const selectedState = states.find(
                    (c) => c.name === details.state
                  );
                  const selectedCity = city.find((c) =>
                    details.region.includes(c.name.trim())
                  );
                  const selectedPIN = formattedPincodes.find(
                    (c) => c.name === details.pincode
                  );

                  formik.setFieldValue("city", selectedCity || "");
                  formik.setFieldValue("district", details.district || "");
                  formik.setFieldValue("country", selectedCountry || "");
                  formik.setFieldValue("pin", selectedPIN || "");
                  formik.setFieldValue("state", selectedState || "");
                } else {
                  formik.setFieldValue("city", "");
                  formik.setFieldValue("district", "");
                  formik.setFieldValue("country", "");
                  formik.setFieldValue("pin", "");
                  formik.setFieldValue("state", "");
                }
              }
            }, [formik.values.pincode, country, pincodes, states, city]);
            useEffect(() => {
              if (formik.values.country) {
                const fetchedStates = State.getStatesOfCountry(
                  formik.values.country.id
                );
                const formattedStates = fetchedStates.map((state) => ({
                  name: state.name,
                  id: state.isoCode,
                }));
                setStates(formattedStates);
                {
                  /* formik.setFieldValue("state", null); */
                }
                {
                  /* formik.setFieldValue("city", null); */
                }
              } else {
                setStates([]);
                setCity([]);
              }
            }, [formik.values.country]);
            useEffect(() => {
              if (formik.values.state) {
                const fetchedCities = City.getCitiesOfState(
                  formik.values.country.id,
                  formik.values.state.id
                );
                const formattedCities = fetchedCities.map((city) => ({
                  name: city.name,
                  id: city.name,
                }));
                setCity(formattedCities);
              } else {
                setCity([]);
              }
            }, [formik.values.state]);
            return (
              <Form>
                {/* {showPrompt && (
                  <
                    when={!!Object.values(formik?.values).find((val) => !!val)}
                    message={(location) =>
                      `Are you sure you want to leave this page & visit ${location.pathname.replace(
                        "/",
                        ""
                      )}`
                    }
                  />
                )} */}
                <Row>
                  <Col xs={12}>
                    <Row>
                      <Col xs={12} sm={6} md={6}>
                        <CustomTextField
                          label={t("user_name")}
                          placeholder={t("placeHolder_user_name")}
                          name="name"
                          required
                          onInput={(e) => {
                            e.target.value = e.target.value.slice(0, 30);
                          }}
                          autoFocus
                        />
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <CustomCountryMobileNumberField
                          value={phoneNumber}
                          label={t("dashboard_Recent_DonorNumber")}
                          defaultCountry={initialValues?.countryCode ?? "India"}
                          placeholder={t("placeHolder_mobile_number")}
                          onChange={(phone, country) => {
                            setPhoneNumber(phone);
                            formik.setFieldValue(
                              "countryCode",
                              country?.countryCode
                            );
                            formik.setFieldValue("dialCode", country?.dialCode);
                            formik.setFieldValue(
                              "mobile",
                              phone?.replace(country?.dialCode, "")
                            );
                          }}
                          required
                        />
                        {formik.errors.mobile && (
                          <div
                          // style={{
                          //   height: "20px",
                          //   font: "normal normal bold 11px Noto Sans",
                          // }}
                          >
                            {formik.errors.mobile && (
                              <div className="text-danger">
                                <Trans i18nKey={formik.errors.mobile} />
                              </div>
                            )}
                          </div>
                        )}
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <CustomTextField
                          label={t("subscribed_user_email")}
                          name="email"
                          placeholder={t("placeHolder_email")}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <div className="d-flex flex-column">
                          <CustomTextField
                            label="PAN"
                            name="panNum"
                            placeholder={t("placeHolder_pan")}
                            // required
                          />
                        </div>
                      </Col>
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
                              setDistrictPincode(null);
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
                              setDistrictPincode([]);
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
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  {loading ? (
                    <Button
                      color="primary"
                      className="add-trust-btn mt-3"
                      disabled
                    >
                      <Spinner size="md" />
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      className="addAction-btn mt-3"
                      type="submit"
                      style={{ width: "100%" }}
                    >
                      {plusIconDisable && (
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
            );
          }}
        </Formik>
      </div>
    </Drawer>
  );
}

export default AddUserDrawerForm;
