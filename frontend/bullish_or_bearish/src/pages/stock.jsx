import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';

const Stock = () => {
  let { symbol } = useParams();
  const [name, setName] = useState(null);
  const [sector, setSector] = useState(null);
  const [industry, setIndustry] = useState(null);

  useEffect(() => {
    Axios.post('http://localhost:3002/api/stock/search', {
      stockSymbol: symbol
    }).then((res)=> {
      if (res.data.length === 0) {
        // TODO: redirect to 404?
      } else {
        const retrievedStock = res.data[0];
        console.log(retrievedStock);
        setName(retrievedStock['Name']);
        setSector(retrievedStock['Sector']);
        setIndustry(retrievedStock['Industry']);
      }
    });
  }, []);

  if (name === null) {
    return <p>not found</p>;
  } else {
    return (
      <div>
        <h1>symbol: {symbol}</h1>
        <p>name: {name}</p>
        <p>sector: {sector}</p>
        <p>industry: {industry}</p>
      </div>
    );
  }
};

export default Stock;
