import React, { useState } from "react";
import { Row, Col, Card, Switch, Tabs } from "antd";
import profileImg from "../../assets/images/icons/pngtree.png";
import avatarIcon from "../../assets/images/avatars/blank.png";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import personIcon from "../../assets/images/icons/membership/person.svg";
import businessIcon from "../../assets/images/icons/membership/clipboard.svg";
import calenderIcon from "../../assets/images/icons/membership/date.svg";
import ringIcon from "../../assets/images/icons/membership/ring.svg";
import phoneIcon from "../../assets/images/icons/membership/phone.svg";
import whatsappIcon from "../../assets/images/icons/membership/whatsapp.svg";
import mailIcon from "../../assets/images/icons/membership/mail.svg";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { useHistory, useParams } from "react-router-dom";
import FamilyModalForm from "./FamilyModalForm";
import { getMembersById } from "../../api/membershipApi";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useSelector } from "react-redux";

function MembershipProfileView() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const { data } = useQuery(
    ["memberShipProfileData", id],
    () => getMembersById(id),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching suspense data:", error);
      },
    }
  );
  const memberResultData = data ? data?.member : null;
  const memberData = data ? memberResultData?.data : null;
  const personalInfo = memberData?.personalInfo;
  const addressInfo = memberData?.addressInfo;
  const contactInfo = memberData?.contactInfo;
  const familyInfo = memberData?.familyInfo;
  const membershipInfo = memberData?.membershipInfo;
  const otherInfo = memberData?.otherInfo;
  const upload = memberData?.upload;
  const loggedInUser = useSelector((state) => state.auth.userDetail.name);
  const [toggleSwitch, setToggleSwitch] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  const handleToggle = (checked) => {
    setToggleSwitch(checked);
  };
  const [activeTab, setActiveTab] = useState("family");
  //** Add Family Modal Handle */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [familyItemIndex, setFamilyItemIndex] = useState(null);
  const [currentFamilyInfo, setCurrentFamilyInfo] = useState(null); // Store the family member data

  const openModal = (mode, i, item) => {
    setModalMode(mode);
    setIsModalVisible(true);
    setFamilyItemIndex(i);
    setCurrentFamilyInfo(item);
  };

  const items = [
    {
      key: "family",
      label: t("family"),
      children: (
        <div>
          {familyInfo &&
            Array.isArray(familyInfo) &&
            familyInfo.map((item, i) => {
              return (
                <Card className="familyCard">
                  <div>
                    <div className="familyDetails d-flex flex-row">
                      <div className="d-flex align-items-center">
                        <div className="famRow1">
                          <div className="me-2">
                            <img
                              src={item.imageUrl ? item.imageUrl : avatarIcon}
                              className="familyProfile"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="famRow2">
                          <div className="rowItem">
                            <span className="memberAdd">Name</span>
                            <p className="memberInfo mb-0">{item.name || ""}</p>
                          </div>
                          <div className="rowItem">
                            <span className="memberAdd">Relation</span>
                            <p className="memberInfo mb-0">
                              {item.relation || ""}
                            </p>
                          </div>
                          <div className="rowItem">
                            <span className="memberAdd">Date of Birth</span>
                            <p className="memberInfo mb-0">
                              {item.familyMemberDateOfBirth
                                ? moment(item.familyMemberDateOfBirth).format(
                                    "DD MMM YYYY"
                                  )
                                : "-"}
                            </p>
                          </div>
                          <div className="rowItem">
                            <span className="memberAdd">
                              Date of Anniversary
                            </span>
                            <p className="memberInfo mb-0">
                              {item.familyMemberAnniversary
                                ? moment(item.familyMemberAnniversary).format(
                                    "DD MMM YYYY"
                                  )
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="famRow3">
                        <Button
                          className="editmember"
                          onClick={() => openModal("edit", i, item)}
                        >
                          Edit
                        </Button>
                        <img
                          src={editIcon}
                          width={35}
                          className="editIconMember"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          <div className="d-flex justify-content-end mt-2">
            <Button color="primary" onClick={() => openModal("add")}>
              Add
            </Button>
          </div>
          <FamilyModalForm
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            mode={modalMode}
            initialValues={{
              name: "",
              familyMemberDateOfBirth: "",
              familyMemberAnniversary: "",
              relation: "",
              imageUrl: "", // You can also add image URL if available
            }}
            familyInfo={familyInfo}
            memberData={memberData}
            memberResultData={memberResultData}
            upload={upload}
            id={id}
            familyItemIndex={familyItemIndex}
            currentFamilyInfo={currentFamilyInfo}
          />
        </div>
      ),
    },
    {
      key: "personal",
      label: t("personal"),
      children: (
        <>
          <div>
            <div className="d-flex flex-row">
              <div className="me-3">
                <span className="memberAdd">PAN Number</span>
                <p className="memberInfo">
                  {memberData ? otherInfo["panNumber"] : ""}
                </p>
              </div>
              <div>
                <span className="memberAdd">Alternative Mobile Number</span>
                <p className="memberInfo">
                  {memberData ? contactInfo["alternativePhone"] : ""}
                </p>
              </div>
            </div>
            <div>
              <span className="memberAdd">In Memory Name</span>
              <p className="memberInfo">
                {memberData ? personalInfo["inMemoryName"] : ""}
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "official",
      label: t("official"),
      children: (
        <>
          <div>
            <div className="d-flex flex-row">
              <div className="me-3">
                <span className="memberAdd">Created By</span>
                <p className="memberInfo">{loggedInUser}</p>
              </div>
              <div className="me-3">
                <span className="memberAdd">Updated Date</span>
                <p className="memberInfo">
                  {" "}
                  {memberData
                    ? moment(memberResultData["updatedAt"]).format(
                        "DD MMM YYYY"
                      )
                    : ""}
                </p>
              </div>
              <div className="me-3">
                <span className="memberAdd">Created Date</span>
                <p className="memberInfo">
                  {" "}
                  {memberData
                    ? moment(memberResultData["createdAt"]).format(
                        "DD MMM YYYY"
                      )
                    : ""}
                </p>
              </div>
              <div className="me-3">
                <span className="memberAdd">Branch</span>
                <p className="memberInfo">
                  {" "}
                  {memberData ? membershipInfo["branch"]["name"] : ""}
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="formikwrapper">
      <div className="mb-1 d-flex justify-content-between align-items-center">
        <img
          src={arrowLeft}
          className="me-2  cursor-pointer"
          onClick={() => history.push(`/membership`)}
        />
        <div>
          <Button
            color="primary"
            onClick={() => history.push(`/member/editMember/${id}`)}
          >
            Edit
          </Button>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="memberCard" id="firstCard">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <img
                src={
                  upload && upload.memberPhoto ? upload.memberPhoto : avatarIcon
                }
                className="membershipProfileImg"
                // style={{ border: upload == undefined  && "none !important" }}
                alt="Profile"
              />
              <p className="memberName">
                {memberData ? personalInfo["memberName"] : ""}
              </p>
              <p className="memberalias">
                {memberData ? personalInfo["aliasName"] : ""}
              </p>
            </div>
            <Card className="memberProfileCard d-flex flex-column align-items-center justify-content-center">
              <p className="card-text-1">
                {memberData ? membershipInfo["membership"]["name"] : ""}
              </p>
              <p className="card-text-2">
                {memberData ? membershipInfo["memberShipMemberNumber"] : ""}
              </p>
              <p className="card-text-3">
                {memberData ? membershipInfo["dateOfJoining"] : ""}
              </p>
            </Card>
            <div className="info-container">
              <div className="info-item">
                <img src={personIcon} alt="Person Icon" />{" "}
                <span>{memberData ? personalInfo["gender"]["name"] : ""}</span>
              </div>
              <div className="info-item">
                <img src={businessIcon} alt="Business Icon" />{" "}
                <span>Businessman</span>
              </div>
              <div className="info-item">
                <img src={calenderIcon} alt="Calendar Icon" />{" "}
                <span>
                  {memberData
                    ? moment(personalInfo?.dateOfBirth).format("DD MMM YYYY")
                    : ""}
                </span>
              </div>
              <div className="info-item">
                <img src={ringIcon} alt="Ring Icon" />{" "}
                <span>
                  {memberData ? personalInfo["maritalStatus"]["name"] : ""}
                </span>
              </div>
              <div className="info-item">
                <img src={phoneIcon} alt="Phone Icon" />{" "}
                <span>{memberData ? contactInfo["phone"] : ""}</span>
              </div>
              <div className="info-item">
                <img src={whatsappIcon} alt="WhatsApp Icon" />{" "}
                <span>{memberData ? contactInfo["whatsappNumber"] : ""}</span>
              </div>
              <div className="info-item">
                <img src={mailIcon} alt="Mail Icon" />{" "}
                <span>{memberData ? contactInfo["email"] : ""}</span>
              </div>
              <div>
                <div className="info-item">
                  <span className="me-1">Future Communication?</span>
                  <Switch checked={toggleSwitch} onChange={handleToggle} />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} sm={12}>
              <Card>
                <div>
                  <span className="memberAdd">Home Address</span>
                  <p className="memberlineAdd">
                    {memberData && addressInfo && addressInfo.homeAddress
                      ? [
                          addressInfo.homeAddress.street || "",
                          addressInfo.homeAddress.district || "",
                          addressInfo.homeAddress.city["name"] || "",
                          addressInfo.homeAddress.state["name"] || "",
                          addressInfo.homeAddress.country["name"] || "",
                        ]
                          .filter((part) => part)
                          .join(", ")
                      : ""}
                  </p>
                </div>
                <div>
                  <span className="memberAdd">Correspondence Address</span>
                  <p className="memberlineAdd">
                    {memberData &&
                    addressInfo &&
                    addressInfo.correspondenceAddress
                      ? [
                          addressInfo.correspondenceAddress.street || "",
                          addressInfo.correspondenceAddress.district || "",
                          addressInfo.correspondenceAddress.city["name"] || "",
                          addressInfo.correspondenceAddress.state["name"] || "",
                          addressInfo.correspondenceAddress.country["name"] ||
                            "",
                        ]
                          .filter((part) => part)
                          .join(", ")
                      : ""}
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={24} sm={12}>
              <div id="lastCard">
                <Card>
                  {" "}
                  <Tabs
                    defaultActiveKey={activeTab}
                    className="memberShipTab"
                    items={items}
                    onChange={handleTabChange}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default MembershipProfileView;
