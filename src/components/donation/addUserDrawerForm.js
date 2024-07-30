import { Drawer } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { CloudLightning, Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import CustomTextField from "../partials/customTextField";
import "../../assets/scss/common.scss";
import { TextArea } from "../partials/CustomTextArea";
import pincodes from "indian-pincodes";
import CustomRadioButton from "../partials/customRadioButton";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { Country, State, City } from "country-state-city";
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
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const redirectTo = searchParams.get("redirect");
  const dialCodeFromUrl = searchParams.get("dialCode");
  const mobileNumberFromUrl = searchParams.get("mobileNumber");

  const categoryQueryClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        addDonationUser
          ? categoryQueryClient.invalidateQueries(["donations"])
          : categoryQueryClient.invalidateQueries(["subscribedUser"]);
        setLoading(false);
        addDonationUser
          ? history.push(
              `/${redirectTo}/add?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}}&dialCode=${encodeURIComponent(
                dialCode
              )}&mobileNumber=${encodeURIComponent(
                mobileNumber
              )}&name=${encodeURIComponent(name)}`
            )
          : history.push("/subscribed-user");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(getNumber);
  const [dialCode, setDialCode] = useState(dialCodeFromUrl || "");
  const [mobileNumber, setMobileNumber] = useState(mobileNumberFromUrl || "");
  const [name, setName] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [districtPincode, setDistrictPincode] = useState([]);
  useEffect(() => {
    const fetchedCountry = Country.getAllCountries();
    const formattedCountry = fetchedCountry.map((country) => ({
      name: country.name,
      id: country.isoCode,
    }));
    const districtPincodes = pincodes.getPincodesByDistrict("Agra");
    console.log(districtPincodes);
    setCountry(formattedCountry);
  }, []);

  return (
    <Drawer title="Add User" onClose={onClose} open={open} size="medium">
      <div className="">
        <Formik
          // enableReinitialize
          initialValues={{
            ...initialValues,
            mobile: getNumber || initialValues.mobile,
          }}
          onSubmit={(e) => {
            setShowPrompt(false);
            setLoading(true);
            categoryMutation.mutate({
              email: e.email,
              mobileNumber: e.mobile.toString(),
              countryCode: e?.dialCode,
              countryName: e?.countryCode,
              name: e.name,
              pincode: e.pincode,
              searchType: e.searchType,
              panNum: e.panNum,
              addLine1: e.addLine1,
              addLine2: e.addLine2,
              city: e.city,
              district: e.district,
              state: e.state,
              country: e.country,
              pin: e.pin,
            });
          }}
          validationSchema={validationSchema}
        >
          {(formik) => {
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
                  const selectedCity = city.find(
                    (c) => c.name === details.district
                  );
                  const selectedPIN = formattedPincodes.find(
                    (c) => c.name === details.pincode
                  );

                  formik.setFieldValue("city", selectedCity || "");
                  formik.setFieldValue("district", details.district || "");
                  formik.setFieldValue("country", selectedCountry || "");
                  formik.setFieldValue("pin", selectedPIN || "");
                  formik.setFieldValue("state", selectedState || "");
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
                formik.setFieldValue("state", null);
                formik.setFieldValue("city", null);
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
                            setName(e.target.value);
                          }}
                          autoFocus
                        />
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <CustomCountryMobileNumberField
                          value={getNumber}
                          label={t("dashboard_Recent_DonorNumber")}
                          defaultCountry={initialValues?.countryCode ?? "IN"}
                          placeholder={t("placeHolder_mobile_number")}
                          onChange={(phone, country) => {
                            setPhoneNumber(phone);
                            setDialCode(country?.dialCode);
                            setMobileNumber(
                              phone?.replace(country?.dialCode, "")
                            );
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
                            style={{
                              height: "20px",
                              font: "normal normal bold 11px/33px Noto Sans",
                            }}
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
                          required
                        />
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <CustomTextField
                          label="PAN"
                          name="panNum"
                          placeholder={t("placeHolder_pan")}
                        />
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
                                  label="Pincode"
                                />
                              </Col>
                              <Col xs={12} sm={6} md={6}>
                                <CustomRadioButton
                                  name="searchType"
                                  id="isGoogleMap"
                                  value="isGoogleMap"
                                  label="GoogleMap"
                                />
                              </Col>
                              {formik.values.searchType === "isPincode" && (
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
                                  />
                                </Col>
                              )}
                            </Row>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <CustomTextField
                          label="Address Line 1(House no)"
                          name="addLine1"
                          placeholder=""
                        />
                      </Col>{" "}
                      <Col xs={12} sm={6} md={6}>
                        <CustomTextField
                          label="Address Line 2"
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
                          disabled={!formik.values.state}
                          width
                        />
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <CustomTextField
                          label="District"
                          name="district"
                          placeholder="Enter District"
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
                <Button
                      color="primary"
                      className="addAction-btn "
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
                  {/* {loading ? (
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
                      className="addAction-btn "
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
                  )} */}
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
