import { Form } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useUpdateEffect } from "react-use";
import { Button, Col, Row } from "reactstrap";
import { getAllSubCategories } from "../../api/expenseApi";
import { findAllUsersByName } from "../../api/findUser";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";

export default function FormWithoutFormikForCommitment({
  formik,
  masterloadOptionQuery,
  buttonName,
  showTimeInput,
  ...props
}) {
  const { t } = useTranslation();

  const { SelectedMasterCategory, SelectedSubCategory } = formik.values;
  const [subLoadOption, setsubLoadOption] = useState([]);

  const loadOption = async (name) => {
    const res = await findAllUsersByName({ name: name });
    return res.results;
  };
  useEffect(() => {
    const res = async () => {
      const apiRes = await getAllSubCategories({
        masterId: SelectedMasterCategory?.id,
      });
      console.log();
      setsubLoadOption(apiRes?.results);
    };

    SelectedMasterCategory && res();
  }, [SelectedMasterCategory]);

  // useUpdateEffect(()=>{
  //   const results = async()=>{
  //     cosnt res= await findAllUsersByNumber({ mobileNumber: mobileNumber });
  //     return res.results;
  //   }
  // },[UserName])

  useUpdateEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user) {
      formik.setFieldValue("Mobile", user.mobileNumber);
    }
  }, [formik?.values?.SelectedUser]);

  return (
    <Form>
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4}>
              <CustomTextField
                label={t("dashboard_Recent_DonorNumber")}
                name="Mobile"
              />
            </Col>
            <Col xs={4}>
              <AsyncSelectField
                name="SelectedUser"
                loadOptions={loadOption}
                labelKey={"name"}
                valueKey={"id"}
                label={t("commitment_Username")}
                placeholder={t("categories_select_user_name")}
                defaultOptions
              />
            </Col>
            <Col xs={4}>
              <CustomTextField
                label={t("dashboard_Recent_DonorName")}
                name="donarName"
              />
            </Col>
            <Col xs={4}>
              <FormikCustomReactSelect
                labelName={t("categories_select_category")}
                name={"SelectedMasterCategory"}
                labelKey={"name"}
                valueKey="id"
                loadOptions={masterloadOptionQuery?.data?.results}
                width={"100"}
              />
            </Col>
            <Col xs={4}>
              <FormikCustomReactSelect
                labelName={t("category_select_sub_category")}
                loadOptions={subLoadOption}
                name={"SelectedSubCategory"}
                labelKey={"name"}
                labelValue={"id"}
                width
              />
            </Col>
            <Col xs={4}>
              <CustomTextField
                label={t("created_by")}
                name="createdBy"
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
                <CustomTextField
                  label={t("categories_select_amount")}
                  placeholder={t("enter_price_manually")}
                  name="Amount"
                />
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}>
              <FormikCustomDatePicker
                label={t("commitment_select_end_date")}
                name="DateTime"
              />
            </Col>
          </Row>

          <Row className="mt-1"></Row>
        </Col>
      </Row>
      <div className="btn-Published ">
        <Button color="primary" className="addNotice-btn " type="submit">
          {!props.plusIconDisable && (
            <span>
              <Plus className="" size={15} strokeWidth={4} />
            </span>
          )}
          <span>
            <Trans i18nKey={`${buttonName}`} />
          </span>
        </Button>
      </div>
    </Form>
  );
}
