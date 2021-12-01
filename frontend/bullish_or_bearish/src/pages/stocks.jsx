import React, {useState, useEffect} from "react";
import Axios from 'axios';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [stockOrderBy, setStockOrderBy] = useState("Symbol");

  const [topStocks, setTopStocks] = useState([]);

  useEffect(() => {
    Axios.post('http://localhost:3002/api/stocks', {
      'stockOrderBy': stockOrderBy
    }).then((response) => {
      console.log(response.data);
      setStocks([...response.data]);
    });
  }, [stockOrderBy]);

  useEffect(() => {
    Axios.post('http://localhost:3002/api/advanced1', {
      bullishOrBearish: 1
    }).then((res)=> {
      setTopStocks(res.data);
    })
  });

  return (
    <div class="stockpage">
      <h2>top 5 sectors</h2>
      {
        <table>
          {
            topStocks.map((sectorResult) => {
              return <tr><td>{sectorResult.Sector.toLowerCase()}</td>:<td>{sectorResult.NumVotes}</td></tr>;
            })
          }
        </table>
      }

      <h1>top 50 stocks</h1>

      {stocks &&
       stocks.map((stock) =>
         <div class="stockdisplay" onClick={() => {document.location.href = "/Stocks/" + stock['Symbol']}}>
           <h2>{stock['Symbol'].toLowerCase()} : <p style={{width:"10px", fontSize:"32px", display:"inline", color:stock['Score']>0?"#adff2f":"#ff0000"}}>{stock['Score']}</p></h2>
           <p>{stock['Name'].toLowerCase()}</p>
           <p>{stock['Sector'].toLowerCase()} : {stock['Industry'].toLowerCase()}</p>
           <p>--------------------</p>
         </div>
       )}
    </div>
  );
};

export default Stocks;
