import React from "react";
import styled from "styled-components";
import noNewsIcon from "../../assets/images/icons/news/noNewsIcon.svg";
import "../../assets/scss/common.scss";

export default function NoContent({ headingNotfound, para }) {
  return (
    <div className="nocontentwrapper">
      <div className="d-flex flex-column justify-content-center align-items-center w-100">
        <img src={noNewsIcon} />
        <div className="noNews">{headingNotfound}</div>
        <div className="noNewsMass">{para}</div>
      </div>
    </div>
  );
}
