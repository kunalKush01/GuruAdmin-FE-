// ** React Imports
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
// ** Horizontal Menu Components
import HorizontalNavMenuItems from "./HorizontalNavMenuItems";
import { useTranslation, Trans } from "react-i18next";
const HorizontalMenu = ({ menuData, currentActiveItem, routerProps }) => {
  
  

  const history = useHistory();

  const SubHeaderWarraper = styled.div`
    font: normal normal bold 15px/20px noto sans;
    cursor: pointer;
    
  `;

  return (
    <div
      className="navbar-container w-100 main-menu-content"
      
    >
      <ul
        className="nav navbar-nav justify-content-between  "
        id="main-menu-navigation"
      >
        {/* <HorizontalNavMenuItems
          submenu={false}
          items={menuData}
          activeItem={activeItem}
          groupActive={groupActive}
          routerProps={routerProps}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          openDropdown={openDropdown}
          setActiveItem={setActiveItem}
          setGroupActive={setGroupActive}
          setOpenDropdown={setOpenDropdown}
          currentActiveItem={currentActiveItem}
        /> */}

        {menuData.map((item, idx) => {
          return (
            <SubHeaderWarraper
              onClick={() => history.push(item.url)}
              key={idx}
              className="text-light   "
            >
              <Trans i18nKey={item.name} />
            </SubHeaderWarraper>
          );
        })}
      </ul>
    </div>
  );
};

export default HorizontalMenu;
