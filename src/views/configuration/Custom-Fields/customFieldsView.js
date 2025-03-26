import React, { useMemo, useState } from "react";
import { Tabs } from "antd";
import CustomFieldTable from "../../../components/custom-fields/customFieldTable";
import { Button } from "reactstrap";
import { Plus } from "react-feather";
import "../../../assets/scss/common.scss";
import AddCustomField from "./addCustomField";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDonationBoxCustomFields,
  getDonationCustomFields,
  getExpensesCustomFields,
  getPledgeCustomFields,
} from "../../../api/customFieldsApi";

import { useSelector } from "react-redux";
import { WRITE } from "../../../utility/permissionsVariable";
import { useTranslation } from "react-i18next";

const customFieldsView = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Donation");
  const toggleForm = () => setIsFormOpen(!isFormOpen);
  const queryClient = useQueryClient();

  const donation_query = useQuery(
    ["getDonationFields"],
    () => getDonationCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const pledge_query = useQuery(
    ["getPledgeFields"],
    () => getPledgeCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const donation_box_query = useQuery(
    ["getDonationBoxFields"],
    () => getDonationBoxCustomFields(),
    {
      keepPreviousData: true,
    }
  );
  const expenses_query = useQuery(
    ["getExpensesFields"],
    () => getExpensesCustomFields(),
    {
      keepPreviousData: true,
    }
  );

  const donation_custom_fields = useMemo(
    () => donation_query?.data ?? [],
    [donation_query]
  );
  const pledge_custom_fields = useMemo(
    () => pledge_query?.data ?? [],
    [pledge_query]
  );
  const donation_box_custom_fields = useMemo(
    () => donation_box_query?.data ?? [],
    [donation_box_query]
  );
  const expenses_custom_fields = useMemo(
    () => expenses_query?.data ?? [],
    [expenses_query]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "configuration"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  const handleRowSuccess = () => {
    if (activeTab === "Donation") {
      queryClient.invalidateQueries(["getDonationFields"]);
    } else if (activeTab === "Pledge") {
      queryClient.invalidateQueries(["getPledgeFields"]);
    } else if (activeTab === "Donation Box") {
      queryClient.invalidateQueries(["getDonationBoxFields"]);
    } else if (activeTab === "Expenses") {
      queryClient.invalidateQueries(["getExpensesFields"]);
    }
  };
  const trustId = localStorage.getItem("trustId");

  const items = [
    {
      key: "Donation",
      label: t("Donation"),
      children: (
        <>
          <div>
            <div
              className="d-flex justify-content-end w-100"
              style={{ marginBottom: "10px" }}
            >
              {allPermissions?.name === "all" ||
              subPermission?.includes(WRITE) ? (
                <Button
                  className=""
                  id="addCustomFieldBtn"
                  onClick={toggleForm}
                >
                  <Plus
                    className=""
                    size={15}
                    strokeWidth={4}
                    style={{ marginRight: "5px" }}
                  />
                  {t('add')}
                </Button>
              ) : (
                ""
              )}
            </div>
            <CustomFieldTable customFields={donation_custom_fields} />
          </div>
          <AddCustomField
            trustId={trustId}
            isOpen={isFormOpen}
            toggle={toggleForm}
            // onSubmit={handleFormSubmit}
            onSuccess={handleRowSuccess}
            activeTab={activeTab}
          />
        </>
      ),
    },
    {
      key: "Pledge",
      label: t("Pledge"),
      children: (
        <>
          <div>
            <div
              className="d-flex justify-content-end w-100"
              style={{ marginBottom: "10px" }}
            >
              <Button className="" id="addCustomFieldBtn" onClick={toggleForm}>
                <Plus
                  className=""
                  size={15}
                  strokeWidth={4}
                  style={{ marginRight: "5px" }}
                />
                {t('add')}
              </Button>
            </div>
            <CustomFieldTable customFields={pledge_custom_fields} />
          </div>
          <AddCustomField
            trustId={trustId}
            isOpen={isFormOpen}
            toggle={toggleForm}
            // onSubmit={handleFormSubmit}
            onSuccess={handleRowSuccess}
            activeTab={activeTab}
          />
        </>
      ),
    },
    {
      key: "Donation Box",
      label: t("Donation_Box"),
      children: (
        <>
          <div>
            <div
              className="d-flex justify-content-end w-100"
              style={{ marginBottom: "10px" }}
            >
              <Button className="" id="addCustomFieldBtn" onClick={toggleForm}>
                <Plus
                  className=""
                  size={15}
                  strokeWidth={4}
                  style={{ marginRight: "5px" }}
                />
                {t('add')}
              </Button>
            </div>
            <CustomFieldTable customFields={donation_box_custom_fields} />
          </div>
          <AddCustomField
            trustId={trustId}
            isOpen={isFormOpen}
            toggle={toggleForm}
            // onSubmit={handleFormSubmit}
            onSuccess={handleRowSuccess}
            activeTab={activeTab}
          />
        </>
      ),
    },
    {
      key: "Expenses",
      label: t("Expenses"),
      children: (
        <>
          <div>
            <div
              className="d-flex justify-content-end w-100"
              style={{ marginBottom: "10px" }}
            >
              <Button className="" id="addCustomFieldBtn" onClick={toggleForm}>
                <Plus
                  className=""
                  size={15}
                  strokeWidth={4}
                  style={{ marginRight: "5px" }}
                />
                {t('add')}
              </Button>
            </div>
            <CustomFieldTable customFields={expenses_custom_fields} />
          </div>
          <AddCustomField
            trustId={trustId}
            isOpen={isFormOpen}
            toggle={toggleForm}
            // onSubmit={handleFormSubmit}
            onSuccess={handleRowSuccess}
            activeTab={activeTab}
          />
        </>
      ),
    },
  ];
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <>
      <Tabs
        defaultActiveKey="Donation"
        className="customFieldView"
        items={items}
        onChange={handleTabChange}
      />
    </>
  );
};
export default customFieldsView;
