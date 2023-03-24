import { Form } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useUpdateEffect } from "react-use";
import { Button, Col, Row, Spinner } from "reactstrap";
import { getAllSubCategories } from "../../api/expenseApi";
import { findAllUsersByName, findAllUsersByNumber } from "../../api/findUser";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import AsyncSelectField from "../partials/asyncSelectField";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";

export default function FormWithoutFormikForCommitment({
  formik,
  masterloadOptionQuery,
  buttonName,
  showTimeInput,
  loading,
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
      setsubLoadOption(apiRes?.results);
    };

    SelectedMasterCategory && res();
  }, [SelectedMasterCategory]);

  useUpdateEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user?.id) {
      formik.setFieldValue("Mobile", user.mobileNumber);
      formik.setFieldValue("donarName", user?.name);
      return;
    }
    formik.setFieldValue("Mobile", "");
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
        }
      };
      results();
    }
  }, [formik?.values?.Mobile]);

  return (
    <Form>
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4}>
              <CustomTextField
                type="number"
                label={t("dashboard_Recent_DonorNumber")}
                name="Mobile"
                pattern="[6789][0-9]{9}"
                onInput={(e) => (e.target.value = e.target.value.slice(0, 12))}
                required
                autoFocus
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
                required
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
            <Col xs={4}>
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
                type="number"
                label={t("categories_select_amount")}
                placeholder={t("enter_price_manually")}
                name="Amount"
                required
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
