import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';

const Search = () => {
  const navigate = useNavigate();

  // Search Stock
  const [stocks, setStocks] = useState([]);
  const [stockSymbol, setStockSymbol] = useState('');

  const searchStock = () => {
    Axios.post('http://localhost:3002/api/stock/search', {
      stockSymbol: stockSymbol
    }).then((res)=> {
      setStocks(res.data);
    });
  };

  const viewStock = (symbol) => {
    navigate("/Stocks/" + symbol);
  };

  return (
    <div class="menu">
      <h1>Search Stocks</h1>
      <div className="form">
        <input type="text" name="search" style={{fontSize:"24px", color:"black", height:"40px"}} onChange={(e)=> {setStockSymbol(e.target.value.toUpperCase());}}></input>
        <button style={{fontSize:"16px", height:"40px"}} onClick={searchStock}>submit</button>
      </div>

      { stocks.length > 0 ?
        <div>
          <table>
            {stocks.map((stock) =>
              <div onClick={() => viewStock(stock['Symbol'])} class="stockdisplay">
                <h2>{stock['Symbol'].toLowerCase()}</h2>
                <p>{stock['Name'].toLowerCase()}</p>
                <p>{stock['Sector'].toLowerCase()} : {stock['Industry'].toLowerCase()}</p>
                <p>--------------------</p>
              </div>
            )}
          </table>
        </div>: <p>Nothing found...</p>
      }
    </div>
  );
};

export default Search;
