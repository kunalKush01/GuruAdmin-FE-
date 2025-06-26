import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Permission = ({ subPermission, type, isGaushala = "", ...props }) => {
  const permissions = useSelector((state) => state.auth.userDetail.permissions);
  const hasDharmshalaAccess =
  useSelector(
    (state) => state.auth.trustDetail?.hasDharmshala
  );

  const isSevaEnabled = useSelector(
    (state) => state.auth.trustDetail?.isSevaEnabled
  );

  const permissionRoute = permissions?.find(
    (item) => item?.name === type || item?.name === "all"
  );
  let subPermissionArr = [];

  const mypermissions = permissions?.map((item) => {
    if (item?.name === permissionRoute?.name) {
      subPermissionArr = [...subPermissionArr, ...item?.subpermissions];
    }
  });

  const subPermissionRoute = subPermissionArr?.map((item) =>
    item?.name ? item?.name : ""
  );
  const navigate = useNavigate();
  const trustsModal = localStorage.getItem("trustsModal");
  const trustType = localStorage.getItem("trustType");

  if (hasDharmshalaAccess !== undefined) {
    if (
      (["dharmshala/dashboard", 
        "dharmshala/bookings", 
        "dharmshala/buildings", 
        "dharmshala/roomtypes", 
        "dharmshala/feedback"].includes(type)) &&
      !hasDharmshalaAccess
    ) {
      navigate("/not-found");
      return null;
    }
  }

  if (isSevaEnabled !== undefined) {
    if (
      ["service-booking",
       "service"].includes(type) &&
      !isSevaEnabled
    ) {
      navigate("/not-found");
      return null;
    }
  }

  if (
    (trustType?.toLowerCase() == isGaushala?.toLowerCase() &&
      permissionRoute?.name === "all") ||
    (trustType?.toLowerCase() == isGaushala?.toLowerCase() &&
      !!permissionRoute &&
      subPermissionRoute.includes(subPermission))
  ) {
    if (!trustsModal) {
      return props.children;
    } else {
      navigate("/not-found");
    }
  } else if (
    (permissionRoute?.name === "all" &&
      !trustType?.toLowerCase() == isGaushala?.toLowerCase()) ||
    (!!permissionRoute &&
      subPermissionRoute.includes(subPermission) &&
      !trustType?.toLowerCase() == isGaushala?.toLowerCase())
  ) {
    if (!trustsModal) {
      return props.children;
    } else {
      navigate("/not-found");
    }
  } else if (type === "notification" || type === "editProfile") {
    if (!trustsModal) {
      return props.children;
    } else {
      navigate("/not-found");
    }
  } else {
    navigate("/not-found");
  }
  return <div></div>;
};

export default Permission;
