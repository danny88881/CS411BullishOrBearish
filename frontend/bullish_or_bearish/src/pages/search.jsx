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
    <div>
      <h1>Search Stocks</h1>
      <div className="form">
        <label>search:</label>
        <input type="text" name="search" onChange={(e)=> {setStockSymbol(e.target.value.toUpperCase());}}></input>
        <button onClick={searchStock}>submit</button>
      </div>

      { stocks.length > 0 ?
        <div>
          <h3>results:</h3>
          <table>
            {stocks.map((stock) =>
              <div>
                <tr>
                  <th>symbol</th>
                  <td>{stock['Symbol'].toLowerCase()}</td>
                </tr>
                <tr>
                  <th>name</th>
                  <td>{stock['Name'].toLowerCase()}</td>
                </tr>
                <tr>
                  <th>sector</th>
                  <td>{stock['Sector'].toLowerCase()}</td>
                </tr>
                <tr>
                  <th>industry</th>
                  <td>{stock['Industry'].toLowerCase()}</td>
                </tr>
                <tr>
                  <th><button onClick={() => viewStock(stock['Symbol'])}>view stock</button></th>
                </tr>
                <br></br>
              </div>
            )}
          </table>
        </div>: <p>Nothing found...</p>
      }
    </div>
  );
};

export default Search;
