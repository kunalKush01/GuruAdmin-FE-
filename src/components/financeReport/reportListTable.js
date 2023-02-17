import React from 'react'
import { useTranslation } from 'react-i18next'
import CommitmentListTable from '../commitments/commitmentListTable'
import DonationListTable from '../donation/donationListTable'
import DonationBoxListTable from '../DonationBox/donationBoxListTable'
import { ExpensesListTable } from '../internalExpenses/expensesListTable'

export default function ReportListTable({activeReportTab,data,page}) {

  const { t } = useTranslation();


  const getTable = ()=>{
    switch (activeReportTab.name) {
      case t("report_expences"):
        
        return <ExpensesListTable data={data} page={page} financeReport/>;
        case t("donation_Donation"):
        
        return <DonationListTable data={data}/>;
        case t("report_commitment"):
        
        return <CommitmentListTable data={data} financeReport/>;
        case t("report_donation_box"):
        
        return <DonationBoxListTable data={data} financeReport/>;
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
