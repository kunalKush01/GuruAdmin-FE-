import React, { useEffect } from 'react'
import DonationListTable from '../donation/donationListTable'
import { ExpensesListTable } from '../internalExpenses/expensesListTable'
import CommitmentListTable from '../commitments/commitmentListTable'
import { useUpdateEffect } from 'react-use'
import { useTranslation } from 'react-i18next'

export default function ReportListTable({activeReportTab,data}) {

  const { t } = useTranslation();


  const getTable = ()=>{
    switch (activeReportTab.name) {
      case t("report_expences"):
        
        return <ExpensesListTable data={data}/>;
        case t("donation_Donation"):
        
        return <DonationListTable data={data}/>;
        case t("report_commitment"):
        
        return <CommitmentListTable data={data}/>;
      default:
        return [];
    }
    
  }


  return (
    <div>
          {getTable()}      
    </div>
  )
}
