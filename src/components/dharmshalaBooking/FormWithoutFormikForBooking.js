import { Form } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
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
import uploadIcon from "../../assets/images/icons/Thumbnail.svg";

export default function FormWithoutFormikForBooking({
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
    const Mobile = formik?.values?.Mobile?.toString();
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
      formik.setFieldValue("email", user?.email);
      formik.setFieldValue("guestname", user?.name);
      //formik.setFieldValue("address",user?.address);
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
    formik.setFieldValue("email", "");
    formik.setFieldValue("guestname", "");
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
      formik.setFieldValue("email", SelectedCommitmentId?.email);
      formik.setFieldValue("guestname", SelectedCommitmentId?.guestname);
    }
  }, [SelectedCommitmentId?._id]);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");

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
      <Row className="paddingForm">
        <Col xs={12}>
          <Row>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <Row>
                <Col xs={12} className="align-self-center">
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
              </Row>
            </Col>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <CustomTextField
                required
                label={t("Guest Name")}
                placeholder={t("guest_name")}
                name="guestname"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
              <Col xs={12} sm={6} lg={4} className=" pb-1"></Col>
              {noUserFound && (
                <div className="addUser">
                  {" "}
                  <Trans i18nKey={"add_user_donation"} />{" "}
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      history.push(
                        `/add-user?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}&redirect=donation`
                      )
                    }
                  >
                    <Trans i18nKey={"add_user"} />
                  </span>
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <CustomTextField
                label={t("Email")}
                placeholder={t("placeHolder_email")}
                name="email"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
            </Col>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <CustomTextField
                label={t("dashboard_Recent_DonorName")}
                placeholder={t("placeHolder_donar_name")}
                name="donarName"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} lg={4} className=" opacity-75 pb-1">
              <CustomTextField
                type="address"
                label={t("Address")}
                name="address"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <CustomTextField
                type="select"
                label={t("ID Type")}
                placeholder={t("placeHolder_Id_type")}
                name="id_type"
              />
            </Col>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <CustomTextField
                label={t("Id Number")}
                placeholder={t("placeHolder_id_number")}
                name="id_number"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 30))}
              />
            </Col>
            <Col xs={12} sm={6} lg={4} className=" pb-1">
              <input type="file" id="upload-id" className="upload-input" />
              <img src={uploadIcon} className="upload-icon" alt="Upload" />
              <label htmlFor="upload-id" className="upload-label">
                Upload ID Card
              </label>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
