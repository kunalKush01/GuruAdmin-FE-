import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import { createBreed, updateBreed } from "../../../api/cattle/cattleBreed";
import { findAllCattleCategory } from "../../../api/cattle/cattleMedical";
import AsyncSelectField from "../../../components/partials/asyncSelectField";
import CustomTextField from "../../../components/partials/customTextField";

const BreedModal = ({ addBreed, isOpen, toggle, data }) => {
  const { t } = useTranslation();

  const loadOption = async (tagId) => {
    const res = await findAllCattleCategory({ search: tagId });
    return res.results;
  };

  const initialValues = useMemo(() => {
    return {
      breedId: !addBreed ? data?.breedId : "",
      name: !addBreed ? data?.name : "",
      cattleCategoryId: !addBreed ? data?.cattleCategoryId : null,
    };
  }, [data]);

  const schema = Yup.object().shape({
    name: Yup.string().required("cattle_name_required"),
    cattleCategoryId: Yup.mixed().required("cattle_type_required"),
  });

  const handleSubmit = (payload) => {
    if (addBreed) {
      return createBreed(payload);
    } else {
      return updateBreed(payload);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      toggle();
      queryClient.invalidateQueries(["cattleBreedList"]);
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
          {addBreed ? (
            <Trans i18nKey="cattle_breed_add" />
          ) : (
            <Trans i18nKey="cattle_breed_edit" />
          )}
        </span>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values) => {
            const data = {
              cattleCategoryId: values?.cattleCategoryId?._id,
              breedId: values.breedId,
              name: values.name,
            };

            mutation?.mutate(data);
          }}
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
              <div className="mt-2">
                <AsyncSelectField
                  name="cattleCategoryId"
                  labelKey="name"
                  valueKey="_id"
                  loadOptions={loadOption}
                  label={t("category")}
                  placeholder={t("categories_select_category")}
                  defaultOptions
                  required
                />
              </div>

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

export default BreedModal;
