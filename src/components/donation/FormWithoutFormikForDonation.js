import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, ButtonGroup, Col, Row } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import AsyncSelectField from "../partials/asyncSelectField";
import {
  findAllComitmentByUser,
  findAllUsersByName,
  findAllUsersByNumber,
} from "../../api/findUser";
import { useSelector } from "react-redux";
import {
  getAllMasterCategories,
  getAllSubCategories,
} from "../../api/expenseApi";
import { CustomReactSelect } from "../partials/customReactSelect";
import { useUpdateEffect } from "react-use";
import { getAllCommitments } from "../../api/commitmentApi";
import { ConverFirstLatterToCapital } from "../../utility/formater";

export default function FormWithoutFormikForDonation({
  formik,
  masterloadOptionQuery,
  buttonName,
  ...props
}) {
  const { t } = useTranslation();

  const { SelectedMasterCategory, SelectedSubCategory, Amount } = formik.values;
  const [subLoadOption, setsubLoadOption] = useState([]);
  const { SelectedUser, SelectedCommitmentId } = formik.values;
  const [commitmentIdByUser, setCommitmentIdByUser] = useState([]);

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

  useEffect(() => {
    const res = async () => {
      const apiRes = await findAllComitmentByUser({
        userId: SelectedUser?.userId,
      });

      setCommitmentIdByUser(apiRes?.results);
    };
    SelectedUser && res();
  }, [SelectedUser?.userId]);

  useUpdateEffect(() => {
    
    if (formik?.values?.Mobile?.toString().length == 10) {
      const results = async () => {
        const res = await findAllUsersByNumber({
          mobileNumber: formik?.values?.Mobile,
        });
        if (res.result) {
          formik.setFieldValue("SelectedUser", res.result);
        }
      };
      results();
    }
  }, [formik?.values?.Mobile]);

  useUpdateEffect(() => {
    const user = formik?.values?.SelectedUser;
    if (user?.id) {
      console.log("hey")
      formik.setFieldValue("Mobile", user.mobileNumber);
      return
    }
    formik.setFieldValue("Mobile", "");
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
      formik.setFieldValue(
        "donarName",
        SelectedCommitmentId?.donarName
      );
    }
  }, [SelectedCommitmentId?.id]);

  

  return (
    <Form>
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4} className=" pb-1" >
              <CustomTextField
                type="number"
                label={t("dashboard_Recent_DonorNumber")}
                name="Mobile"
                pattern="[6789][0-9]{9}"
                onInput={(e) =>
                  (e.target.value = e.target.value.slice(0, 12))
                }
                required
              />
            </Col>
            <Col xs={4} className=" pb-1">
              <AsyncSelectField
                name="SelectedUser"
                required
                loadOptions={loadOption}
                labelKey={"name"}
                valueKey={"id"}
                label={t("commitment_Username")}
                placeholder={t("categories_select_user_name")}
                defaultOptions
                disabled={loadOption.length==0}

              />
            </Col>
            <Col xs={4} className=" pb-1">
              <CustomTextField
                label={t("dashboard_Recent_DonorName")}
                name="donarName"
              />
            </Col>
            <Col xs={4} className=" pb-1">
              <FormikCustomReactSelect
                labelName={t("categories_select_category")}
                name={"SelectedMasterCategory"}
                labelKey={"name"}
                valueKey="id"
                loadOptions={masterloadOptionQuery?.data?.results&&masterloadOptionQuery?.data?.results.map((item)=>{
                  return {...item,name:ConverFirstLatterToCapital(item.name)}
                })}
                required
                width={"100"}
                disabled={masterloadOptionQuery?.data?.results==0}

              />
            </Col>
            <Col xs={4} className=" pb-1">
              <FormikCustomReactSelect
                labelName={t("category_select_sub_category")}
                loadOptions={subLoadOption.map((cate)=>{
                  return {...cate,name:ConverFirstLatterToCapital(cate.name)}
                })}
                name={"SelectedSubCategory"}
                labelKey={"name"}
                valueKey={"id"}
                disabled={subLoadOption.length==0}
                width
              />
            </Col>
            <Col xs={4} className=" pb-1">
              <CustomTextField
                label={t("created_by")}
                name="createdBy"
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col xs={4} className="mt-1">
                  <FormikCustomReactSelect
                    labelName={t("dashboard_Recent_DonorCommitId")}
                    loadOptions={commitmentIdByUser}
                    placeholder={t("commitment_select_commitment_id")}
                    name={"SelectedCommitmentId"}
                    disabled={commitmentIdByUser.length==0}
                    valueKey={"id"}
                    getOptionLabel={(option) =>
                      `${option.commitmentId}   (₹${option.paidAmount}/${option.amount})`
                    }
                    width
                  />
                </Col>

                <Col xs={4} className="mt-1">
                  <CustomTextField
                      type="number"
                    label={t("categories_select_amount")}
                    placeholder={t("enter_price_manually")}
                    name="Amount"
                      required
                  />
                </Col>
              </Row>
              {/* <Row>
                <Col>
                  <Button
                    className="p-4 w-100 "
                    onClick={() => formik.setFieldValue("Amount", "1000")}
                  >
                    1000
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="p-4 w-100 "
                    onClick={() => formik.setFieldValue("Amount", "2000")}
                  >
                    2000
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="p-4 w-100 "
                    onClick={() => formik.setFieldValue("Amount", "5000")}
                  >
                    5000
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="p-4 w-100 "
                    onClick={() => formik.setFieldValue("Amount", "10000")}
                  >
                    10000
                  </Button>
                </Col>
              </Row> */}
            </Col>
          </Row>

          {/* <Row className="mt-1">
            <Row>
              <Col className="text-center">or</Col>
            </Row> 
            <Row className="">
              
            </Row>
          </Row> */}
        </Col>
      </Row>
      <div className="btn-Published mt-3">
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
