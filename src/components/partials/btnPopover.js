import React from "react";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledPopover,
} from "reactstrap";
import styled from "styled-components";

export default function BtnPopover({ target, title, content }) {
  return (
    <div style={{backgroundColor:'#583703'}}>
      <UncontrolledPopover
        placement="bottom"
        target={target}
        trigger="legacy"
        
      >
        {title && <PopoverHeader>{title}</PopoverHeader>}
        {content && <PopoverBody>{content}</PopoverBody>}
      </UncontrolledPopover>
    </div>
  );
}
