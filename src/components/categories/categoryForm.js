import { FastField, Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import CustomTextField from "../partials/customTextField";
import * as yup from "yup";
import RichTextField from "../partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../partials/customDropDown";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, ButtonGroup, Col, Row, Spinner } from "reactstrap";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import { useHistory } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNews } from "../../api/newsApi";
import { Plus } from "react-feather";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { flatMap } from "lodash";

const FormWaraper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
  }
  .btn-secondary {
    background-color: #fff7e8 !important;
    color: #583703 !important ;
    border: none;
    font: normal normal bold 20px/20px noto sans !important ;
    box-shadow: none !important ;
    :hover {
      color: #fff !important;
      background-color: #ff8744 !important;
    }
    .secondary.active {
      color: #fff !important;
    }
  }
`;

export default function CategoryForm({
  loadOptions = [],
  CategoryFormName = "",
  plusIconDisable = false,
  buttonName = "",
  handleSubmit,
  vailidationSchema,
  initialValues,
  showTimeInput,
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const categoryQuerClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      console.log("error=", data);
      if (!data.error) {
        categoryQuerClient.invalidateQueries(["Categories"]);
        categoryQuerClient.invalidateQueries(["SubCategoryDetail"]);
        setLoading(false);
        history.push("/configuration/categories");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={{ ...initialValues }}
        onSubmit={(e) => {
          setLoading(true);
          return categoryMutation.mutate({
            name: e?.SubCategory,
            masterId: e?.MasterCategory.id,
            categoryId: e?.Id,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={7}>
                <Row>
                  <Col>
                    <FormikCustomReactSelect
                      labelName={t("categories_select_master_category")}
                      name={CategoryFormName}
                      labelKey={"name"}
                      valueKey="id"
                      loadOptions={loadOptions}
                      width={"100"}
                      {...props}
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("categories_sub_category")}
                      name="SubCategory"
                      required
                    />
                  </Col>
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
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary mt-2"
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
