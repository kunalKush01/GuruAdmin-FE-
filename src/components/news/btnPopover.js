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
  const PopoverWarper = styled.div`
    .popover {
      background: #fff7e8 !important;
    }
  `;
  return (
    <PopoverWarper>
      <UncontrolledPopover
        flip
        placement="bottom"
        target={target}
        trigger="legacy"
      >
        {title && <PopoverHeader>{title}</PopoverHeader>}
        {content && <PopoverBody>{content}</PopoverBody>}
      </UncontrolledPopover>
    </PopoverWarper>
  );
}
