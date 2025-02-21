import React from "react";
import { Descriptions } from "antd";

const ImageObservation = () => {
  const borderedItems = [
    {
      key: "1",
      label: "Image Observation",
      children: "Amount Matched  100% ",
      labelStyle: { width: "150px", minWidth: "150px", whiteSpace: "nowrap" }, // Controls label width
    },
  ];

  return (
      <Descriptions bordered size="small" column={1} items={borderedItems} />
  );
};

export default ImageObservation;
