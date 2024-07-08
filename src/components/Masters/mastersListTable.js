import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteCategoryDetail } from "../../api/categoryApi";
import CustomDataTable from "../partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const MasterTableWarapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
`;

export function MasterListTable({
  data,
  //   page,
  //   currentPage,
  //   currentFilter,
  //   subPermission,
  //   allPermissions,
}) {
  const handleDeleteCategory = async (payload) => {
    return deleteCategoryDetail(payload);
  };
  const queryCient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeleteCategory,
    onSuccess: (data) => {
      if (!data.error) {
        queryCient.invalidateQueries(["Categories"]);
      }
    },
  });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: "Serial Number",
      selector: (row) => row.id,
      width: "200px",
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
    },
    {
      name: t("Names"),
      selector: (row) => row.name,
      width: "220px",
    },
  ];

  // const langList = useSelector((state) => state.auth.availableLang);

  const masterList = useMemo(() => {
    return data.map((item, idx) => ({
      id: idx + 1,
      name: (
        <div className="d-flex align-items-center">
          <Link
            to={`/configuration/masters/info/${item.id}`}
          >
            {ConverFirstLatterToCapital(item.name ?? "-")}
          </Link>
        </div>
      ),
    }));
  }, [data]);

  return (
    <MasterTableWarapper>
      <CustomDataTable
        // minWidth="fit-content"
        maxHeight={""}
        columns={columns}
        data={masterList}
      />
    </MasterTableWarapper>
  );
}
