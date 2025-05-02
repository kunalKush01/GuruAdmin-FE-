import React, { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Button,
  Drawer,
  List,
  Avatar,
  Card,
  Collapse,
  Space,
  Checkbox,
  Tag,
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
} from "antd";
import "../../assets/scss/common.scss";
import moment from "moment";
import Swal from "sweetalert2";
import { matchTransaction } from "../../api/suspenseApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fundTransfer, getAllAccounts } from "../../api/profileApi";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { toast } from "react-toastify";
import he from "he";
const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
function PossibleMatchedDrawer({
  isDrawerOpen,
  setIsPossibleMatchedRecordOpen,
  handleDrawerClose,
  selectedRowKeys,
  selectedRowsData,
  matchedData = [],
}) {
  const queryClient = useQueryClient();
  const trustId = localStorage.getItem("trustId");
  const [drawerTab, setDrawerTab] = useState("match");
  const [selectedPossibleMatches, setSelectedPossibleMatches] = useState([]);
  const handleCheckboxChange = (record) => {
    setSelectedPossibleMatches((prev) => {
      const exists = prev.some((item) => item.recordId === record.recordId);
      if (exists) {
        return prev.filter((item) => item.recordId !== record.recordId);
      } else {
        return [...prev, record];
      }
    });
  };
  const handleSelectAll = (list, event) => {
    event.stopPropagation();

    const allSelected = list.every((item) =>
      selectedPossibleMatches.some((sel) => sel.recordId === item.recordId)
    );

    setSelectedPossibleMatches(allSelected ? [] : list);
  };

  const coloredMatchedData = useMemo(() => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#1890ff",
      "#13c2c2",
    ];
    const getRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];

    return matchedData.map((item) => ({
      ...item,
      color: getRandomColor(),
    }));
  }, [matchedData]);
  const bestMatches = useMemo(
    () => coloredMatchedData.filter((item) => item.confidence === "high"),
    [coloredMatchedData]
  );

  const possibleMatches = useMemo(
    () => coloredMatchedData.filter((item) => item.confidence === "low"),
    [coloredMatchedData]
  );
  const totalSuspenseAmount = selectedRowsData.reduce((acc, row) => {
    const amount = row.creditedAmount ?? row.debitedAmount ?? 0;
    return acc + amount;
  }, 0);

  const totalMatchedAmount = selectedPossibleMatches.reduce(
    (acc, row) => acc + (row.amount || 0),
    0
  );
  const pendingAmount = parseFloat(
    (totalSuspenseAmount - totalMatchedAmount).toFixed(2)
  );

  //   const bestMatches = useMemo(
  //     () => matchedData.filter((item) => item.confidence === "high"),
  //     [matchedData]
  //   );

  //   const possibleMatches = useMemo(
  //     () => matchedData.filter((item) => item.confidence === "low"),
  //     [matchedData]
  //   );
  const handleMatchButtonClick = async (item) => {
    const isArray = Array.isArray(item);
    const records = isArray ? item : [item];
    const requiredModels = ["Donation", "Expense", "FinancialTransaction"];

    const transactionMap = records.reduce((acc, record) => {
      const { model, recordId } = record;
      if (!acc[model]) {
        acc[model] = [];
      }
      acc[model].push(recordId);
      return acc;
    }, {});
    requiredModels.forEach((model) => {
      if (!transactionMap[model]) {
        transactionMap[model] = [];
      }
    });
    const payload = {
      suspenseIds: selectedRowKeys,
      transactionMap,
      trustId: trustId, // or dynamically pull this if needed
      matchReason: "Mixed transaction reconciliation",
    };
    // console.log("payload:", payload);
    // return;
    try {
      const response = await matchTransaction(payload);
      // Optional: check response if your API returns a success flag
      if (response?.error) {
        throw new Error("Something went wrong.");
      }
      queryClient.invalidateQueries("suspenseData");
      setIsPossibleMatchedRecordOpen(false);
      Swal.fire({
        icon: "success",
        title: "Matched successfully!",
        text: "The suspense records have been updated.",
        confirmButtonColor: "#1890ff",
      });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      Swal.fire({
        icon: "error",
        title: "Match failed",
        text: errorMsg,
        confirmButtonColor: "#ff4d4f",
      });
    }
  };
  const getTagColor = (model) => {
    switch (model) {
      case "Donation":
        return "green";
      case "Expense":
        return "volcano";
      case "FinancialTransaction":
        return "blue";
      default:
        return "default";
    }
  };

  const renderMatchList = (data, isPossible = false) => (
    <>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: item.color }}>
                      {item.name[0]}
                    </Avatar>
                  }
                  title={
                    <span className="commonSmallFont d-flex align-items-center">
                      <span className="me-1">
                        {item.name} | ₹{item.amount}{" "}
                      </span>
                      <Tag color={getTagColor(item.model)}>{item.model}</Tag>
                    </span>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <div className="commonFontFamily commonFontColor">
                        Dated {moment(item.date).format("DD MMM YYYY")}
                      </div>
                      <div
                        className="commonFontFamily commonFontColor"
                        dangerouslySetInnerHTML={{ __html: `Remark: ${he.decode(item.remark)}` }}
                      />
                    </Space>
                  }
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  {isPossible ? (
                    <Checkbox
                      checked={selectedPossibleMatches.some(
                        (selected) => selected.recordId === item.recordId
                      )}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  ) : (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleMatchButtonClick(item)}
                    >
                      Match
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
  //**create new transaction */
  const [transactionType, setTransactionType] = useState("donation");

  const [form] = Form.useForm();
  const [isTransactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
  const handleCreateTransactionClick = () => {
    setTransactionDrawerOpen(true);
  };

  //**get accounts list */
  const { data } = useQuery(["Accounts"], () => getAllAccounts(), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching member data:", error);
    },
  });
  const allAccounts = useMemo(() => data?.result ?? [], [data]);
  const bankAccounts = allAccounts.filter(
    (acc) =>
      acc.type === "asset" && acc.subType === "bank" && acc.isSystem !== true
  );
  const getToAccountId = (transactionType) => {
    if (transactionType === "donation") {
      // System-defined bank_interest income account
      const interestAccount = allAccounts.find(
        (acc) =>
          acc.isSystem &&
          acc.type === "income" &&
          acc.subType === "bank_interest"
      );
      return interestAccount?.id || "";
    } else if (transactionType === "expense") {
      // System-defined uncategorised expense account
      const uncategorisedExpense = allAccounts.find(
        (acc) =>
          acc.isSystem && acc.type === "expense" && acc.subType === "expense"
      );
      return uncategorisedExpense?.id || "";
    }
    return "";
  };

  const handleSaveTransaction = () => {
    form.submit();
  };
  const handleFormFinish = async (values) => {
    const payload = {
      createdAt: values.date ? values.date.toISOString() : null,
      fromAccountId: values.account,
      toAccountId: getToAccountId(transactionType),
      narration: values.narration || "",
      amount: values.amount || 0,
      type: transactionType == "donation" ? "bank_interest" : "other_expense",
    };

    try {
      const response = await fundTransfer(payload); // Assuming this returns success status or data
      if (response?.error) {
        toast.error("Transaction failed. Please try again.");
      } else if (response?.result) {
        toast.success("Transaction created successfully!");
        form.resetFields(); // Clear the form
        queryClient.invalidateQueries("matchedData"); // Refetch relevant data
        setTransactionDrawerOpen(false); // Close drawer
      } else {
        toast.error("Unexpected response. Please contact support.");
      }
    } catch (error) {
      console.error("Error in fundTransfer:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };
  const selectedSuspenseDate = selectedRowsData[0]; // or any selected row
  useEffect(() => {
    if (isTransactionDrawerOpen) {
      form.setFieldsValue({
        amount: pendingAmount > 0 ? pendingAmount : 0,
      });
    }
  }, [pendingAmount, isTransactionDrawerOpen, form]);

  return (
    <div>
      {" "}
      <Drawer
        className="no-padding-drawer"
        title={
          <Tabs
            activeKey={drawerTab}
            onChange={setDrawerTab}
            size="small"
            style={{ marginBottom: "-16px" }}
          >
            <TabPane tab="Match Transaction" key="match" />
            <TabPane tab="Categorize Manually" key="categorize" />
          </Tabs>
        }
        width={600} // Increased drawer width
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        footer={
          drawerTab === "match" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Button type="dashed" onClick={handleCreateTransactionClick}>
                  + Create New Transaction
                </Button>
                <div>
                  <strong className="commonSmallFont commonFontFamily">
                    Pending Amount:
                  </strong>{" "}
                  <span
                    style={{ color: pendingAmount < 0 && "red" }}
                    className="commonFontFamily commonFontColor"
                  >
                    ₹{pendingAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div style={{ padding: "8px 16px" }}>
                <Button
                  type="primary"
                  disabled={selectedPossibleMatches.length === 0}
                  onClick={() =>
                    handleMatchButtonClick(selectedPossibleMatches)
                  }
                  style={{
                    opacity: selectedPossibleMatches.length === 0 ? 0.5 : 1,
                    marginRight: 8,
                  }}
                >
                  Match
                </Button>
                <Button onClick={handleDrawerClose}>Cancel</Button>
              </div>
            </div>
          )
        }
      >
        {drawerTab === "match" && (
          <Collapse
            defaultActiveKey={["best", "possible"]}
            bordered={false}
            expandIconPosition="end"
          >
            <Panel header="Best Matches" key="best">
              {renderMatchList(bestMatches, false)}
            </Panel>
            <Panel
              extra={
                <Checkbox
                  checked={possibleMatches.every((item) =>
                    selectedPossibleMatches.some(
                      (sel) => sel.recordId === item.recordId
                    )
                  )}
                  indeterminate={
                    possibleMatches.some((item) =>
                      selectedPossibleMatches.some(
                        (sel) => sel.recordId === item.recordId
                      )
                    ) &&
                    !possibleMatches.every((item) =>
                      selectedPossibleMatches.some(
                        (sel) => sel.recordId === item.recordId
                      )
                    )
                  }
                  onClick={(e) => handleSelectAll(possibleMatches, e)}
                >
                  Select All
                </Checkbox>
              }
              header="Possible Match List"
              key="possible"
            >
              {renderMatchList(possibleMatches, true)}
            </Panel>
          </Collapse>
        )}

        {drawerTab === "categorize" && (
          <div style={{ padding: "10px" }}>Coming Soon.</div>
        )}
      </Drawer>
      {/* Financial Transactions */}
      <Drawer
        title="Create New Transaction"
        width={600}
        onClose={() => setTransactionDrawerOpen(false)}
        open={isTransactionDrawerOpen}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setTransactionDrawerOpen(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleSaveTransaction}>
              Save
            </Button>
          </div>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormFinish}
          initialValues={{
            date: selectedSuspenseDate?.transactionDate
              ? moment(selectedSuspenseDate.transactionDate)
              : null,
            account: "",
            amount: pendingAmount ?? "",
            narration: "",
          }}
        >
          {" "}
          <Form.Item label="" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label className="commonSmallFont">Type:</label>
              <Radio.Group
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <Radio value="donation" style={{ color: "#533810" }}>
                  Donation
                </Radio>
                <Radio value="expense" style={{ color: "#533810" }}>
                  Expense
                </Radio>
              </Radio.Group>
            </div>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <CustomDatePicker
              format="DD MMM YYYY"
              defaultValue={
                selectedSuspenseDate?.transactionDate
                  ? moment(selectedSuspenseDate.transactionDate)
                  : null
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select Account">
              {bankAccounts.map((acc) => (
                <Option key={acc.id} value={acc.id}>
                  {acc.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item label="Remark" name="narration">
            <TextArea placeholder="Enter Remark" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default PossibleMatchedDrawer;
