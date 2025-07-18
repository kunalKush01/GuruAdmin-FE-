import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Switch, Tabs, Image, Typography } from "antd";
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
import { Trans, useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { useNavigate, useParams } from "react-router-dom";
import FamilyModalForm from "./FamilyModalForm";
import { getDonationForMember, getMembersById } from "../../api/membershipApi";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useSelector } from "react-redux";
import { downloadFile } from "../../api/sharedStorageApi";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import DonationANTDListTable from "../../components/donation/donationAntdListTable";

function MembershipProfileView() {
  const { Title, Text } = Typography;
  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "donation"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
  });
  const trustId = localStorage.getItem("trustId");
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  // console.log(data);
  const memberResultData = data ? data?.member : null;
  const memberData = data ? memberResultData?.data : null;
  const personalInfo = memberData?.personalInfo;
  const addressInfo = memberData?.addressInfo;
  const contactInfo = memberData?.contactInfo;
  const familyInfo = memberData?.familyInfo;
  const membershipInfo = memberData?.membershipInfo;
  const otherInfo = memberData?.otherInfo;
  const upload = memberData?.upload;
  const { data: memberDonations } = useQuery(
    ["memberDonations", contactInfo?.phone, trustId],
    () =>
      getDonationForMember({
        trustId,
        phoneNumber: contactInfo?.phone,
      }),
    {
      enabled: !!contactInfo?.phone && !!trustId, // 🔒 ensure both are ready
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member donations:", error);
      },
    }
  );
  const donationItems = useMemo(
    () => memberDonations?.results ?? [],
    [memberDonations]
  );
  const totalItems = memberDonations?.data?.totalResults ?? 0;

  const formatDynamicAddress = (address) => {
    const addressParts = [];

    // Helper function to extract name or fallback value from nested objects
    const extractNameOrDefault = (value) => {
      if (value && typeof value === "object") {
        // If the object has a name property, use it
        return value.name ? value.name : null;
      }
      return value ? value : null;
    };

    // Function to extract values from address fields
    const extractAddressValues = (address, prefix = "") => {
      const fields = [
        "street",
        "city",
        "district",
        "pincode",
        "state",
        "country",
      ];

      fields.forEach((field) => {
        const fieldKey = prefix
          ? `${prefix}${ConverFirstLatterToCapital(field)}`
          : field;
        const value = address[fieldKey];

        const extractedValue = extractNameOrDefault(value);
        if (extractedValue) {
          addressParts.push(extractedValue);
        }
      });
    };

    // Extract values for main address (no prefix needed)
    extractAddressValues(address);

    // Extract values for correspondence address (prefix 'correspondence' added)
    extractAddressValues(address, "correspondence");

    return addressParts.length > 0 ? addressParts.join(", ") : "";
  };

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
  const [currentFamilyInfo, setCurrentFamilyInfo] = useState(null);

  const openModal = (mode, i, item) => {
    setModalMode(mode);
    setIsModalVisible(true);
    setFamilyItemIndex(i);
    setCurrentFamilyInfo(item);
  };
  const [familyImages, setFamilyImages] = useState({});
  const fetchImage = async (imageUrl, i) => {
    if (imageUrl) {
      try {
        const imgBlob = await downloadFile(imageUrl);
        const imgURL = URL.createObjectURL(imgBlob);

        setFamilyImages((prevState) => ({
          ...prevState,
          [i]: imgURL,
        }));
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
  };
  useEffect(() => {
    if (familyInfo && Array.isArray(familyInfo)) {
      familyInfo.forEach((item, i) => {
        fetchImage(item.imageUrl, i);
      });
    }
  }, [familyInfo]);
  useEffect(() => {
    if (upload && upload.memberPhoto) {
      fetchImage(upload.memberPhoto, "memberPhoto");
    }
  }, [upload]);
  useEffect(() => {
    if (upload) {
      const { memberPhoto, parentPhoto, anotherPhoto } = upload;
      fetchImage(memberPhoto, "memberPhoto");
      fetchImage(parentPhoto, "parentPhoto");
      fetchImage(anotherPhoto, "anotherPhoto");
    }
  }, [upload]);
  const ImageCard = ({ imageUrl, title, description }) => {
    return (
      <Card
        style={{
          width: 280,
          height: 270,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          margin: "10px",
        }}
      >
        <Image
          width={230}
          height={180}
          src={imageUrl}
          alt={title}
          style={{ borderRadius: 8 }} // Rounded corners for the image
          preview={imageUrl ? true : false}
        />
        <div style={{ padding: "16px" }}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          {/* <Text type="secondary">{description}</Text> */}
        </div>
      </Card>
    );
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
                            <Image
                              id="profileImgFam"
                              width={50}
                              height={50}
                              src={
                                familyImages[i] ? familyImages[i] : avatarIcon
                              }
                              alt="Profile"
                              className="familyProfile"
                              preview={familyImages[i] ? true : false}
                            />
                          </div>
                        </div>
                        <div className="famRow2">
                          <div className="rowItem">
                            <span className="memberAdd">{t("name")}</span>
                            <p className="memberInfo mb-0">{item.name || ""}</p>
                          </div>
                          <div className="rowItem">
                            <span className="memberAdd">
                              {t("member_family_relation")}
                            </span>
                            <p className="memberInfo mb-0">
                              {item.relation || ""}
                            </p>
                          </div>
                          <div className="rowItem">
                            <span className="memberAdd">{t("member_dob")}</span>
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
                              {t("member_anniversary")}
                            </span>
                            <p className="memberInfo mb-0">
                              {item.familyMemberAnniversary
                                ? moment(item.familyMemberAnniversary).format(
                                    "DD MMM YYYY"
                                  )
                                : "-"}
                            </p>
                          </div>
                          <div className="rowItem rowEditButton">
                            <Button
                              className="editmember"
                              onClick={() => openModal("edit", i, item)}
                            >
                              {t("edit")}
                            </Button>
                            <img
                              src={editIcon}
                              onClick={() => openModal("edit", i, item)}
                              width={35}
                              className="editIconMember"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          <div className="d-flex justify-content-end mt-2">
            <Button color="primary" onClick={() => openModal("add")}>
              {t("add")}
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
              imageUrl: "",
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
                <span className="memberAdd">{t("pan_number")}</span>
                <p className="memberInfo">
                  {memberData ? otherInfo["panNumber"] : ""}
                </p>
              </div>
              <div>
                <span className="memberAdd">{t("alt_phone")}</span>
                <p className="memberInfo">
                  {memberData ? contactInfo["alternativePhone"] : ""}
                </p>
              </div>
            </div>
            <div>
              <span className="memberAdd">{t("in_memory_name")}</span>
              <p className="memberInfo">
                {memberData ? personalInfo["inMemoryName"] : ""}
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "photo",
      label: t("photo"),
      children: (
        <div
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "start" }}
        >
          {upload && (
            <>
              {upload.memberPhoto && familyImages["memberPhoto"] && (
                <ImageCard
                  imageUrl={familyImages["memberPhoto"]}
                  title="Member Photo"
                  description="This is the member's photo."
                />
              )}
              {upload.parentPhoto && familyImages["parentPhoto"] && (
                <ImageCard
                  imageUrl={familyImages["parentPhoto"]}
                  title="Parent Photo"
                  description="This is the parent's photo."
                />
              )}
              {upload.anotherPhoto && familyImages["anotherPhoto"] && (
                <ImageCard
                  imageUrl={familyImages["anotherPhoto"]}
                  title="Another Photo"
                  description="This is another photo."
                />
              )}
            </>
          )}
        </div>
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
                <span className="memberAdd">{t("created_by")}</span>
                <p className="memberInfo">{loggedInUser}</p>
              </div>
              <div className="me-3">
                <span className="memberAdd">{t("updated_date")}</span>
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
                <span className="memberAdd">{t("created_date")}</span>
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
                <span className="memberAdd">{t("branch")}</span>
                <p className="memberInfo">
                  {" "}
                  {memberData
                    ? membershipInfo?.branch?.name == "Select Option"
                      ? ""
                      : membershipInfo?.branch?.name
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="formikwrapper mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <img
          src={arrowLeft}
          className="me-2  cursor-pointer"
          onClick={() => navigate(`/membership`)}
        />
        <div>
          <Button
            className="mb-1"
            color="primary"
            onClick={() => navigate(`/member/editMember/${id}`)}
          >
            {t("edit")}
          </Button>
        </div>
      </div>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={8} lg={6}>
          <Card className="memberCard" id="firstCard">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <Image
                id="profileImg"
                width={220} // Set the width to match your CSS
                height={220} // Set the height to match your CSS
                src={familyImages["memberPhoto"] || avatarIcon}
                alt="Profile"
                className="membershipProfileImg"
                preview={familyImages["memberPhoto"] ? true : false}
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
                {memberData
                  ? membershipInfo?.membership?.name == "Select Option"
                    ? ""
                    : membershipInfo?.membership?.name
                  : ""}
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
                <span>
                  {memberData
                    ? personalInfo?.gender?.name == "Select Option"
                      ? ""
                      : personalInfo?.gender?.name
                    : ""}
                </span>
              </div>
              {/* <div className="info-item">
                <img src={businessIcon} alt="Business Icon" />{" "}
                <span>{memberData ? personalInfo?.business?.name : ""}</span>
              </div> */}
              <div className="info-item">
                <img src={calenderIcon} alt="Calendar Icon" />{" "}
                <span>
                  <span>
                    {memberData && personalInfo?.dateOfBirth
                      ? moment(personalInfo.dateOfBirth).format("DD MMM YYYY")
                      : ""}
                  </span>
                </span>
              </div>
              <div className="info-item">
                <img src={ringIcon} alt="Ring Icon" />{" "}
                <span>
                  {memberData
                    ? personalInfo?.maritalStatus?.name == "Select Option"
                      ? ""
                      : personalInfo?.maritalStatus?.name
                    : ""}
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
                  <span className="me-1">{t("future_communication")}</span>
                  <Switch checked={toggleSwitch} onChange={handleToggle} />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={16} lg={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} sm={24}>
              <Card>
                <div>
                  <span className="memberAdd">{t("home_address")}</span>
                  <p className="memberlineAdd">
                    {memberData && addressInfo && addressInfo.homeAddress
                      ? formatDynamicAddress(addressInfo.homeAddress)
                      : ""}
                  </p>
                </div>
                <div>
                  <span className="memberAdd">
                    {t("correspondence_address")}
                  </span>
                  <p className="memberlineAdd">
                    {memberData &&
                    addressInfo &&
                    addressInfo.correspondenceAddress
                      ? formatDynamicAddress(addressInfo.correspondenceAddress)
                      : ""}
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={24} sm={24}>
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
            <Col xs={24} md={24} sm={24}>
              <div id="donationCard">
                <Card>
                  <div className="mb-1">
                    <spna className="commonSmallFont">{t("donation")}</spna>
                  </div>
                  <DonationANTDListTable
                    donationType={"Donation"}
                    data={donationItems}
                    allPermissions={allPermissions}
                    subPermission={subPermission}
                    totalItems={totalItems}
                    currentPage={pagination.page}
                    pageSize={pagination.limit}
                    onChangePage={(page) =>
                      setPagination((prev) => ({ ...prev, page }))
                    }
                    onChangePageSize={(pageSize) =>
                      setPagination((prev) => ({
                        ...prev,
                        limit: pageSize,
                        page: 1,
                      }))
                    }
                    isForMember={true}
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
