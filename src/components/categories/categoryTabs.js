import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import "../../assets/scss/common.scss";

const CategoryTabs = ({ setActive, active, setPagination }) => {
  const { t } = useTranslation();
  const CategoryTabs = [
    { id: 1, name: t("categories") },
    { id: 2, name: t("categories_sub_category") },
  ];
  return (
    <div className="categorytabswrapper">
      <div className="d-flex flex-lg-wrap  gap-3 mt-2 allTabBox ">
        {CategoryTabs.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`tabName ${
                active?.name == item.name ? "activeTab" : ""
              }`}
              onClick={() => {
                setActive(item);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      <div>
        {" "}
        <hr />{" "}
      </div>
    </div>
  );
};

export default CategoryTabs;
