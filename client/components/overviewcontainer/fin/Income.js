import React, { useEffect, useState } from "react";
import { getLocalData } from "../../../store/local/localActions";
import UniversalChart from "../../UniversalChart";
import CompanyInfo from "./CompanyInfo";
import { FinButtons } from "./FinButtons";
import FinTable from "./FinTable";
import { getQtrIndentifers, incomeIndentifiers, incomeTableLabels } from "./finTableLabels";
import { formatDates, processUnformattedData, returnUnformatedData } from "./finUtils";

//Using the getLocalData method
//This method first checks to see if the requested data is in our redux store. If it is, return it, otherwise fetch what we need and log
//that into the local component sate and redux state

export default function Income() {
  const [selectedAttribute, setSelectedAttribute] = useState(["revenue", "Revenue"]);
  const [incomeInfo, setIncomeInfo] = useState({});
  const [incomeInfoQtr, setIncomeQtr] = useState({});
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function getIncomeInfo() {
      //here we are fetching only what we need from the income statement
      setIncomeInfo(
        await getLocalData(
          [...incomeIndentifiers],
          "fetchIncomeStatement",
          [false, "annual"],
          [...incomeIndentifiers],
        ),
      );

      //here we are fetching the stock profile
      setProfile(
        await getLocalData(
          [
            "symbol",
            "companyName",
            "image",
            "exchangeShortName",
            "industry",
            "sector",
            "fullTimeEmployees",
            "price",
          ],
          "fetchStockProfile",
          [],
          [
            "symbol",
            "companyName",
            "image",
            "exchangeShortName",
            "industry",
            "sector",
            "fullTimeEmployees",
            "price",
          ],
        ),
      );
    }

    getIncomeInfo();
  }, []);

  //Here we are fetching the quaterly info
  //I tried putting it in the above use effect but it did not fetch???
  useEffect(() => {
    async function getIncomeInfoQtr() {
      const { saveAs, qtrIdentifiers } = getQtrIndentifers(incomeIndentifiers);
      setIncomeQtr(
        //here we are fetching only what we need from the statement
        await getLocalData(
          [...qtrIdentifiers],
          "fetchIncomeStatement",
          [false, "quarter"],
          [...saveAs],
        ),
      );
    }
    getIncomeInfoQtr();
  }, []);

  //A handler function being passed down to the table that will affect the local state of this component
  function handleTableClick(attribute) {
    setSelectedAttribute(attribute);
  }

  //A handler function being passed down to the buttons that will affect the local state of this component
  // function handleChartButtonClick(dataType) {
  //   setChartDatatype(dataType);
  // }

  //**------------------------------------------------------------------------------------------------ */
  //CHART DATA
  //**------------------------------------------------------------------------------------------------ */

  //This is the data I'll put in the chart
  //Selected attribute is defined by what is clicked on in the table
  const attribute = selectedAttribute[0];
  const label = selectedAttribute[1];
  let chartData = [];
  let keys = [];

  let chartDataQtr = [];
  let keysQtr = [];
  if (Object.keys(incomeInfoQtr).length && Object.keys(incomeInfo).length) {
    //Here i'm grabbing a particular array from the fetched object to be displyed in the chart

    chartData = incomeInfo[attribute].values;
    chartDataQtr = incomeInfoQtr[attribute].values;

    keys = incomeInfo[attribute].keys;
    keysQtr = incomeInfoQtr[attribute].keys;
  }
  const dataset = [];

  chartDataQtr = chartDataQtr.slice(3);

  dataset.push({
    name: label,
    type: "line",
    stroke: "0.5",
    values: chartData,
    cKeys: keys,
    fill: "tozeroy",
    color: "rgba(32, 164, 243, .2)",
    fillcolor: "rgba(32, 164, 243, .7)",
  });

  dataset.push({
    name: label,
    type: "line",
    stroke: "0.5",
    values: chartDataQtr,
    cKeys: keysQtr,
    fill: "tozeroy",
    color: "rgba(148, 28, 47, .4)",
    fillcolor: "rgba(148, 28, 47, .9)",
  });
  //**------------------------------------------------------------------------------------------------ */
  //TABLE DATA
  //**------------------------------------------------------------------------------------------------ */

  let unformatedData = [];
  let rawDates;

  if (Object.keys(incomeInfo).length) {
    //When cashflowInfo has been populated we'll destructure what we need
    // rawDates are in this format--"2021-06-30"--and need to be processed with getDates() before putting into table
    const { grossProfit } = incomeInfo;
    rawDates = grossProfit.keys;

    //Here i'm passing in my local state and an array of identifiers to a helper function that will extract the data for
    //those identifers and return a 2D array of the raw data numbers and set it equal to 'unformatedData'
    unformatedData = returnUnformatedData(incomeInfo, incomeIndentifiers);
  }

  //Here i'm passing the rawDates to be processed to look like this...'2021'
  const tabledates = Object.keys(incomeInfo).length ? formatDates(rawDates) : [];

  //Here i'm sending the unformatedData off to be processed
  const { yearlyChanges, rows } = processUnformattedData(unformatedData);
  const tableInfo = {
    tabledates,
    rows,
    yearlyChanges,
    labels: incomeTableLabels,
    attributes: incomeIndentifiers,
  };

  //**------------------------------------------------------------------------------------------------ */
  //RENDER
  //**-------------------------------------------------------------------------------------------------- */
  return (
    <>
      <div className="page shadow-deep-nohover">
        <div className="fin-top-container">
          <CompanyInfo profile={profile} />
          <div className="fin-chart-container">
            <FinButtons label={label} buttons={false} />
            <UniversalChart
              className="income-chart fin-chart"
              keys={keysQtr}
              margin={{ l: 50, r: 50, b: 25, t: 35 }}
              plotBackgroundColor="rgba(33, 34, 45, 0)"
              dataset={dataset}
              showlegend={false}
              hoverdistance={50}
              hovermode="x"
              backgroundColor="fff"
            />
          </div>
        </div>
        <FinTable tableInfo={tableInfo} handleTableClick={handleTableClick} />
      </div>
    </>
  );
}
