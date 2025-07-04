"use client"

import React, { useState, useReducer, useMemo, useRef } from "react"
import {
  Card,
  CustomDropdown,
  Button,
  ActionBar,
  SubmitBar,
  Table,
  TextInput,
  LabelFieldPair,
  CardLabel,
  TextArea,
  Header,
  Toast,
  DeleteIconv2,
  FileUploadModal,
  BreakLine,
  UploadIcon,
  DatePicker,
} from "@egovernments/digit-ui-react-components"
import { useTranslation } from "react-i18next"

// Dummy data configurations
const voucherSubTypeConfig = {
  label: "VOUCHER_SUB_TYPE",
  type: "dropdown",
  isMandatory: true,
  disable: false,
  populators: {
    name: "voucherSubType",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "payment", label: "Payment Voucher" },
      { code: "receipt", label: "Receipt Voucher" },
      { code: "journal", label: "Journal Voucher" },
      { code: "contra", label: "Contra Voucher" },
    ],
    styles: { width: "100%" },
  },
}

const fundConfig = {
  label: "FUND",
  type: "dropdown",
  isMandatory: true,
  disable: false,
  populators: {
    name: "fund",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "general", label: "General Fund" },
      { code: "special", label: "Special Fund" },
      { code: "reserve", label: "Reserve Fund" },
    ],
    styles: { width: "100%" },
  },
}

const schemeConfig = {
  label: "SCHEME",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "scheme",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "scheme1", label: "Urban Development Scheme" },
      { code: "scheme2", label: "Rural Development Scheme" },
      { code: "scheme3", label: "Infrastructure Scheme" },
    ],
    styles: { width: "100%" },
  },
}

const fundSourceConfig = {
  label: "FUND_SOURCE",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "fundSource",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "state", label: "State Government" },
      { code: "central", label: "Central Government" },
      { code: "local", label: "Local Body" },
    ],
    styles: { width: "100%" },
  },
}

const functionConfig = {
  label: "FUNCTION",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "function",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "admin", label: "Administration" },
      { code: "development", label: "Development" },
      { code: "maintenance", label: "Maintenance" },
    ],
    styles: { width: "100%" },
  },
}

const departmentConfig = {
  label: "DEPARTMENT",
  type: "dropdown",
  isMandatory: true,
  disable: false,
  populators: {
    name: "department",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "finance", label: "Finance Department" },
      { code: "admin", label: "Administration Department" },
      { code: "engineering", label: "Engineering Department" },
    ],
    styles: { width: "100%" },
  },
}

const subSchemeConfig = {
  label: "SUB_SCHEME",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "subScheme",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "sub1", label: "Road Development" },
      { code: "sub2", label: "Water Supply" },
      { code: "sub3", label: "Sanitation" },
    ],
    styles: { width: "100%" },
  },
}

const accountCodeConfig = {
  label: "ACCOUNT_CODE",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "accountCode",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "1001", label: "1001 - Cash in Hand" },
      { code: "1002", label: "1002 - Bank Account" },
      { code: "2001", label: "2001 - Accounts Payable" },
      { code: "3001", label: "3001 - Revenue Account" },
    ],
    styles: { width: "100%" },
  },
}

const ledgerTypeConfig = {
  label: "TYPE",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "type",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "vendor", label: "Vendor" },
      { code: "employee", label: "Employee" },
      { code: "contractor", label: "Contractor" },
    ],
    styles: { width: "100%" },
  },
}

const approverDepartmentConfig = {
  label: "APPROVER_DEPARTMENT",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "approverDepartment",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "finance", label: "Finance Department" },
      { code: "admin", label: "Administration Department" },
    ],
    styles: { width: "100%" },
  },
}

const approverDesignationConfig = {
  label: "APPROVER_DESIGNATION",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "approverDesignation",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "manager", label: "Manager" },
      { code: "director", label: "Director" },
      { code: "secretary", label: "Secretary" },
    ],
    styles: { width: "100%" },
  },
}

const approverConfig = {
  label: "APPROVER",
  type: "dropdown",
  isMandatory: false,
  disable: false,
  populators: {
    name: "approver",
    optionsKey: "label",
    optionsCustomStyle: { top: "2.3rem" },
    options: [
      { code: "john_doe", label: "John Doe" },
      { code: "jane_smith", label: "Jane Smith" },
      { code: "mike_johnson", label: "Mike Johnson" },
    ],
    styles: { width: "100%" },
  },
}

// Reducer for account details
const accountDetailsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ROW":
      return [
        ...state,
        {
          id: Date.now(),
          accountCode: "",
          accountHead: "",
          debitAmount: "",
          creditAmount: "",
        },
      ]
    case "UPDATE_ROW":
      return state.map((row) =>
        row.id === action.state.id ? { ...row, [action.state.type]: action.state.value } : row,
      )
    case "DELETE_ROW":
      return state.filter((row) => row.id !== action.state.row.original.id)
    case "CLEAR_STATE":
      return [{ id: 1, accountCode: "", accountHead: "", debitAmount: "", creditAmount: "" }]
    default:
      return state
  }
}

// Reducer for sub-ledger details
const subLedgerReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ROW":
      return [
        ...state,
        {
          id: Date.now(),
          accountCode: "",
          type: "",
          code: "",
          name: "",
          amount: "",
        },
      ]
    case "UPDATE_ROW":
      return state.map((row) =>
        row.id === action.state.id ? { ...row, [action.state.type]: action.state.value } : row,
      )
    case "DELETE_ROW":
      return state.filter((row) => row.id !== action.state.row.original.id)
    case "CLEAR_STATE":
      return [{ id: 1, accountCode: "", type: "", code: "", name: "", amount: "" }]
    default:
      return state
  }
}

const initialAccountState = [
  { id: 1, accountCode: "", accountHead: "", debitAmount: "", creditAmount: "" },
  { id: 2, accountCode: "", accountHead: "", debitAmount: "", creditAmount: "" },
]

const initialSubLedgerState = [{ id: 1, accountCode: "", type: "", code: "", name: "", amount: "" }]

const ReceiptNewform = () => {
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const inputRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    voucherDate: "27/05/2025",
    voucherSubType: null,
    partyBillNumber: "",
    partyBillDate: "",
    fund: null,
    scheme: null,
    fundSource: null,
    function: null,
    narration: "",
    partyName: "",
    billNumber: "",
    billDate: "",
    department: null,
    subScheme: null,
  })

  // Approval state
  const [approvalData, setApprovalData] = useState({
    approverDepartment: null,
    approverDesignation: null,
    approver: null,
    approverRemarks: "",
  })

  // Account details state
  const [accountDetails, dispatchAccountDetails] = useReducer(accountDetailsReducer, initialAccountState)

  // Sub-ledger details state
  const [subLedgerDetails, dispatchSubLedger] = useReducer(subLedgerReducer, initialSubLedgerState)

  // Calculate totals
  const totalDebit = useMemo(() => {
    return accountDetails.reduce((sum, row) => {
      const amount = Number.parseFloat(row.debitAmount) || 0
      return sum + amount
    }, 0)
  }, [accountDetails])

  const totalCredit = useMemo(() => {
    return accountDetails.reduce((sum, row) => {
      const amount = Number.parseFloat(row.creditAmount) || 0
      return sum + amount
    }, 0)
  }, [accountDetails])

  const handleDeleteAccountRow = ({ row, val, col }) => {
    dispatchAccountDetails({
      type: "DELETE_ROW",
      state: { row },
    })
  }

  const handleDeleteSubLedgerRow = ({ row, val, col }) => {
    dispatchSubLedger({
      type: "DELETE_ROW",
      state: { row },
    })
  }

  // Account Details columns
  const accountColumns = useMemo(
    () => [
      {
        Header: "Account Code",
        accessor: "accountCode",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <TextInput
              className={"field"}
              textInputStyle={{ width: "90%", marginLeft: "2%" }}
              onChange={(e) => {
                dispatchAccountDetails({
                  type: "UPDATE_ROW",
                  state: {
                    id: row.original.id,
                    value: e.target.value,
                    type: "accountCode",
                  },
                })
              }}
              value={accountDetails[row.index]?.accountCode || ""}
              style={{ marginBottom: "0px" }}
            />
          )
        },
      },
      {
        Header: "Account Head",
        accessor: "accountHead",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <TextInput
              className={"field"}
              textInputStyle={{ width: "90%", marginLeft: "2%" }}
              onChange={(e) => {
                dispatchAccountDetails({
                  type: "UPDATE_ROW",
                  state: {
                    id: row.original.id,
                    value: e.target.value,
                    type: "accountHead",
                  },
                })
              }}
              value={accountDetails[row.index]?.accountHead || ""}
              style={{ marginBottom: "0px" }}
            />
          )
        },
      },
      {
        Header: "Debit Amount",
        accessor: "debitAmount",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <TextInput
              className={"field"}
              textInputStyle={{ width: "90%", marginLeft: "2%" }}
              onChange={(e) => {
                dispatchAccountDetails({
                  type: "UPDATE_ROW",
                  state: {
                    id: row.original.id,
                    value: e.target.value,
                    type: "debitAmount",
                  },
                })
              }}
              value={accountDetails[row.index]?.debitAmount || ""}
              style={{ marginBottom: "0px" }}
            />
          )
        },
      },
      {
        Header: "Credit Amount",
        accessor: "creditAmount",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <TextInput
              className={"field"}
              textInputStyle={{ width: "90%", marginLeft: "2%" }}
              onChange={(e) => {
                dispatchAccountDetails({
                  type: "UPDATE_ROW",
                  state: {
                    id: row.original.id,
                    value: e.target.value,
                    type: "creditAmount",
                  },
                })
              }}
              value={accountDetails[row.index]?.creditAmount || ""}
              style={{ marginBottom: "0px" }}
            />
          )
        },
      },
      {
        Header: "Add",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <span
              onClick={() => dispatchAccountDetails({ type: "ADD_ROW" })}
              className="icon-wrapper"
              style={{ cursor: "pointer", color: "#00703C" }}
            >
              ➕
            </span>
          )
        },
      },
      {
        Header: "Delete",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <span onClick={() => handleDeleteAccountRow({ row, value, col })} className="icon-wrapper">
              <DeleteIconv2 fill={"#F47738"} />
            </span>
          )
        },
      },
    ],
    [accountDetails],
  )

  // Sub-ledger columns
  const subLedgerColumns = useMemo(
    () => [
      {
        Header: "Account Code",
        accessor: "accountCode",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <div style={{ width: "150px" }}>
              <CustomDropdown
                t={t}
                config={accountCodeConfig.populators}
                onChange={(e) => {
                  dispatchSubLedger({
                    type: "UPDATE_ROW",
                    state: {
                      id: row.original.id,
                      value: e?.code || "",
                      type: "accountCode",
                    },
                  })
                }}
                value={subLedgerDetails[row.index]?.accountCode}
              />
            </div>
          )
        },
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <div style={{ width: "120px" }}>
              <CustomDropdown
                t={t}
                config={ledgerTypeConfig.populators}
                onChange={(e) => {
                  dispatchSubLedger({
                    type: "UPDATE_ROW",
                    state: {
                      id: row.original.id,
                      value: e?.code || "",
                      type: "type",
                    },
                  })
                }}
                value={subLedgerDetails[row.index]?.type}
              />
            </div>
          )
        },
      },
      {
        Header: (
          <span>
            Code <span style={{ color: "red" }}>*</span>
          </span>
        ),
        accessor: "code",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <TextInput
                className={"field"}
                textInputStyle={{ width: "100px" }}
                onChange={(e) => {
                  dispatchSubLedger({
                    type: "UPDATE_ROW",
                    state: {
                      id: row.original.id,
                      value: e.target.value,
                      type: "code",
                    },
                  })
                }}
                value={subLedgerDetails[row.index]?.code || ""}
                style={{ marginBottom: "0px" }}
              />
              <span style={{ cursor: "pointer", fontSize: "16px" }}>🔍</span>
            </div>
          )
        },
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <TextInput
              className={"field"}
              textInputStyle={{ width: "120px" }}
              onChange={(e) => {
                dispatchSubLedger({
                  type: "UPDATE_ROW",
                  state: {
                    id: row.original.id,
                    value: e.target.value,
                    type: "name",
                  },
                })
              }}
              value={subLedgerDetails[row.index]?.name || ""}
              style={{ marginBottom: "0px" }}
            />
          )
        },
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <TextInput
              className={"field"}
              textInputStyle={{ width: "100px" }}
              onChange={(e) => {
                dispatchSubLedger({
                  type: "UPDATE_ROW",
                  state: {
                    id: row.original.id,
                    value: e.target.value,
                    type: "amount",
                  },
                })
              }}
              value={subLedgerDetails[row.index]?.amount || ""}
              style={{ marginBottom: "0px" }}
            />
          )
        },
      },
      {
        Header: "Add",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <span
              onClick={() => dispatchSubLedger({ type: "ADD_ROW" })}
              className="icon-wrapper"
              style={{ cursor: "pointer", color: "#00703C" }}
            >
              ➕
            </span>
          )
        },
      },
      {
        Header: "Delete",
        Cell: ({ value, col, row, ...rest }) => {
          return (
            <span onClick={() => handleDeleteSubLedgerRow({ row, value, col })} className="icon-wrapper">
              <DeleteIconv2 fill={"#F47738"} />
            </span>
          )
        },
      },
    ],
    [subLedgerDetails],
  )

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 5000)
  }

  const handleSubmit = () => {
    // Validation
    if (totalDebit !== totalCredit) {
      setShowToast({
        label: "Debit and Credit amounts must be equal",
        isError: true,
      })
      closeToast()
      return
    }

    // Success message
    setShowToast({
      label: "Journal Voucher saved successfully",
      isError: false,
    })
    closeToast()
  }

  const handleBulkUpload = () => {
    setShowBulkUploadModal(true)
  }

  const onBulkUploadModalSubmit = async (file) => {
    try {
      // Handle bulk upload logic here
      setShowToast({
        label: "Bulk upload completed successfully",
        isError: false,
      })
      setShowBulkUploadModal(false)
      closeToast()
    } catch (error) {
      setShowToast({
        label: error.message || "Invalid file type. Please upload an Excel file.",
        isError: true,
      })
      setShowBulkUploadModal(false)
      closeToast()
    }
  }

  const fileValidator = (errMsg) => {
    setShowToast({
      isError: true,
      label: "Please upload a valid Excel file",
    })
    closeToast()
    setShowBulkUploadModal(false)
  }

  return (
    <React.Fragment>
     <div
       style={{
  fontFamily: "semibold", // Changed hyphen to camelCase
  fontSize: "16px",
  fontWeight: "bold",
  color: "#fff",
  background: "#34495E",
  borderColor: "#337ab7 !important", // Remove !important as it doesn't work in inline styles
  borderLeft: "5px solid #337ab7", // Added color for borderLeft
  borderBottom: "1px solid #337ab7", // Added color for borderBottom
  textAlign: "left", // Changed to camelCase

  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  padding: "8px 15px", // Uncommented and standardized
}}
      >
        <div>
          <h1>📊 Journal Voucher Management</h1>
        
        </div>
      
      </div>

      {showBulkUploadModal && (
        <FileUploadModal
          heading={"Bulk Upload"}
          cancelLabel={"Cancel"}
          submitLabel={"Submit"}
          onSubmit={onBulkUploadModalSubmit}
          onClose={() => setShowBulkUploadModal(false)}
          t={t}
          fileValidator={fileValidator}
        />
      )}

      {showToast && (
        <Toast
          label={showToast.label}
          error={showToast?.isError}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
        />
      )}

      {/* Main Form */}
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          {/* Left Column */}
          <div>
            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel style={{ marginBottom: "0.4rem" }}>
                Voucher Date <span style={{ color: "red" }}>*</span>
              </CardLabel>
              <DatePicker
                value={formData.voucherDate}
                onChange={(e) => setFormData({ ...formData, voucherDate: e.target.value })}
                // style={{ width: "100%" }}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>
                Voucher Sub-Type <span style={{ color: "red" }}>*</span>
              </CardLabel>
              <CustomDropdown
                t={t}
                config={voucherSubTypeConfig.populators}
                onChange={(e) => setFormData({ ...formData, voucherSubType: e })}
                value={formData.voucherSubType}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Party Bill Number</CardLabel>
              <TextInput
                value={formData.partyBillNumber}
                onChange={(e) => setFormData({ ...formData, partyBillNumber: e.target.value })}
                style={{ width: "100%" }}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Party Bill Date</CardLabel>
              <TextInput
                value={formData.partyBillDate}
                onChange={(e) => setFormData({ ...formData, partyBillDate: e.target.value })}
                placeholder="(dd/mm/yyyy)"
                style={{ width: "100%" }}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>
                Fund <span style={{ color: "red" }}>*</span>
              </CardLabel>
              <CustomDropdown
                t={t}
                config={fundConfig.populators}
                onChange={(e) => setFormData({ ...formData, fund: e })}
                value={formData.fund}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Scheme</CardLabel>
              <CustomDropdown
                t={t}
                config={schemeConfig.populators}
                onChange={(e) => setFormData({ ...formData, scheme: e })}
                value={formData.scheme}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Fund Source</CardLabel>
              <CustomDropdown
                t={t}
                config={fundSourceConfig.populators}
                onChange={(e) => setFormData({ ...formData, fundSource: e })}
                value={formData.fundSource}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Function</CardLabel>
              <CustomDropdown
                t={t}
                config={functionConfig.populators}
                onChange={(e) => setFormData({ ...formData, function: e })}
                value={formData.function}
              />
            </LabelFieldPair>
          </div>

          {/* Right Column */}
          <div>
            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Party Name</CardLabel>
              <TextInput
                value={formData.partyName}
                onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                style={{ width: "100%" }}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Bill Number</CardLabel>
              <TextInput
                value={formData.billNumber}
                onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                style={{ width: "100%" }}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Bill Date</CardLabel>
              <TextInput
                value={formData.billDate}
                onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                placeholder="(dd/mm/yyyy)"
                style={{ width: "100%" }}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>
                Department <span style={{ color: "red" }}>*</span>
              </CardLabel>
              <CustomDropdown
                t={t}
                config={departmentConfig.populators}
                onChange={(e) => setFormData({ ...formData, department: e })}
                value={formData.department}
              />
            </LabelFieldPair>

            <LabelFieldPair style={{ alignItems: "flex-start" }}>
              <CardLabel>Sub Scheme</CardLabel>
              <CustomDropdown
                t={t}
                config={subSchemeConfig.populators}
                onChange={(e) => setFormData({ ...formData, subScheme: e })}
                value={formData.subScheme}
              />
            </LabelFieldPair>
          </div>
        </div>

        {/* Narration */}
        <LabelFieldPair style={{ alignItems: "flex-start" }}>
          <CardLabel>Narration</CardLabel>
          <TextArea
            value={formData.narration}
            onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
            style={{ width: "100%", height: "80px" }}
            isTextArea={true}
          />
        </LabelFieldPair>
      </Card>

      {/* Account Details */}
      <Card>
        <CardLabel style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>Account Details</CardLabel>

        {accountDetails.length > 0 && (
          <Table
            className={"table"}
            t={t}
            customTableWrapperClassName={"dss-table-wrapper"}
            disableSort={true}
            autoSort={false}
            data={accountDetails}
            totalRecords={accountDetails.length}
            columns={accountColumns}
            isPaginationRequired={false}
            manualPagination={false}
            getCellProps={(cellInfo) => ({
              style: {
                padding: "10px 8px",
                fontSize: "14px",
                whiteSpace: "normal",
              },
            })}
          />
        )}

        {/* Total Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#4A5568",
            color: "white",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          <div>Total</div>
          <div></div>
          <div>{totalDebit.toFixed(2)}</div>
          <div>{totalCredit.toFixed(2)}</div>
          <div></div>
          <div></div>
        </div>
      </Card>

      {/* Sub-Ledger Details */}
      <Card>
        <CardLabel style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>Sub-Ledger Details</CardLabel>

        {subLedgerDetails.length > 0 && (
          <Table
            className={"table"}
            t={t}
            customTableWrapperClassName={"dss-table-wrapper"}
            disableSort={true}
            autoSort={false}
            data={subLedgerDetails}
            totalRecords={subLedgerDetails.length}
            columns={subLedgerColumns}
            isPaginationRequired={false}
            manualPagination={false}
            getCellProps={(cellInfo) => ({
              style: {
                padding: "10px 8px",
                fontSize: "14px",
                whiteSpace: "normal",
              },
            })}
          />
        )}
      </Card>

      {/* Approval Details */}
      <Card>
        <CardLabel style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>Approval Details</CardLabel>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <LabelFieldPair style={{ alignItems: "flex-start" }}>
            <CardLabel>Approver Department:</CardLabel>
            <CustomDropdown
              t={t}
              config={approverDepartmentConfig.populators}
              onChange={(e) => setApprovalData({ ...approvalData, approverDepartment: e })}
              value={approvalData.approverDepartment}
            />
          </LabelFieldPair>

          <LabelFieldPair style={{ alignItems: "flex-start" }}>
            <CardLabel>Approver Designation:</CardLabel>
            <CustomDropdown
              t={t}
              config={approverDesignationConfig.populators}
              onChange={(e) => setApprovalData({ ...approvalData, approverDesignation: e })}
              value={approvalData.approverDesignation}
            />
          </LabelFieldPair>

          <LabelFieldPair style={{ alignItems: "flex-start" }}>
            <CardLabel>Approver:</CardLabel>
            <CustomDropdown
              t={t}
              config={approverConfig.populators}
              onChange={(e) => setApprovalData({ ...approvalData, approver: e })}
              value={approvalData.approver}
            />
          </LabelFieldPair>
        </div>

        <LabelFieldPair style={{ alignItems: "flex-start" }}>
          <CardLabel>Approver Remarks:</CardLabel>
          <TextArea
            value={approvalData.approverRemarks}
            onChange={(e) => setApprovalData({ ...approvalData, approverRemarks: e.target.value })}
            style={{ width: "100%", height: "80px" }}
            isTextArea={true}
          />
        </LabelFieldPair>

        <BreakLine style={{ height: "0.01rem" }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <Button
            label="Clear Form"
            variation="secondary"
            onButtonClick={() => {
              dispatchAccountDetails({ type: "CLEAR_STATE" })
              dispatchSubLedger({ type: "CLEAR_STATE" })
              setFormData({
                voucherDate: "27/05/2025",
                voucherSubType: null,
                partyBillNumber: "",
                partyBillDate: "",
                fund: null,
                scheme: null,
                fundSource: null,
                function: null,
                narration: "",
                partyName: "",
                billNumber: "",
                billDate: "",
                department: null,
                subScheme: null,
              })
              setApprovalData({
                approverDepartment: null,
                approverDesignation: null,
                approver: null,
                approverRemarks: "",
              })
            }}
            type="button"
          />
        </div>

        <ActionBar>
          <SubmitBar label="Save Voucher" onSubmit={handleSubmit} />
        </ActionBar>
      </Card>
    </React.Fragment>
  )
}

export default ReceiptNewform
