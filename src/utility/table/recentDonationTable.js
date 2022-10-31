import DataTable from "react-data-table-component";
import styled from "styled-components";
import Condition from "yup/lib/Condition";

export function RecentDonationTable() {
  const DataTableWarraper = styled.div`
    color: #583703 !important;
    margin-right: 20px;
     
    .recentDonetionList {
        cursor: all-scroll;
      max-width: 70rem;
      border: 2px solid #ff8744;
      overflow: auto;
      border-radius: 10px;
      max-height: 38rem;
      ::-webkit-scrollbar{
        display: none;
      }
      
     
      .bqopOU {
        color: #583703 !important;
        font: normal normal normal 12px/23px Noto Sans;
      }

      .iYmPDL {
        color: #583703 !important;
        border: 0px !important;
        font: normal normal bold 15px/23px Noto Sans;
      }
      .dTRIqN:not(:last-of-type) {
        color: #583703 !important;
        border: 0px !important;
      }
    }
  `;

  const columns = [
    {
      name: "Donor Name",
      selector: (row) => row.name,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Commitment Id",
      selector: (row) => row.commitment,
    },
    {
      name: "Receipt",
      selector: (row) => row.receipt,
    },
    {
      name: "Action",
      selector: (row) => row.action,
    },
  ];

  const conditionStyle = {
    when: (row) => row.id % 2 !== 0,
    style: {
      backgroundColor: "#FFF7E8",
    },
  };

  const data = [
    {
      id: 1,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 2,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 3,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 4,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 5,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 6,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 7,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 8,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 9,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 10,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 11,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 12,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 13,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 14,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 15,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 16,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 17,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 18,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },

    {
      id: 19,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
    {
      id: 20,
      name: "Lalit Kishor Upadhyay",
      mobile: "8619721800",
      type: "bank",
      date: "22/12/2022",
      status: "Complete",
      amount: "500000",
      commitment: "200000",
      receipt: <img src="" />,
      action: "",
    },
  ];
  return (
    <DataTableWarraper>
      <DataTable
        conditionalRowStyles={[conditionStyle]}
        className="recentDonetionList"
        columns={columns}
        data={data}
      />
    </DataTableWarraper>
  );
}
