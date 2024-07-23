import React, { useMemo, useState } from "react";
import { Tabs } from "antd";
import CustomFieldTable from "../../../components/custom-fields/customFieldTable";
import { Button } from "reactstrap";
import { Plus } from "react-feather";
import "../../../components/custom-fields/customField.css";
import AddCustomField from "./addCustomField";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDonationCustomFields,
  getPledgeCustomFields,
} from "../../../api/customFieldsApi";

const customFieldsView = () => {
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

  const donation_custom_fields = useMemo(
    () => donation_query?.data ?? [],
    [donation_query]
  );
  const pledge_custom_fields = useMemo(
    () => pledge_query?.data ?? [],
    [pledge_query]
  );

  const handleRowSuccess = () => {
    if (activeTab === "Donation") {
      queryClient.invalidateQueries(["getDonationFields"]);
    } else if (activeTab === "Pledge") {
      queryClient.invalidateQueries(["getPledgeFields"]);
    }
  };
  const trustId = localStorage.getItem("trustId");

  const items = [
    {
      key: "Donation",
      label: "Donation",
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
                Add
              </Button>
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
      label: "Pledge",
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
                Add
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
      label: "Donation Box",
      children: "Content of Tab Pane 3",
    },
  ];
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <>
      <Tabs
        defaultActiveKey="Donation"
        items={items}
        onChange={handleTabChange}
      />
    </>
  );
};
export default customFieldsView;
