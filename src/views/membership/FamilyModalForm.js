import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import moment from "moment";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { updateMembersById } from "../../api/membershipApi";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../../api/sharedStorageApi";
import UploadImage from "../../components/partials/uploadImage";

const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);

function FamilyModalForm({
  isModalVisible,
  setIsModalVisible,
  mode,
  familyInfo,
  memberResultData,
  id,
  currentFamilyInfo,
  familyItemIndex,
}) {
  const { t } = useTranslation();
  const { Option } = Select;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const relationOptions = [
    "Father",
    "Mother",
    "Spouse",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Grandfather",
    "Grandmother",
    "Uncle",
    "Aunt",
    "Cousin",
    "Nephew",
    "Niece",
    "Father-in-Law",
    "Mother-in-Law",
    "Brother-in-Law",
    "Sister-in-Law",
  ];

  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const modalTitle =
    mode === "add" ? t("member_family_form") : t("edit_family_member");

  useEffect(() => {
    if (mode === "edit" && currentFamilyInfo) {
      form.setFieldsValue({
        name: currentFamilyInfo?.name || "",
        familyMemberDateOfBirth: currentFamilyInfo?.familyMemberDateOfBirth
          ? moment(currentFamilyInfo.familyMemberDateOfBirth, "YYYY-MM-DD")
          : null,
        familyMemberAnniversary: currentFamilyInfo?.familyMemberAnniversary
          ? moment(currentFamilyInfo.familyMemberAnniversary, "YYYY-MM-DD")
          : null,
        relation: currentFamilyInfo?.relation || "",
        imageUrl: "",
      });
      setUploadedFileUrl(currentFamilyInfo?.imageUrl || "");
    } else if (mode === "add") {
      form.resetFields();
      setUploadedFileUrl("");
    }
  }, [form, currentFamilyInfo, mode]);

  const handleSubmit = async (values) => {
    const updatedFamilyInfo = {
      name: values.name,
      relation: values.relation,
      familyMemberDateOfBirth: values.familyMemberDateOfBirth
        ? values.familyMemberDateOfBirth.format("YYYY-MM-DD")
        : null,
      familyMemberAnniversary: values.familyMemberAnniversary
        ? values.familyMemberAnniversary.format("YYYY-MM-DD")
        : null,
      imageUrl: uploadedFileUrl || "",
    };

    if (mode === "edit" && currentFamilyInfo) {
      const updatedFamilyInfoList = familyInfo.map((member, index) => {
        if (index === familyItemIndex) {
          return { ...member, ...updatedFamilyInfo };
        }
        return member;
      });

      const updatedPayload = {
        trustId: memberResultData.trustId,
        userId: memberResultData.userId,
        data: {
          ...memberResultData.data,
          familyInfo: updatedFamilyInfoList,
        },
      };

      await updateMembersById(id, updatedPayload);
      form.resetFields()
      queryClient.invalidateQueries(["memberShipProfileData"]);
      console.log("Updated Payload:", updatedPayload);
    } else {
      const addPayload = {
        trustId: memberResultData.trustId,
        userId: memberResultData.userId,
        data: {
          ...memberResultData.data,
          familyInfo: Array.isArray(memberResultData.data.familyInfo)
            ? [...memberResultData.data.familyInfo, updatedFamilyInfo]
            : [updatedFamilyInfo],
        },
      };

      await updateMembersById(id, addPayload);
      form.resetFields();
      queryClient.invalidateQueries(["memberShipProfileData"]);
    }

    setIsModalVisible(false);
  };

  return (
    <Modal
      title={modalTitle}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("member_family_name")}
          name="name"
          rules={[{ required: true, message: t("required_family_name") }]}
        >
          <Input placeholder={t("placeHolder_family_name")} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label={t("member_dob")} name="familyMemberDateOfBirth">
              <CustomDatePickerComponent
                placeholder={t("member_dob")}
                style={{ width: "100%" }}
                format="DD MMM YYYY"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={t("member_anniversary")}
              name="familyMemberAnniversary"
            >
              <CustomDatePickerComponent
                placeholder={t("member_anniversary")}
                style={{ width: "100%" }}
                format="DD MMM YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("member_family_relation")}
              name="relation"
              rules={[
                { required: true, message: t("required_family_relation") },
              ]}
            >
              <Select placeholder={t("placeHolder_family_relation")}>
                {relationOptions.map((relation) => (
                  <Option key={relation} value={relation}>
                    {relation}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={t("upload_profile_image")} name="imageUrl">
              <UploadImage
                uploadFileFunction={uploadFile}
                setUploadedFileUrl={setUploadedFileUrl}
                name="image"
                listType="picture"
                maxCount={1}
                buttonLabel={t("upload_profile_image")}
                icon={
                  <img
                    src={uploadIcon}
                    alt="Upload Icon"
                    style={{ width: 16, height: 16 }}
                  />
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FamilyModalForm;
