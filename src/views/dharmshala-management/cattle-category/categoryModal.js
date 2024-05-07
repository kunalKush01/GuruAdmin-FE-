import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import {
  createCattleCategory,
  updateCattleCategory,
} from "../../../api/cattle/cattleCategory";
import CustomTextField from "../../../components/partials/customTextField";

const CattleCategoryModal = ({ addCattleCategory, isOpen, toggle, data }) => {
  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return {
      categoryId: !addCattleCategory ? data?.categoryId : "",
      name: !addCattleCategory ? data?.name : "",
    };
  }, [data]);

  const schema = Yup.object().shape({
    name: Yup.string().required("cattle_name_required"),
  });

  const handleSubmit = (values) => {
    if (addCattleCategory) {
      return createCattleCategory(values);
    } else {
      return updateCattleCategory(values);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      toggle();
      queryClient.invalidateQueries(["cattleCategoryList"]);
    },
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <span
          style={{
            color: "#583703",
            font: "normal normal bold 20px/25px Noto Sans",
          }}
        >
          {addCattleCategory ? (
            <Trans i18nKey="cattle_category_add" />
          ) : (
            <Trans i18nKey="cattle_category_edit" />
          )}
        </span>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values) => mutation?.mutate(values)}
        >
          {() => (
            <Form>
              <CustomTextField
                label={t("userProfile_name")}
                name="name"
                placeholder={t("placeHolder_name")}
                autoFocus
                required
              />

              <Button color="primary" type="submit" className="mt-3">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default CattleCategoryModal;
