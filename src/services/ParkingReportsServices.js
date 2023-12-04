import { genRequest } from "./Requests";

const parkingReportsServices = {};

parkingReportsServices.guardIncomesByMonth = (initDate, finalDate) => 
  genRequest(
    `get`,
    `/parking-reports/guard-incomes/${initDate}/${finalDate}`,
    {}
  );

parkingReportsServices.guardIncomesByWeek = (initDate, finalDate) => 
  genRequest(
    `get`,
    `/parking-reports/guard-incomes-by-week/${initDate}/${finalDate}`,
    {}
  );

parkingReportsServices.incomesByMonth = (initDate, finalDate) => 
  genRequest(
    `get`,
    `/parking-reports/incomes-by-month/${initDate}/${finalDate}`,
    {}
  );

parkingReportsServices.incomesByWeek = (initDate, finalDate) => 
  genRequest(
    `get`,
    `/parking-reports/incomes-by-week/${initDate}/${finalDate}`,
    {}
  );

parkingReportsServices.expensesByMonth = (initDate, finalDate) => 
  genRequest(
    `get`,
    `/parking-reports/expenses-by-month/${initDate}/${finalDate}`,
    {}
  );

parkingReportsServices.expensesByWeek = (initDate, finalDate) => 
  genRequest(
    `get`,
    `/parking-reports/expenses-by-week/${initDate}/${finalDate}`,
    {}
  );

export default parkingReportsServices;
