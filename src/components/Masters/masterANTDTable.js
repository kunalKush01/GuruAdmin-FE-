import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { deleteMasterData, updateMasterData } from "../../api/masterApi";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import save from "../../assets/images/icons/category/save.png";
import cancel from "../../assets/images/icons/category/cancel.png";
import deleteIcon from "../../assets/images/icons/category/deleteIcon.svg";
import ANTDcustometable from "../partials/antdReactTable";
import { useTranslation } from "react-i18next";

export function MasterANTDTable({ data, loadingRow }) {
  const {t} = useTranslation()
  const queryClient = useQueryClient();
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [validationMessages, setValidationMessages] = useState({});
  const handleEditStart = (rowId) => {
    setEditingRowId(rowId);
    const row =data&& data.list.find((item, index) => index + 1 == rowId);
    setEditedValues({ ...row });
  };
  const handleEditCancel = () => {
    setEditingRowId(null);
    setEditedValues({});
    setValidationMessages({});
  };
  const handleEditSave = async () => {
    try {
      const requiredFields = Object.values(data.schema).filter(
        (field) => field.required
      );
      const missingFields = requiredFields.filter(
        (field) => !editedValues[field.name]
      );

      if (missingFields.length > 0) {
        const newValidationMessages = {};
        missingFields.forEach((field) => {
          newValidationMessages[field.name] = "Required";
        });
        setValidationMessages(newValidationMessages);
        return;
      }

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
        setValidationMessages({});

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
      Swal.fire(
        "Error",
        error.message || "Failed to update master data",
        "error"
      );
    }
  };
  const handleInputBlur = (field) => {
    if (field.required && !editedValues[field.name]) {
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
  const handleDelete = async (rowId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const columns = useMemo(() => {
    if (!data || !data.schema || !data.list) return [];

    return [
      ...Object.values(data.schema).map((field) => ({
        title: (
          <>
            {field.name}
            {field.required == true && (
              <span className="text-danger" style={{ marginBottom: "5px" }}>
                *
              </span>
            )}
          </>
        ),
        dataIndex: field.name,
        width: "220px",
        render: (_, row) => {
          const type = field.type;

          return editingRowId === row.id ? (
            type == "boolean" ? (
              <select
                className="form-control"
                style={{
                  height: "35px",
                  borderColor:
                    validationMessages[field.name] &&
                    validationMessages[field.name] == "Required"
                      ? "#ff8744"
                      : "",
                  margin: "10px 0px ",
                }}
                value={editedValues[field.name] || ""}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    [field.name]: e.target.value,
                  })
                }
                onBlur={() => handleInputBlur(field)}
              >
                <option value="">{t('select_option')}</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            ) : (
              <input
                type={type == "string" ? "text" : "number"}
                className="form-control"
                style={{
                  height: "35px",
                  borderColor: validationMessages[field.name] ? "#ff8744" : "",
                  margin: "10px 0px ",
                }}
                value={editedValues[field.name] || ""}
                placeholder={type == "string" ? "" : "123"}
                onChange={(e) =>
                  setEditedValues({
                    ...editedValues,
                    [field.name]: e.target.value,
                  })
                }
                onBlur={() => handleInputBlur(field)}
              />
            )
          ) : (
            row[field.name]
          );
        },
      })),
      {
        title: t('action'),
        fixed:!isMobile&& "right",
        center: true,
        render: (row) =>
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
  }, [data.schema, editingRowId, editedValues, validationMessages, loadingRow]);

  const formattedData = useMemo(() => {
    return data?.list?.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));
  }, [data, loadingRow]);
  return (
    <ANTDcustometable
      columns={columns}
      data={formattedData}
      masterPagination={true}
    />
  );
}
