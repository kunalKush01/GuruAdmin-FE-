import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import styled from "styled-components";
import { deleteMasterData, updateMasterData } from "../../api/masterApi";
import CustomDataTable from "../partials/CustomDataTable";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import save from "../../assets/images/icons/category/save.png";
import cancel from "../../assets/images/icons/category/cancel.png";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";

const MasterDataWrapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
`;

export function MasterDataTable({ data }) {
  console.log(data);
  const queryClient = useQueryClient();
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditStart = (rowId) => {
    setEditingRowId(rowId);
    const row = data.list.find((item) => item._id === rowId);
    setEditedValues({ ...row });
  };

  const handleEditCancel = () => {
    setEditingRowId(null);
    setEditedValues({});
  };
  const handleEditSave = async () => {
    try {
      // Validate required fields
      const requiredFields = Object.values(data.schema).filter((field) => field.required);
      const missingFields = requiredFields.filter((field) => !editedValues[field.name]);
  
      if (missingFields.length > 0) {
        // If any required field is empty, show error message
        const missingFieldNames = missingFields.map((field) => field.name).join(', ');
        Swal.fire("Error", `Please fill in required fields: ${missingFieldNames}`, "error");
        return;
      }
  
      // Proceed with update if all required fields are filled
      const updatedList = data.list.map((item, index) => {
        if (index + 1 === editingRowId) {
          return { ...item, ...editedValues };
        }
        return item;
      });
  
      const values = {};
      Object.values(data.schema).forEach((field) => {
        values[field.name] = updatedList.map((item) => item[field.name]);
      });
  
      const updates = {
        name: data.name,
        schema: data.schema,
        values: values,
      };
  
      const response = await updateMasterData(data._id, updates);
      if (!response) {
        Swal.fire("Error", "Failed to update master data", "error");
      } else {
        setEditingRowId(null);
        setEditedValues({});
  
        queryClient.invalidateQueries(["Masters-Data"]);
  
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Failed to update master data", error);
      Swal.fire("Error", error.message || "Failed to update master data", "error");
    }
  };

  const handleDelete = async (rowId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      // text: 'You will not be able to recover this row!',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await deleteMasterData(data._id, rowId);
        if (response) {
          queryClient.invalidateQueries(["Masters-Data"]);
          Swal.fire({
            icon: "success",
            title: "Row Deleted Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire("Error", "Failed to delete row", "error");
        }
      } catch (error) {
        console.error("Failed to delete row", error);
        Swal.fire("Error", error.message || "Failed to delete row", "error");
      }
    }
  };
  const columns = useMemo(() => {
    if (!data || !data.schema || !data.list) return []; // Handle initial data loading or undefined states

    return [
      {
        name: "Serial No.",
        selector: (row, index) => index + 1,
        width: "80px",
      },
      ...Object.values(data.schema).map((field) => ({
        name: (
          <>
            {field.name}
            {field.required==true && <span className="text-danger" style={{marginBottom:"5px"}}>*</span>}
          </>
        ),
        selector: field.name,
        width: "220px",
        cell: (row) => {
          const type = field.type;

          return editingRowId === row.id ? (
            type == "boolean" ? (
              <select
                className="form-control"
                style={{ height: "35px" }}
                value={editedValues[field.name] || ""}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    [field.name]: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input
                type={type == "string" ? "text" : "number"}
                className="form-control"
                style={{ height: "35px" }}
                value={editedValues[field.name] || ""}
                placeholder={type == "string" ? "" : "123"}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    [field.name]: e.target.value,
                  })
                }
              />
            )
          ) : (
            row[field.name]
          );
        },
      })),
      {
        name: "Actions",
        center: true,
        cell: (row) =>
          editingRowId === row.id ? (
            <>
              <img
                src={save}
                onClick={handleEditSave}
                style={{
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
              />
              <img
                src={cancel}
                onClick={handleEditCancel}
                style={{ cursor: "pointer", width: "20px", height: "20px" }}
              />
            </>
          ) : (
            <>
              <img
                src={editIcon}
                onClick={() => handleEditStart(row.id)}
                style={{ cursor: "pointer", width: "40px", height: "40px" }}
              />
              <img
                src={deleteIcon}
                onClick={() => handleDelete(row.id)}
                style={{ cursor: "pointer", width: "35px", height: "35px" }}
              />
            </>
          ),
        width: "120px",
      },
    ];
  }, [data.schema, editingRowId, editedValues]);
  
  const formattedData = useMemo(() => {
    return data?.list?.map((item, idx) => ({
      ...item,
      id: idx + 1, // Adjust if your API expects a specific serial number format
    }));
  }, [data]);
  return (
    <MasterDataWrapper>
      <CustomDataTable
        columns={columns}
        data={formattedData}
        masterPagination={true}
      />
    </MasterDataWrapper>
  );
}
