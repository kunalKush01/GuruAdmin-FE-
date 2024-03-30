import { Form } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import { Button, Col, Row, Spinner } from "reactstrap";
import { getAllSubCategories } from "../../api/expenseApi";
import { findAllUsersByName, findAllUsersByNumber } from "../../api/findUser";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomCountryMobileNumberField from "../partials/CustomCountryMobileNumberField";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";

export default function FormWithoutFormikForCommitment({
  formik,
  masterloadOptionQuery,
  buttonName,
  showTimeInput,
  editCommitment,
  loading,
  countryFlag,
  getCommitmentMobile,
  showPrompt,
  ...props
}) {
  const { t } = useTranslation();

  const { SelectedMasterCategory } = formik.values;
  const [subLoadOption, setSubLoadOption] = useState([]);
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

  const [phoneNumber, setPhoneNumber] = useState(getCommitmentMobile);

  useUpdateEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user?.id) {
      formik.setFieldValue("Mobile", user.mobileNumber);
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
  }, [formik?.values?.SelectedUser]);

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
        <Col xs={12} lg={!editCommitment ? 6 : 8}>
          <Row>
            <Col xs={12} sm={6}>
              <CustomCountryMobileNumberField
                value={phoneNumber}
                label={t("dashboard_Recent_DonorNumber")}
                defaultCountry={countryFlag}
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
            <Col xs={12} sm={6}>
              <AsyncSelectField
                name="SelectedUser"
                loadOptions={loadOption}
                labelKey={"name"}
                valueKey={"id"}
                label={t("commitment_Username")}
                placeholder={t("categories_select_user_name")}
                defaultOptions
                required
              />
              {noUserFound && (
                <div className="addUser">
                  {" "}
                  <Trans i18nKey={"add_user_donation"} />{" "}
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      history.push(
                        `/Add-user?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&filter=${currentFilter}`
                      )
                    }
                  >
                    <Trans i18nKey={"add_user"} />
                  </span>
                </div>
              )}
            </Col>
            <Col xs={12} sm={6}>
              <FormikCustomReactSelect
                labelName={t("categories_select_category")}
                name={"SelectedMasterCategory"}
                disabled={editCommitment}
                labelKey={"name"}
                valueKey={"id"}
                loadOptions={
                  masterloadOptionQuery?.data?.results &&
                  masterloadOptionQuery?.data?.results.map((item) => {
                    return {
                      ...item,
                      name: ConverFirstLatterToCapital(item.name),
                    };
                  })
                }
                width={"100"}
                required
              />
            </Col>
            <Col xs={12} sm={6}>
              <FormikCustomReactSelect
                labelName={t("category_select_sub_category")}
                loadOptions={subLoadOption.map((cate) => {
                  return {
                    ...cate,
                    name: ConverFirstLatterToCapital(cate.name),
                  };
                })}
                name={"SelectedSubCategory"}
                labelKey={"name"}
                disabled={editCommitment}
                labelValue={"id"}
                width
              />
            </Col>
            <Col xs={12} sm={6}>
              <CustomTextField
                label={t("dashboard_Recent_DonorName")}
                name="donarName"
                placeholder={t("placeHolder_donar_name")}
              />
            </Col>
            <Col xs={12} sm={6}>
              <CustomTextField
                type="number"
                label={t("categories_select_amount")}
                placeholder={t("enter_price_manually")}
                name="Amount"
                required
              />
            </Col>
            <Col xs={12} sm={6} className="opacity-75">
              <CustomTextField
                label={t("created_by")}
                name="createdBy"
                disabled
              />
            </Col>
          </Row>
        </Col>
        {!editCommitment && (
          <Col xs={12} lg={3}>
            <FormikCustomDatePicker
              label={t("commitment_select_start_date")}
              name="startDate"
            />
          </Col>
        )}
        <Col xs={12} lg={!editCommitment ? 3 : 4}>
          <FormikCustomDatePicker
            label={t("commitment_select_end_date")}
            name="endDate"
            pastDateNotAllowed
          />
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
            }}
            disabled
          >
            <Spinner size="md" />
          </Button>
        ) : (
          <Button color="primary" type="submit">
            <span>
              <Trans i18nKey={buttonName} />
            </span>
          </Button>
        )}
      </div>
    </Form>
  );
}
