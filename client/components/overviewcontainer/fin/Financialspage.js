import React from "react";
import Subheader from "../../Subheader";
import Income from "./Income";
import Balance from "./Balance";
import Cash from "./Cash";
import EnterpriseValue from "./EnterpriseValue";
import { useHistory, useLocation } from "react-router-dom";

export default function Financialspage() {
  const location = useLocation();
  const selected = location.pathname.split("/").pop().toLowerCase();

  return (
    <>
      <Subheader />
      <div className="financials-container">
        <div className="financials-sub-container">
          <FinancialsNavBar />
          <div>{getCorrectPage(selected)}</div>
        </div>
      </div>
    </>
  );
}
//* Function used to return/render the correct page
function getCorrectPage(selected) {
  switch (selected) {
    case "incomestatement":
      return <Income />;
    case "balancesheet":
      return <Balance />;
    case "cashflow":
      return <Cash />;
    case "enterprisevalue":
      return <EnterpriseValue />;
    default:
      return <Income />;
  }
}

export function FinancialsNavBar() {
  const history = useHistory();
  const location = useLocation();

  const selected = location.pathname.split("/").pop().toLowerCase();

  return (
    <div className="financials-selector-nav">
      <div className="fin-selectors">
        {getSelectorLabel("Income Statement", history, selected)}
        {getSelectorLabel("Balance Sheet", history, selected)}
        {getSelectorLabel("Cash Flow", history, selected)}
        {getSelectorLabel("Enterprise Value", history, selected)}
      </div>
    </div>
  );
}

//* Function to get a clickable label
function getSelectorLabel(name, history, selected) {
  //* Format the name so we can work with it
  const fmtName = name.replace(" ", "").toLowerCase();
  if (!selected || selected == "financials") selected = "incomestatement";
  return (
    <label
      className={fmtName === selected ? "selected" : ""}
      onClick={() => {
        //* If the selected page is already the one clicked
        if (fmtName === selected) return;
        //* Otherwise update the urlHistory
        history.push(`/overviewpage/${fmtName != "financials" ? "financials/" : ""}${fmtName}`);
      }}
    >
      {name}
    </label>
  );
}
