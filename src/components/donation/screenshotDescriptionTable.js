import React, { useEffect, useState } from "react";
import { Descriptions, Input, message, Button } from "antd";
import { CloseOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { updateDonation } from "../../api/donationApi";
import { useQueryClient } from "@tanstack/react-query";

const ScreenshotDescriptionTable = ({ record, data, setMatchedAmount }) => {
  if (!record && !data) return null; // Handle cases where data or record is undefined

  const query = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [originalAmount, setOriginalAmount] = useState(record?.amount || "0.00");
  const [editedAmount, setEditedAmount] = useState(originalAmount);

  const calculateMatchPercentage = (recordAmount, dataAmount) => {
    const amount = parseFloat(dataAmount);
    const recordAmt = parseFloat(recordAmount);
    if (!amount || !recordAmt) return "Invalid Amount";

    const percentage = Math.round(
      (Math.min(amount, recordAmt) / Math.max(amount, recordAmt)) * 100
    );
    return `${percentage}% matched`;
  };
  useEffect(() => {
    if (editedAmount && data?.amount) {
      const result = calculateMatchPercentage(editedAmount, data.amount);
      setMatchedAmount(result);
    }
  }, [editedAmount, data?.amount, setMatchedAmount]);

  const handleAmountChange = (e) => {
    setEditedAmount(e.target.value);
  };

  const handleEditClick = () => {
      setOriginalAmount(editedAmount); // Store the last saved amount
    setIsEditing(true);
  };

  const updateAmount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the amount?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedRecord = {
            ...record,
            amount: Number(editedAmount),
            donationId: record._id,
            originalAmount: record.originalAmount ? record.originalAmount : 0,
          };
  
          await updateDonation(updatedRecord);
          query.invalidateQueries("donations");
          message.success("Amount updated successfully!");
  
          // ✅ Save the updated amount as the new original value
          setOriginalAmount(editedAmount);
          setIsEditing(false);
        } catch (error) {
          message.error("Failed to update amount!");
        }
      } else {
        setEditedAmount(originalAmount); // Reset to the last saved value
        setIsEditing(false);
      }
    });
  };
  

  const cancelEditing = () => {
    setEditedAmount(originalAmount); // Reset to the last saved amount
    setIsEditing(false);
  };

  const borderedItems = [
    {
      key: "1",
      label: "Name",
      children: record?.donarName || "N/A",
    },
    {
      key: "2",
      label: "Amount",
      children: isEditing ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Input
            value={editedAmount}
            onChange={handleAmountChange}
            autoFocus
            style={{ width: "100px" }}
          />
          <CheckOutlined
            onClick={updateAmount}
            style={{ color: "green", cursor: "pointer", fontSize: "16px" }}
          />
          <CloseOutlined
            onClick={cancelEditing}
            style={{ color: "red", cursor: "pointer", fontSize: "16px" }}
          />
        </div>
      ) : (
        <span style={{ cursor: "pointer" }}>
          ₹{editedAmount}{" "}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={handleEditClick}
          />
        </span>
      ),
    },
    {
      key: "3",
      label: "Transaction ID",
      children: data?.upiRefNumber || "N/A",
    },
    {
      key: "4",
      label: "Transaction Date & Time",
      children: data?.timestamp || "N/A",
    },
    {
      key: "5",
      label: "Status",
      children: record?.paidStatus || "N/A",
    },
  ];

  return (
    <div>
      <Descriptions bordered size="small" items={borderedItems} />
    </div>
  );
};

export default ScreenshotDescriptionTable;
