import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import ImageUpload from "../partials/imageUpload";
import InputPasswordToggle from "@components/input-password-toggle";
import passwordEyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { getAllUserRoles } from "../../api/userApi";
import { useSelector } from "react-redux";
import { Prompt } from "react-router-dom";

const FormWaraper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNotice-btn {
    padding: 8px 20px;
    margin-left: 10px;
    margin-top: 5rem;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }
  .signInIconsIserAdminPassword {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    cursor: pointer;
  }
  label {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .input-group-merge {
    background-color: #fff7e8 !important;
  }
  #login-password {
    color: #583703 !important;
    padding-left: 2px;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 20px;
    ::placeholder {
      color: transparent;
    }
  }
  .input-group-text {
    background-color: #fff7e8 !important;
    border-bottom: 0 !important;
  }
  .checkBoxBorderBox {
    border: 2px solid #ff8744;
    padding: 1rem 2rem;
    border-radius: 10px;
  }
  .labelCheckBox {
    color: #ff8744 !important;
    font: normal normal bold 13px/26px Noto Sans;
  }
  .checkBoxInput {
    border-color: #ff8744;
    cursor: pointer;
  }
`;

export default function UserForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  vailidationSchema,
  initialValues,
  profileImageName,
  adduser,
  userRole,
  editProfile,
  showTimeInput,
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const categoryQuerClient = useQueryClient();

  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        categoryQuerClient.invalidateQueries(["Users"]);
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

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          categoryMutation.mutate({
            subAdminId: e?.Id,
            email: e?.email,
            mobileNumber: e.mobile.toString(),
            roles: e?.userRoleChacked,
            name: e.name,
            password: e?.password,
            profilePhoto: editProfile ? profileImageName : e?.file,
            // profilePhoto: e?.file,
          });
        }}
        validationSchema={vailidationSchema}
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
              <Col xs={12} className=" mt-2 ps-0 d-md-flex">
                <div className="me-3">
                  <ImageUpload
                    bg_plus={defaultAvtar}
                    profileImage
                    editTrue="edit"
                    editedFileNameInitialValue={
                      formik.values.file ? formik.values.file : null
                    }
                    randomNumber={randomNumber}
                    fileName={(file, type) => {
                      formik.setFieldValue("file", `${randomNumber}_${file}`);
                      formik.setFieldValue("type", type);
                      profileImageName = `${randomNumber}_${file}`;
                    }}
                    removeFile={(fileName) => {
                      formik.setFieldValue("file", "");
                      profileImageName = "";
                    }}
                  />
                </div>
                <Row className=" w-100 mt-3">
                  <Col xs={12} md={10}>
                    <Row>
                      <Col xs={12} sm={6} lg={4}>
                        <CustomTextField
                          label={t("user_name")}
                          name="name"
                          required
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 30))
                          }
                          autoFocus
                        />
                      </Col>
                      <Col xs={12} sm={6} lg={4}>
                        <CustomTextField
                          label={t("dashboard_Recent_DonorNumber")}
                          name="mobile"
                          type="number"
                          pattern="[6789][0-9]{9}"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 12))
                          }
                          required
                          />
                      </Col>
                      <Col xs={12} sm={6} lg={4}>
                        <CustomTextField
                          label={t("subscribed_user_email")}
                          name="email"
                          required
                        />
                      </Col>
                      {adduser && (
                        <Col xs={12} sm={6} lg={4} className="ps-1">
                          <label>
                            <Trans i18nKey={"user_password"}/>{`*`}
                          </label>
                          <InputPasswordToggle
                            className="input-group-merge"
                            name="password"
                            inputClassName=""
                            id="login-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            iconClassName="d-none"
                            hideIcon={
                              <img
                                className="signInIconsIserAdminPassword"
                                src={passwordEyeIcon}
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

                  <Row>
                    <Col xs={12}>
                      <div className="mb-1 mt-1" style={{ fontSize: "15px" }}>
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
                  className="addNotice-btn "
                  type="submit"
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
    </FormWaraper>
  );
}
