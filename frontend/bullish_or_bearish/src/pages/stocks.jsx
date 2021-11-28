import React, {useState, useEffect} from "react";
import Axios from 'axios';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [stockOrderBy, setStockOrderBy] = useState("Symbol");

  useEffect(() => {
    Axios.post('http://localhost:3002/api/stocks', {
      'stockOrderBy': stockOrderBy
    }).then((response) => {
      console.log(response.data);
      setStocks([...response.data]);
    });
  }, [stockOrderBy]);

  // TODO: fix sorting in backend
  return (
    <div>
      <h1>Stocks</h1>

      sort by:
      <select value={stockOrderBy} onChange={(e) => setStockOrderBy(e.target.value)}>
        <option value="Symbol">Symbol</option>
        <option value="Name">Name</option>
        <option value="Sector">Sector</option>
        <option value="Industry">Industry</option>
      </select>

      {stocks &&
       stocks.map((stock) =>
         <div>
           <h1>symbol: {stock['Symbol'].toLowerCase()}</h1>
           <p>name: {stock['Name'].toLowerCase()}</p>
           <p>sector: {stock['Sector'].toLowerCase()}</p>
           <p>industry: {stock['Industry'].toLowerCase()}</p>
         </div>
       )}
    </div>
  );
};

export default Stocks;
