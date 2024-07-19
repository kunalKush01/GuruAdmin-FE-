import React, { useState } from "react";
import { Tabs } from "antd";
import CustomFieldTable from "../../../components/custom-fields/customFieldTable";
import { Button } from "reactstrap";
import { Plus } from "react-feather";
import "../../../components/custom-fields/customField.css";
import AddCustomField from "./addCustomField";
import { useQueryClient } from "@tanstack/react-query";

const customFieldsView = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleForm = () => setIsFormOpen(!isFormOpen);
  const queryClient = useQueryClient();

  const onChange = (key) => {
    // console.log(key);
  };
  const handleRowSuccess = () => {
    queryClient.invalidateQueries(["getDonationFields"]);
  };
  const trustId = localStorage.getItem("trustId");

  const items = [
    {
      key: "donation",
      label: "Donation",
      children: (
        <>
          <div>
            <div className="d-flex justify-content-end w-100" style={{marginBottom:"10px"}}>
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
            <CustomFieldTable />
          </div>
          <AddCustomField
            trustId={trustId}
            isOpen={isFormOpen}
            toggle={toggleForm}
            // onSubmit={handleFormSubmit}
            onSuccess={handleRowSuccess}
          />
        </>
      ),
    },
    {
      key: "pledge",
      label: "Pledge",
      children: "Content of Tab Pane 2",
    },
    {
      key: "donation_box",
      label: "Donation Box",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="donation" items={items} onChange={onChange} />
    </>
  );
};
export default customFieldsView;
