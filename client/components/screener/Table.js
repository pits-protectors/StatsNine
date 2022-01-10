import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { getScreenerData } from "../../store/local/localActions";
import Loading from "../Loading";
import Row from "./Row";

//* This is the screener
export default function Table() {
  const [sortBy, setSortBy] = useState({ criteria: "", ascending: false });
  const [stocksMap, setStocksMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // This function fetches information from the API for 500 stocks and stores it in the local state for rendering.
    async function getStocksList() {
      const fetchedMap = await getScreenerData("", 500, 60);
      setStocksMap(fetchedMap);
      setLoaded(true);

      // const stocks = await getLocalData(
      //   'all',
      //   'fetchScreenerStocks',
      //   ['isEtf=false'],
      //   'screener',
      //   'system'
      // )
      // setStocksList(stocks)
    }

    getStocksList();
  }, []);

  if (!loaded) return <Loading />;

  return (
    <div className="screener-page">
      <div className="screener-container">
        <div className="screener-scroll-container">
          <div className="screener-title">
            <label>Stock Screener</label>
          </div>
          <div className="screen-table-container">
            <SimpleBar className="screener-scroll shadow-deep-nohover">
              <table className="screen-table">
                <thead>{getTableHead(stocksMap, sortBy, setSortBy)}</thead>
                <tbody>{getTableBody(stocksMap, sortBy)}</tbody>
              </table>
            </SimpleBar>
          </div>
        </div>
      </div>
    </div>
  );
}

function sorting(data, increasing) {
  if (increasing) {
    return data.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
  } else {
    return data.sort((a, b) => {
      if (b.value > a.value) {
        return 1;
      }
      if (b.value < a.value) {
        return -1;
      }
      return 0;
    });
  }
}

//* Function to get the table body
function getTableBody(stocksList, sortBy) {
  // if (stocksList.length) {
  if (Object.keys(stocksList).length) {
    // return stocksList.map((stock, i) => <Row key={stock.symbol} stock={stock} index={i} />)

    if (sortBy.criteria) {
      const symbolValue = Object.values(stocksList).map(stock => ({
        symbol: stock.symbol,
        value: stock[sortBy.criteria],
      }));
      const sortedList = sorting(symbolValue, sortBy.ascending);
      return sortedList.map((stock, i) => (
        <Row key={stock.symbol} stock={stocksList[stock.symbol]} index={i} />
      ));
    } else {
      return Object.keys(stocksList).map((stock, i) => (
        <Row key={stock} stock={stocksList[stock]} index={i} />
      ));
    }
  } else {
    return (
      <tr>
        <td>Hold tight while we find some companies for you...</td>
      </tr>
    );
  }
}

//* Function to get table headers
function getTableHead(stocksList, sortBy, setSortBy) {
  // if (stocksList.length) {
  if (Object.keys(stocksList).length) {
    return (
      <tr>
        <th
          className="screen-border-h"
          onClick={() => {
            setSortBy({ criteria: "symbol", ascending: !sortBy.ascending });
          }}
        >
          Symbol and Name
        </th>
        <th className="screen-border-h">Price</th>
        <th className="screen-border-h">Change</th>
        <th className="screen-border-h">Earnings</th>
        <th className="screen-border-h">52 Week</th>
        <th className="screen-border-h">Other</th>
        {/* <th className="screen-border-h">Volume</th> */}
        {/* <th className="screen-border-h">Market Cap</th> */}
        <th className="screen-border-h">Sector</th>
      </tr>
    );
  } else {
    return <></>;
  }
}
