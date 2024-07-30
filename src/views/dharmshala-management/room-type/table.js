import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "reactstrap";

import { deleteRoomTypeInfo } from "../../../api/dharmshala/dharmshalaInfo";
import deleteIcon from "../../../assets/images/icons/category/deleteIcon.svg";
import editIcon from "../../../assets/images/icons/category/editIcon.svg";
import CustomDharmshalaTable from "../../../components/partials/CustomDharmshalaTable";
import { RoomTypeInfoTableWrapper } from "../dharmshalaStyles";
import "../dharmshala_css/roomtypetable.css";

const RoomTypeInfoTable = ({
  data = [],
  maxHeight,
  height,
  currentFilter,
  currentStatus,
  currentPage,
  isMobileView,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleDeleteRoomType = async (payload) => {
    return deleteRoomTypeInfo(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteRoomType,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["RoomTypeList"]);
      }
    },
  });

  const RoomTypesInfo = useMemo(() => {
    return data?.map((item, idx) => ({
      id: idx + 1,
      name: item?.name,
      description: item?.description,
      capacity: item?.capacity,
      price: item?.price,
      edit: (
        <img
          src={editIcon}
          width={35}
          className="cursor-pointer"
          onClick={() => {
            history.push(
              `/roomtype/info/${item?._id}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}&name=${item?.name}&description=${item?.description}&capacity=${item?.capacity}&price=${item?.price}`
            );
          }}
        />
      ),
      delete: (
        <img
          src={deleteIcon}
          width={35}
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            Swal.fire({
              title: t("dharmshala_roomtype_delete"),
              text: t("dharmshala_roomtype_delete_sure"),
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: t("confirm"),
              cancelButtonText: t("cancel"),
            }).then((result) => {
              if (result.isConfirmed) {
                deleteMutation.mutate(item._id);
              }
            });
          }}
        />
      ),
    }));
  }, [data]);

  return (
    <RoomTypeInfoTableWrapper>
      {isMobileView ? (
        <div className="card-container">
          {RoomTypesInfo.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
              <div className="card-content">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text">{item.capacity}</p>
                <p className="card-text">{item.price}</p>
              </div>
              <div className="card-icons">
                  {item.edit}
                  {item.delete}
              </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CustomDharmshalaTable
          maxHeight={maxHeight}
          height={height}
          columns={[
            {
              name: t("name"),
              selector: (row) => row.name,
              width: "200px",
            },
            {
              name: t("description"),
              selector: (row) => row.description,
              width: "300px",
            },
            {
              name: t("capacity"),
              selector: (row) => row.capacity,
              width: "200px",
            },
            {
              name: t("price"),
              selector: (row) => row.price,
              width: "200px",
            },
            {
              name: t(""),
              width: "800px",
            },
            {
              name: t(""),
              selector: (row) => row.edit,
              width: "80px",
            },
            {
              name: t(""),
              selector: (row) => row.delete,
              width: "80px",
            },
          ]}
          data={RoomTypesInfo}
        />
      )}
    </RoomTypeInfoTableWrapper>
  );
};

export default RoomTypeInfoTable;
