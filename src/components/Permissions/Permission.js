import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Permission = ({ subPermission, type, ...props }) => {
  console.log("type", type);
  const permissions = useSelector((state) => state.auth.userDetail.permissions);

  // const subPermissions = permissions?.map((item) => item?.subpermissions);
  // subPermissions?.map((item) => {
  //   let temp = item.map((item2) => {
  //     console.log("item in newArr", item2);
  //     nameArr.push({ name: item2.name });
  //   });
  //   return item;
  // });

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
  console.log("map debug", subPermissionRoute, permissionRoute, subPermission);
  const history = useHistory();
  // if (permissionRoute?.name === "all" || (!!permissionRoute && subPermissionArr?.name === "")) {
  if (
    permissionRoute?.name === "all" ||
    (!!permissionRoute && subPermissionRoute.includes(subPermission))
  ) {
    return props.children;
  } else if (type === "notification" || type === 'editProfile') {
    return props.children;
  } else {
    history.push("/not-found");
  }
  return <div></div>;
};

export default Permission;
