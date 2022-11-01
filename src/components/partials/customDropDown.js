
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

export const  CustomDropDown =({i18nKeyDropDownItemArray,dropDownNameKey})=>{
    const DropDownWarper = styled.div`
    
    .btn-secondary {
      background-color: white !important;
      border: 1px solid #ff8744 !important ;
      color: #ff8744 !important;
      font: normal normal bold 15px/20px noto sans !important;
      width: 150px;
      text-align: left;
      padding: 5px 5px;
    }
    .dropdown-toggle::after {
      border: none !important;      
      background-image: url("${dropDownIcon}");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 25px;
      
      margin-left: 45px;
    }
  `;
  const { t } = useTranslation();
    const selectedLang = useSelector(state=>state.auth.lang)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropDownName, setdropDownName] = useState(dropDownNameKey);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    
    const handleDropDownClick = (e) => {
      e.preventDefault();
      setdropDownName(e.target.name.toLowerCase());
    };
    
    return(
        <DropDownWarper>
        <Dropdown
          className="text-end py-2  "
          isOpen={dropdownOpen}
          toggle={toggle}
          direction={"down"}
        >
          <DropdownToggle  caret>
            <Trans i18nKey={dropDownName} />
          </DropdownToggle>
          <DropdownMenu>
            {
                i18nKeyDropDownItemArray.map((item)=>{
                    return(
                        <DropdownItem onClick={handleDropDownClick} name={item.key}>
              <Trans i18nKey={item.key} />
            </DropdownItem>
                    )        
                })
            }
            
          </DropdownMenu>
        </Dropdown>
      </DropDownWarper>
    )
}
