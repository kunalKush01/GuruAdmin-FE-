import InputPasswordToggle from "@components/input-password-toggle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { getAllUserRoles } from "../../api/userApi";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import hidePassIcon from "../../assets/images/icons/signInIcon/hidePassIcon.svg";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";
import '../../../src/styles/common.scss';

const FormWrapper = styled.div``;
;

export default function UserForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  validationSchema,
  initialValues,
  profileImageName,
  adduser,
  userRole,
  editProfile,
  showTimeInput,
  getUserMobile,
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const userQueryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        userQueryClient.invalidateQueries(["Users"]);
        setLoading(false);
        history.push("/configuration/users");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const userRoleQuery = useQuery(
    ["userRoles", selectedLang.id],
    async () =>
      await getAllUserRoles({
        languageId: selectedLang.id,
      })
  );
  const userRolesItems = useMemo(
    () => userRoleQuery?.data?.results ?? [],
    [userRoleQuery]
  );

  const userRoleIds = userRolesItems?.map((item) => item._id);
  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
  const [showPrompt, setShowPrompt] = useState(true);
  const [imageSpinner, setImageSpinner] = useState(false);
  const [imageName, setImageName] = useState(profileImageName);
  const [phoneNumber, setPhoneNumber] = useState(getUserMobile ?? "");

  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          userMutation.mutate({
            subAdminId: e?.Id,
            email: e?.email,
            mobileNumber: e.mobile.toString(),
            countryCode: e?.dialCode,
            countryName: e?.countryCode,
            roles: e?.userRoleChacked,
            name: e.name,
            password: e?.password,
            profilePhoto: editProfile ? imageName : e?.file,
            // profilePhoto: e?.file,
          });
        }}
        validationSchema={validationSchema}
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
              <Col xs={12} className=" mt-2 ps-0 d-md-flex">
                <div className="me-3">
                  <ImageUpload
                    bg_plus={defaultAvtar}
                    imageSpinner={imageSpinner}
                    setImageSpinner={setImageSpinner}
                    profileImage
                    imageName="UserProfileImage"
                    acceptFile="image/*"
                    svgNotSupported
                    editTrue="edit"
                    editedFileNameInitialValue={
                      formik.values.file ? formik.values.file : null
                    }
                    randomNumber={randomNumber}
                    fileName={(file, type) => {
                      formik.setFieldValue("file", `${file}`);
                      formik.setFieldValue("type", type);
                      setImageName(`${file}`);
                    }}
                    removeFile={(fileName) => {
                      formik.setFieldValue("file", "");
                      setImageName("");
                    }}
                  />
                </div>
                <Row className=" w-100 mt-3">
                  <Col xs={12} md={10}>
                    <Row>
                      <Col xs={12} sm={6} lg={4}>
                        <CustomTextField
                          label={t("user_name")}
                          placeholder={t("placeHolder_user_name")}
                          name="name"
                          required
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 30))
                          }
                          autoFocus
                        />
                      </Col>
                      <Col xs={12} sm={6} lg={4}>
                        <CustomCountryMobileNumberField
                          value={phoneNumber}
                          label={t("dashboard_Recent_DonorNumber")}
                          defaultCountry={initialValues?.countryCode}
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
                        {/* <CustomTextField
                          label={t("dashboard_Recent_DonorNumber")}
                          placeholder={t("placeHolder_mobile_number")}
                          name="mobile"
                          type="number"
                          pattern="[6789][0-9]{9}"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 12))
                          }
                          required
                        /> */}
                      </Col>
                      <Col xs={12} sm={6} lg={4}>
                        <CustomTextField
                          label={t("subscribed_user_email")}
                          name="email"
                          placeholder={t("placeHolder_email")}
                          required
                        />
                      </Col>
                      {adduser && (
                        <Col xs={12} sm={6} lg={4} className="ps-1">
                          <label>
                            <Trans i18nKey={"user_password"} />
                            {`*`}
                          </label>
                          <InputPasswordToggle
                            className="input-group-merge"
                            name="password"
                            placeholder={t("placeHolder_password")}
                            inputClassName=""
                            id="login-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            iconClassName="d-none"
                            hideIcon={
                              <img
                                className="signInIconsIserAdminPassword"
                                src={hidePassIcon}
                              />
                            }
                            showIcon={
                              <img
                                className="signInIconsIserAdminPassword"
                                src={passwordEyeIcon}
                              />
                            }
                          />
                          <div
                            style={{
                              height: "20px",
                              font: "normal normal bold 11px/15px Noto Sans",
                            }}
                          >
                            {formik.errors.password &&
                              formik.touched.password && (
                                <div className="text-danger">
                                  <Trans i18nKey={formik.errors.password} />
                                </div>
                              )}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Col>

                  <Row className="mb-5 pb-2">
                    <Col xs={12}>
                      <div className=" mt-1" style={{ fontSize: "15px" }}>
                        <Trans i18nKey={"user_userRole"} />*
                      </div>
                      <div
                        style={{
                          height: "20px",
                          font: "normal normal bold 11px/15px Noto Sans",
                        }}
                      >
                        {formik.errors.userRoleChacked &&
                          formik.touched.userRoleChacked && (
                            <div className="text-danger">
                              <Trans i18nKey={formik.errors.userRoleChacked} />
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col xs={12} className="">
                      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 ">
                        <Col className="">
                          <div className="checkBoxBorderBox mt-1">
                            <FormGroup
                              check
                              className="align-items-center d-flex "
                            >
                              <Input
                                id="exampleCheckbox"
                                name="checked"
                                type="checkbox"
                                checked={
                                  userRoleIds?.length ===
                                  formik?.values?.userRoleChacked?.length
                                }
                                className="me-1 checkBoxInput"
                                onChange={(e) =>
                                  e.target.checked
                                    ? formik.setFieldValue(
                                        "userRoleChacked",
                                        userRoleIds
                                      )
                                    : formik.setFieldValue(
                                        "userRoleChacked",
                                        []
                                      )
                                }
                              />
                              <Label
                                check
                                for="exampleCheckbox"
                                className="labelCheckBox"
                              >
                                All
                              </Label>
                            </FormGroup>
                          </div>
                        </Col>
                        {userRolesItems?.map((item) => {
                          return (
                            <Col key={item?.id}>
                              <div className="checkBoxBorderBox mt-1">
                                <FormGroup
                                  check
                                  className="align-items-center d-flex"
                                >
                                  <Input
                                    id={item?._id}
                                    name="userRoleChacked"
                                    tag={Field}
                                    type="checkbox"
                                    className="me-1 checkBoxInput"
                                    value={item?._id}
                                  />
                                  <Label
                                    check
                                    for={item?._id}
                                    className="labelCheckBox"
                                  >
                                    {item?.name}
                                  </Label>
                                </FormGroup>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published ">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                    marginTop: "5rem",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="addNotice-btn"
                  type="submit"
                  disabled={imageSpinner}
                >
                  {plusIconDisable && (
                    <span>
                      <Plus className="me-1" size={15} strokeWidth={4} />
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
}
