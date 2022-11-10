import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import dropDownIcon from "../../assets/images/icons/dashBoard/dropDownIcon.svg";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

export const CustomDropDown = ({
  i18nKeyDropDownItemArray,
  defaultDropDownName,
  ItemListArray,
  setdropDownName,
  ...props
}) => {
  const DropDownWarper = styled.div`
    .btn-secondary {
      background-color: white !important;
      border: 1px solid #ff8744 !important ;
      color: #ff8744 !important;
      font: normal normal bold 15px/20px noto sans !important;
      width: 150px;
      text-align: left;
      padding: 8px 10px;
      position: relative;
    }
    .btn-secondary:focus {
      background-color: white !important;
      border: 1px solid #ff8744 !important ;
      color: #ff8744 !important;
      font: normal normal bold 15px/20px noto sans !important;
      width: 150px;
      text-align: left;
      padding: 8px 10px;
    }
    .dropdown-toggle::after {
      border: none !important;
      background-image: url("${dropDownIcon}");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 25px;

      /* margin-left: 40px; */
      position: absolute;
      right: 10px;
      top: 40%;
      left: inherit;
    }
    .dropdown-menu {
      min-width: 150px;
      background: #fff7e8;
      .dropdown-item {
        color: #583703;
        width: 100%;
        font: normal normal normal 15px/20px noto sans;
        padding: 8px 10px;
        :hover {
          color: #fff;
          background: #ff8744;
        }
      }
    }
  `;
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLangCode);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleDropDownClick = (e) => {
    e.preventDefault();
    i18nKeyDropDownItemArray && setdropDownName(e.target.name.toLowerCase());
    ItemListArray && setdropDownName(e.target.name);
  };

  return (
    <DropDownWarper>
      {i18nKeyDropDownItemArray && (
        <Dropdown
          className="text-end py-2  "
          isOpen={dropdownOpen}
          toggle={toggle}
          direction={"down"}
          {...props}
        >
          <DropdownToggle caret>
            <Trans i18nKey={defaultDropDownName} />
          </DropdownToggle>
          <DropdownMenu>
            {i18nKeyDropDownItemArray.map((item, idx) => {
              return (
                <DropdownItem
                  onClick={handleDropDownClick}
                  key={idx}
                  name={item.key}
                >
                  <Trans i18nKey={item.key} />
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      )}
      {ItemListArray && (
        <Dropdown
          className="text-end py-2   "
          isOpen={dropdownOpen}
          toggle={toggle}
          direction={"down"}
          {...props}
        >
          <DropdownToggle caret>{defaultDropDownName}</DropdownToggle>
          <DropdownMenu>
            {ItemListArray.map((item, idx) => {
              return (
                <DropdownItem
                  onClick={handleDropDownClick}
                  key={idx}
                  name={item}
                >
                  {item}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      )}
    </DropDownWarper>
  );
};
