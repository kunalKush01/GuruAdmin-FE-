import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useParams for getting the URL parameter
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";

const BalanceSheetTable = ({ data }) => {
  const { id } = useParams(); // Get the `id` from the URL
  const location = useLocation(); // Get the location object
  const [pivotData, setPivotData] = useState([]);

  useEffect(() => {
    if (location.state && location.state.pivotData) {
      setPivotData(location.state.pivotData); // Get the pivot data from state
    }
  }, [location.state]); // Dependency on location.state

  // Define dimensions and calculations for PivotTableUI
  const dimensions = ["accountName", "sourceType"];
  const calculations = [
    {
      title: "Amount Sum",
      value: (row) => row.amount,
    },
  ];

  return (
    <div>
      <h3>Pivot Table for Account ID: {id}</h3>
      {pivotData.length > 0 ? (
        <PivotTableUI
          data={pivotData}
          rows={dimensions}
          dimensions={dimensions}
          reduce={(row, memo) => {
            memo.amount = (memo.amount || 0) + row.amount;
            return memo;
          }}
          calculations={calculations}
        />
      ) : (
        <p>No data available for this account.</p>
      )}
    </div>
  );
};

export default BalanceSheetTable;
