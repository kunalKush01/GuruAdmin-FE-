import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { createBreed, updateBreed } from "../../../api/cattle/cattleBreed";
import * as Yup from "yup";
import CustomTextField from "../../../components/partials/customTextField";
import { useMemo } from "react";

const BreedModal = ({ addBreed, isOpen, toggle, data }) => {
  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return {
      breedId: !addBreed ? data?.breedId : "",
      name: !addBreed ? data?.name : "",
    };
  }, [data]);

  const schema = Yup.object().shape({
    name: Yup.string().required("cattle_name_required"),
  });

  const handleSubmit = (values) => {
    if (addBreed) {
      return createBreed(values);
    } else {
      return updateBreed(values);
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

export default BreedModal;
