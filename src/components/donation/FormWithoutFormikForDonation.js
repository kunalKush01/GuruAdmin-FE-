import { Form } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory, useLocation } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Row,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import { getAllSubCategories } from "../../api/expenseApi";
import {
  findAllComitmentByUser,
  findAllUsersByName,
  findAllUsersByNumber,
} from "../../api/findUser";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import { TextArea } from "../partials/CustomTextArea";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomRadioButton from "../partials/customRadioButton";
import CustomTextField from "../partials/customTextField";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import FormikCardDropdown from "../partials/FormikCardDropdown";
import { DatePicker } from "antd";
import "../../../src/assets/scss/common.scss";
import AddUserDrawerForm from "./addUserDrawerForm";
import { createSubscribedUser } from "../../api/subscribedUser";
import * as Yup from "yup";

export default function FormWithoutFormikForDonation({
  formik,
  masterloadOptionQuery,
  buttonName,
  paidDonation,
  getCommitmentMobile,
  countryFlag,
  payDonation,
  loading,
  article,
  setArticle,
  showPrompt,
  customFieldsList,
  ...props
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const { SelectedMasterCategory, SelectedSubCategory, Amount } = formik.values;
  const [subLoadOption, setSubLoadOption] = useState([]);
  const { SelectedUser, SelectedCommitmentId } = formik.values;
  const [commitmentIdByUser, setCommitmentIdByUser] = useState([]);
  const [noUserFound, setNoUserFound] = useState(false);

  const loadOption = async (name) => {
    const res = await findAllUsersByName({ name: name });
    return res.results;
  };
  useEffect(() => {
    const res = async () => {
      const apiRes = await getAllSubCategories({
        masterId: SelectedMasterCategory?.id,
      });
      setSubLoadOption(apiRes?.results);
    };
    SelectedMasterCategory && res();
  }, [SelectedMasterCategory]);

  useEffect(() => {
    const res = async () => {
      const apiRes = await findAllComitmentByUser({
        userId: paidDonation ?? SelectedUser?.userId,
      });

      setCommitmentIdByUser(apiRes?.results);
    };
    SelectedUser && res();
  }, [SelectedUser?.userId]);
  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile ?? "");

  useUpdateEffect(() => {
    if (formik?.values?.Mobile?.toString().length == 10) {
      const results = async () => {
        const res = await findAllUsersByNumber({
          mobileNumber: formik?.values?.Mobile.toString(),
        });
        if (res.result) {
          formik.setFieldValue("SelectedUser", res.result);
        } else {
          setNoUserFound(true);
        }
      };
      results();
    } else if (formik?.values?.Mobile?.toString().length !== 10) {
      formik.setFieldValue("SelectedUser", "");
    } else {
      setNoUserFound(false);
    }
  }, [formik?.values?.Mobile]);

  useUpdateEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user?.id) {
      formik.setFieldValue("Mobile", user?.mobileNumber);
      formik.setFieldValue("countryCode", user?.countryName);
      formik.setFieldValue("dialCode", user?.countryCode);
      formik.setFieldValue("donarName", user?.name);
      setPhoneNumber(user?.countryCode + user?.mobileNumber);
      return;
    }
    formik.setFieldValue("Mobile", "");
    formik.setFieldValue("countryCode", "");
    formik.setFieldValue("dialCode", "");
    formik.setFieldValue("donarName", "");
    formik.setFieldValue("SelectedMasterCategory", "");
    formik.setFieldValue("SelectedSubCategory", "");
    formik.setFieldValue("SelectedCommitmentId", "");
    formik.setFieldValue("Amount", "");
  }, [formik?.values?.SelectedUser]);

  useUpdateEffect(() => {
    if (SelectedCommitmentId) {
      formik.setFieldValue(
        "Amount",
        SelectedCommitmentId?.amount - SelectedCommitmentId?.paidAmount
      );
      formik.setFieldValue(
        "SelectedMasterCategory",
        SelectedCommitmentId?.masterCategoryId
      );
      formik.setFieldValue(
        "SelectedSubCategory",
        SelectedCommitmentId?.categoryId
      );
      formik.setFieldValue("donarName", SelectedCommitmentId?.donarName);
    }
  }, [SelectedCommitmentId?._id]);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const dialCodeFromURL = searchParams.get("dialCode");
  const mobileNumberFromURL = searchParams.get("mobileNumber");
  const name = searchParams.get("name");

  useEffect(() => {
    if (mobileNumberFromURL && dialCodeFromURL) {
      const fullPhoneNumber = `${dialCodeFromURL}${mobileNumberFromURL}`;
      setPhoneNumber(fullPhoneNumber);
      formik.setFieldValue("countryCode", dialCodeFromURL.replace("+", ""));
      formik.setFieldValue("dialCode", dialCodeFromURL);
      formik.setFieldValue("Mobile", mobileNumberFromURL);

      const fetchUserDetails = async () => {
        try {
          const res = await findAllUsersByNumber({
            mobileNumber: fullPhoneNumber,
          });
          if (res.result) {
            console.log(res);
            const userMobileNumberWithoutDialCode =
              res.result.mobileNumber.replace(dialCodeFromURL, "");
            res.result.mobileNumber = userMobileNumberWithoutDialCode;
            formik.setFieldValue("SelectedUser", res.result);
            formik.setFieldValue("donarName", res.result.name);
          } else {
            setNoUserFound(true);
            if (name) {
              formik.setFieldValue("donarName", decodeURIComponent(name));
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setNoUserFound(true);
          if (name) {
            formik.setFieldValue("donarName", decodeURIComponent(name));
          }
        }
      };

      fetchUserDetails();
    } else {
      console.log("Mobile number or dial code missing from URL");
    }
  }, [mobileNumberFromURL, dialCodeFromURL, name]);

  useEffect(() => {
    if (name) {
      formik.setFieldValue("donarName", decodeURIComponent(name));
    }
  }, [name]);

  //**add user drawer form */

  const handleCreateUser = async (payload) => {
    console.log(payload);
    // return;
    return createSubscribedUser(payload);
  };

  const schema = Yup.object().shape({
    mobile: Yup.string().required("users_mobile_required"),
    email: Yup.string()
      .email("email_invalid")
      .required("users_email_required")
      .trim(),
    name: Yup.string()
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
        "user_only_letters"
      )
      .required("users_title_required")
      .trim(),
    pincode: Yup.string().when("searchType", {
      is: "isPincode",
      then: Yup.string().max(6, "Pincode not found"),
      otherwise: Yup.string(),
    }),
  });
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <Form>
      {showPrompt && (
        <Prompt
          when={
            !!Object.values(formik?.values).find(
              (val, key) => !!val && key !== "Mobile"
            )
          }
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
            <Col xs={12} sm={6} lg={3}>
              <CustomCountryMobileNumberField
                value={phoneNumber}
                disabled={payDonation}
                defaultCountry={countryFlag}
                label={t("dashboard_Recent_DonorNumber")}
                placeholder={t("placeHolder_mobile_number")}
                onChange={(phone, country) => {
                  setPhoneNumber(phone);
                  formik.setFieldValue("countryCode", country?.countryCode);
                  formik.setFieldValue("dialCode", country?.dialCode);
                  formik.setFieldValue(
                    "Mobile",
                    phone?.replace(country?.dialCode, "")
                  );
                }}
                required
              />
              {formik.errors.Mobile && (
                <div
                  style={{
                    height: "20px",
                    font: "normal normal bold 11px/33px Noto Sans",
                  }}
                >
                  {formik.errors.Mobile && (
                    <div className="text-danger">
                      <Trans i18nKey={formik.errors.Mobile} />
                    </div>
                  )}
                </div>
              )}
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <AsyncSelectField
                name="SelectedUser"
                required
                loadOptions={loadOption}
                labelKey={"name"}
                valueKey={"id"}
                label={t("commitment_Username")}
                placeholder={t("categories_select_user_name")}
                defaultOptions
                disabled={payDonation || loadOption.length == 0}
              />
              {noUserFound && (
                <div className="addUser">
                  {" "}
                  <Trans i18nKey={"add_user_donation"} />{" "}
                  <span
                    className="cursor-pointer"
                    // onClick={() =>
                    //   history.push(
                    //     `/add-user?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}&redirect=donation&dialCode=${formik.values.dialCode}&mobileNumber=${formik.values.Mobile}`
                    //   )
                    // }
                    onClick={showDrawer}
                  >
                    <Trans i18nKey={"add_user"} />
                  </span>
                </div>
              )}
              <AddUserDrawerForm
                onClose={onClose}
                open={open}
                handleSubmit={handleCreateUser}
                addDonationUser
                initialValues={{
                  name: "",
                  countryCode: "in",
                  dialCode: "91",
                  email: "",
                  pincode: "",
                  searchType: "isPincode",
                  panNum: "",
                  addLine1: "",
                  addLine2: "",
                  city: "",
                  district: "",
                  state: "",
                  country: "",
                  pin: "",
                }}
                validationSchema={schema}
                buttonName={"add_user"}
                getNumber={phoneNumber}
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <CustomTextField
                label={t("dashboard_Recent_DonorName")}
                placeholder={t("placeHolder_donar_name")}
                name="donarName"
                value={formik.values.donarName}
                onChange={(e) => {
                  formik.setFieldValue(
                    "donarName",
                    e.target.value.slice(0, 30)
                  );
                }}
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <FormikCardDropdown
                labelName={t("dashboard_Recent_DonorCommitId")}
                options={commitmentIdByUser}
                placeholder={t("commitment_select_commitment_id")}
                name={"SelectedCommitmentId"}
                disabled={
                  payDonation || commitmentIdByUser?.length == 0 || article
                }
                getOptionValue={(option) => option._id}
                width="100%"
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <FormikCustomReactSelect
                labelName={t("categories_select_category")}
                name={"SelectedMasterCategory"}
                labelKey="name"
                valueKey="id"
                loadOptions={
                  masterloadOptionQuery?.data?.results &&
                  masterloadOptionQuery?.data?.results?.map((item) => {
                    return {
                      ...item,
                      name: ConverFirstLatterToCapital(item?.name),
                    };
                  })
                }
                required
                width={"100"}
                disabled={
                  masterloadOptionQuery?.data?.results == 0 ||
                  formik.values.SelectedCommitmentId !== ""
                }
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <FormikCustomReactSelect
                labelName={t("category_select_sub_category")}
                loadOptions={subLoadOption?.map((cate) => {
                  return {
                    ...cate,
                    name: ConverFirstLatterToCapital(cate.name),
                  };
                })}
                name={"SelectedSubCategory"}
                labelKey="name"
                valueKey="id"
                disabled={
                  subLoadOption?.length == 0 ||
                  formik?.values?.SelectedCommitmentId !== ""
                }
                width
              />
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={3}
              className=" opacity-75"
              style={{ display: "none" }}
            >
              <CustomTextField
                label={t("created_by")}
                name="createdBy"
                disabled
              />
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <CustomTextField
                type="number"
                label={t("categories_select_amount")}
                placeholder={t("enter_price_manually")}
                name="Amount"
                onInput={(e) =>
                  (e.target.value = e.target.value?.toLocaleString("en-IN"))
                }
                required
              />
            </Col>
            {customFieldsList.map((field) => {
              const isSelectField =
                field.masterValues && field.masterValues.length > 0;

              return (
                <Col xs={12} sm={6} lg={3} key={field._id}>
                  {field.fieldType === "Boolean" ? (
                    <FormikCustomReactSelect
                      labelName={field.fieldName}
                      name={`customFields.${field.fieldName}`}
                      loadOptions={[
                        { value: "", label: "Select Option" },
                        { value: true, label: "True" },
                        { value: false, label: "False" },
                      ]}
                      required={field.isRequired}
                      width
                      placeholder={`Select ${field.fieldName}`}
                    />
                  ) : field.fieldType === "Date" ? (
                    <>
                      <label style={{ fontSize: "15px" }}>
                        {field.fieldName}
                        {field.isRequired && "*"}
                      </label>
                      <DatePicker
                        id="datePickerANTD"
                        format="YYYY-MM-DD"
                        onChange={(date) => {
                          if (date) {
                            formik.setFieldValue(
                              `customFields.${field.fieldName}`,
                              date.format("YYYY-MM-DD")
                            );
                          } else {
                            formik.setFieldValue(
                              `customFields.${field.fieldName}`,
                              null
                            );
                          }
                        }}
                        // needConfirm
                      />
                      {formik.errors.customFields &&
                        formik.errors.customFields[field.fieldName] && (
                          <div
                            style={{
                              height: "20px",
                              font: "normal normal bold 11px/33px Noto Sans",
                            }}
                          >
                            <div className="text-danger">
                              <Trans
                                i18nKey={
                                  formik.errors.customFields[field.fieldName]
                                }
                              />
                            </div>
                          </div>
                        )}
                    </>
                  ) : isSelectField ? (
                    <FormikCustomReactSelect
                      labelName={field.fieldName}
                      name={`customFields.${field.fieldName}`}
                      loadOptions={
                        field.masterValues &&
                        field.masterValues.map((item) => ({
                          value: item.value,
                          label: item.value,
                        }))
                      }
                      width
                      required={field.isRequired}
                      placeholder={`Select ${field.fieldName}`}
                      valueKey="value"
                      labelKey="label"
                    />
                  ) : (
                    <CustomTextField
                      label={field.fieldName}
                      name={`customFields.${field.fieldName}`}
                      type={
                        field.fieldType === "String"
                          ? "text"
                          : field.fieldType.toLowerCase()
                      }
                      required={field.isRequired}
                      placeholder={`Enter ${field.fieldName}`}
                    />
                  )}
                </Col>
              );
            })}
          </Row>

          {/* <Row>
            {!payDonation && (
              <Col xs={12} sm={6} lg={5}>
                <Row>
                  <label style={{ fontSize: "15px" }}>
                    <Trans i18nKey="is_government" />
                  </label>
                  <Col md={2}>
                    <CustomRadioButton
                      name="isGovernment"
                      id="isGovernment1"
                      value="YES"
                      label="yes"
                    />
                  </Col>
                  <Col md={2}>
                    <CustomRadioButton
                      name="isGovernment"
                      id="isGovernment2"
                      value="NO"
                      label="no"
                    />
                  </Col>
                </Row>
              </Col>
            )}
          </Row> */}

          {!location.pathname.includes("/pay-donation") && (
            <>
              <Row>
                <Col xs={12}>
                  <div className="d-flex align-items-center gap-1">
                    <Trans i18nKey="article_donation" />
                    <FormGroup switch id="articleDaan">
                      <Input
                        type="switch"
                        checked={article}
                        role="switch"
                        onChange={(e) => {
                          formik.setFieldValue("SelectedCommitmentId", "");
                          setArticle(!article);
                        }}
                      />
                      <UncontrolledTooltip placement="top" target="articleDaan">
                        Enable article daan
                      </UncontrolledTooltip>
                    </FormGroup>
                  </div>
                  {article && (
                    <hr
                      style={{
                        height: "3px",
                        borderRadius: "#c7c7c7",
                        background: "gray",
                        marginTop: 0,
                      }}
                    />
                  )}
                </Col>
              </Row>
              {article && (
                <Row>
                  <Col xs={12} sm={6} lg={3}>
                    <CustomTextField
                      label={t("Article Type")}
                      name="articleType"
                      placeholder={t(
                        "Enter Article Type (i.e. Gold, Silver, etc..)"
                      )}
                    />
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <CustomTextField
                      label={t("Article Item")}
                      name="articleItem"
                      placeholder={t("Enter Article Item")}
                    />
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <CustomTextField
                      label={t("Article Weight")}
                      name="articleWeight"
                      placeholder={t("Enter Article Weight")}
                    />
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <FormikCustomReactSelect
                      labelName={t("Article Unit")}
                      name="articleUnit"
                      placeholder={t("Enter Article Unit")}
                      width="100"
                      loadOptions={[
                        {
                          label: "Kilo Gram",
                          value: "kg",
                        },
                        {
                          label: "Gram",
                          value: "gm",
                        },
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <CustomTextField
                      label={t("Article Quantity")}
                      name="articleQuantity"
                      placeholder={t("Enter Article Quantity")}
                    />
                  </Col>
                  <Col xs={12}>
                    <TextArea
                      name="remarks"
                      placeholder={t("Enter Remarks here")}
                      label={t("Remarks")}
                      rows="6"
                    />
                  </Col>
                </Row>
              )}
            </>
          )}
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
          <Button color="primary" className="addAction-btn " type="submit">
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
  );
}
