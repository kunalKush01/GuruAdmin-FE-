import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { updateDonation } from "../../api/donationApi";
import CustomTextField from "../partials/customTextField";

const EditDonation = ({ donationId, isOpen, toggle, estimateAmount }) => {
  const { t } = useTranslation();

  const initialValues = {
    donationId: donationId,
    originalAmount: "",
    amount: estimateAmount,
  };

  const handleSubmit = (values) => {
    return updateDonation(values);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      toggle();
      queryClient.invalidateQueries(["donations"]);
    },
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <span
          style={{color:'#583703', font: "normal normal bold 20px/25px Noto Sans" }}
        >
          Edit Donation
        </span>{" "}
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => mutation?.mutate(values)}
        >
          {(form) => (
            <Form>
              <CustomTextField
                label={t("Net Amount")}
                placeholder={t("Enter Article Net Amount")}
                name="originalAmount"
              />
              <CustomTextField label={t("Estimate Amount")} name="amount" />

              <Button color="primary" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default EditDonation;
