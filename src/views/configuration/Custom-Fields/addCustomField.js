import React, { useMemo, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Swal from "sweetalert2";
import { X } from "react-feather";
import "../Masters/masterStyle.css";
import { createDonationCustomFields } from "../../../api/customFieldsApi";
import { getAllMasters, getMasterDataById } from "../../../api/masterApi";
import { useQuery } from "@tanstack/react-query";

const AddCustomField = ({ trustId, isOpen, toggle ,onSuccess}) => {
  const initialFormData = {
    fieldName: "",
    fieldType: "String",
    isRequired: false,
    value: "",
    master: "",
    masterData: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [validationMessages, setValidationMessages] = useState({});
  const masterQuery = useQuery(["Masters"], () => getAllMasters(), {
    keepPreviousData: true,
  });

  const masterItem = useMemo(
    () => masterQuery?.data?.masterNames ?? [],
    [masterQuery]
  );

  const masterDataQuery = useQuery(
    ["Masters-Data", formData.master !== "" ? formData.master : ""],
    () => getMasterDataById(formData.master !== "" ? formData.master : ""),

    {
      keepPreviousData: true,
    }
  );

  const masterDataItem = useMemo(
    () => masterDataQuery?.data ?? [],
    [masterDataQuery]
  );
  // console.log(masterDataItem);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleInputBlur = (field) => {
    if (field.isRequired && !formData[field.name]) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field.name]: "Required",
      }));
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field.name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const messages = {};

    if (formData.isRequired && !formData.fieldName) {
      messages.fieldName = "Required";
      valid = false;
    }

    setValidationMessages(messages);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      console.error("Form validation failed.");
      return;
    }

    const payload = {
      trustId,
      masterId:formData.master,
      masterSchema:formData.masterData,
      customFields: [
        {
          fieldName: formData.fieldName,
          fieldType: formData.fieldType,
          isRequired: formData.isRequired,
          value: formData.value,
        },
      ],
    };
    createDonationCustomFields(payload)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Custom field added successfully.",
        });
        onSuccess(true);
        setFormData(initialFormData);
        toggle();
      })
      .catch((error) => {
        onSuccess(false);
        console.error("Error adding custom field:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add custom field.",
        });
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Add New Custom Field
        <div>
          <X
            className="cancleIcon"
            onClick={toggle}
            size={15}
            strokeWidth={4}
            style={{ marginRight: "5px" }}
          />
        </div>
      </ModalHeader>
      <ModalBody>
        <Form className="row">
          <FormGroup className="col-md-12">
            <Label
              for="fieldName"
              style={{ fontSize: "13px", fontWeight: "500" }}
            >
              Field Name
              <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter text here"
              name="fieldName"
              id="fieldName"
              value={formData.fieldName}
              onChange={handleChange}
              onBlur={() =>
                handleInputBlur({ name: "fieldName", isRequired: true })
              }
            />
            {validationMessages.fieldName && (
              <div style={{ color: "#ff8744", fontSize: "12px" }}>
                {validationMessages.fieldName}
              </div>
            )}
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label
              for="fieldType"
              style={{ fontSize: "13px", fontWeight: "500" }}
            >
              Field Type
            </Label>
            <Input
              type="select"
              name="fieldType"
              id="fieldType"
              value={formData.fieldType}
              onChange={handleChange}
            >
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
              <option value="Date">Date</option>
            </Input>
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="value" style={{ fontSize: "13px", fontWeight: "500" }}>
              Value
            </Label>
            {formData.fieldType === "Boolean" ? (
              <Input
                type="select"
                name="value"
                id="value"
                value={formData.value}
                onChange={handleChange}
              >
                <option value="">Select Option</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Input>
            ) : (
              <Input
                type="text"
                name="value"
                id="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="Enter value here"
              />
            )}
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="master" style={{ fontSize: "13px", fontWeight: "500" }}>
              Master List
            </Label>
            <Input
              type="select"
              name="master"
              id="master"
              value={formData.master}
              onChange={handleChange}
            >
              <option value="">Select Option</option>
              {masterItem &&
                masterItem.map((item) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </Input>
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label
              for="masterData"
              style={{ fontSize: "13px", fontWeight: "500" }}
            >
              Master Data List
            </Label>
            <Input
              type="select"
              name="masterData"
              id="masterData"
              value={formData.masterData}
              onChange={handleChange}
            >
              <option value="">Select Option</option>
              {masterItem &&
                masterDataItem &&
                Object.values(masterDataItem?.schema || {}).map(
                  (item, index) => {
                    return (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    );
                  }
                )}
            </Input>
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label
              for="isRequired"
              style={{ fontSize: "13px", fontWeight: "500" }}
            >
              Is Required
            </Label>
            <Input
              type="checkbox"
              name="isRequired"
              id="isRequired"
              checked={formData.isRequired}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button id="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          id="cancel"
          onClick={() => {
            toggle();
            setValidationMessages({});
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCustomField;
