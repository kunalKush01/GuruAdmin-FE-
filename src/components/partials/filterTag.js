import React from "react";
import crossIcon from "../../assets/images/icons/cross.svg";
import moment from "moment";
import { Tag } from "antd";

function FilterTag({ hasFilters, filterData, removeFilter ,handleRemoveAllFilter}) {
  if (!hasFilters) return null;
  return (
    <>
      <div>
        {hasFilters && <span className="filterLable">Active Filters:</span>}
        {/* Display filter data as tags */}
        {hasFilters &&
          Object.keys(filterData).map((key) => {
            const filterItem = filterData[key];
            if (filterItem) {
              const index = filterItem.index;
              const fieldName = key;
              const filterType = filterItem.type;
              let filterValue;
              if (filterType === "inRange") {
                if (filterItem.fromDate && filterItem.toDate) {
                  // Date range
                  const fromDate = moment(
                    filterItem.fromDate,
                    moment.ISO_8601,
                    true
                  ).isValid()
                    ? moment(filterItem.fromDate)
                        .subtract(1, "day")
                        .format("DD MMM YYYY")
                    : filterItem.fromDate;
                  const toDate = moment(
                    filterItem.toDate,
                    moment.ISO_8601,
                    true
                  ).isValid()
                    ? moment(filterItem.toDate)
                        .subtract(1, "day")
                        .format("DD MMM YYYY")
                    : filterItem.toDate;
                  filterValue = `${fromDate} to ${toDate}`;
                } else if (
                  filterItem.from !== undefined &&
                  filterItem.to !== undefined
                ) {
                  // Numeric range
                  filterValue = `${filterItem.from} to ${filterItem.to}`;
                } else {
                  filterValue = "Invalid range";
                }
              } else if (filterType === "equal") {
                if (typeof filterItem.value === "number") {
                  filterValue = filterItem.value;
                } else if (
                  moment(filterItem.value, moment.ISO_8601, true).isValid()
                ) {
                  filterValue = moment(filterItem.value)
                    .subtract(1, "day")
                    .format("DD MMM YYYY");
                } else {
                  filterValue = filterItem.value;
                }
              } else if (
                filterType === "greaterThan" ||
                filterType === "lessThan"
              ) {
                filterValue = filterItem.value;
              } else {
                filterValue = filterItem.value || "Invalid filter";
              }
              const displayName = fieldName
                .replace(/^user_/, "") // Remove 'user_' prefix
                .replace(/^personalInfo_/, "") // Remove 'user_' prefix
                .replace(/^addressInfo_/, "") // Remove 'user_' prefix
                .replace(/^contactInfo_/, "") // Remove 'user_' prefix
                .replace(/^otherInfo_/, "") // Remove 'user_' prefix
                .replace(/^membershipInfo_/, "") // Remove 'user_' prefix
                .replace(/^familyInfo_/, "") // Remove 'user_' prefix
                .replace(/^customFields_/, "") // Remove 'customFields_' prefix
                .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
                .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

              return (
                <Tag
                  key={fieldName}
                  id={index}
                  color="orange"
                  style={{ margin: "5px" }}
                >
                  {`${displayName} (${filterType}): ${filterValue}`}{" "}
                  <img
                    src={crossIcon}
                    width={15}
                    className="crossIcon"
                    onClick={() => removeFilter(fieldName, index)} // Remove filter by field name
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                  />
                </Tag>
              );
            }

            return null;
          })}
      </div>
      <div style={{ marginTop: "5px" }}>
        {hasFilters && (
          <span className="cursor-pointer" onClick={handleRemoveAllFilter}>
            Clear All
          </span>
        )}
      </div>
    </>
  );
}

export default FilterTag;
