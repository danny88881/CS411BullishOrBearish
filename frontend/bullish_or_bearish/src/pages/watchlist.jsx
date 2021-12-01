import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';

const WatchList = () => {
  let { listid } = useParams();

  const [stocks, setStocks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");

  useEffect(() => {
  Axios.get('http://localhost:3002/api/getWatchlistStocks', {
        params: {listid: listid}
      }).then((res)=> {
          setStocks(res.data);
    });
  
  Axios.get('http://localhost:3002/api/getWatchlistInfo', {
        params: {listid: listid}
      }).then((res)=> {
          const retrievedInfo = res.data[0];
          setTitle(retrievedInfo['Title'].toLowerCase());
          setDescription(retrievedInfo['Description'].toLowerCase());
          setCreator(retrievedInfo['CreatorId']);
    });
 }, []);
  

    return (
      <div>
        <h1>title: {title}</h1>
        <p>creator: {creator}</p>
        <p>desription: {description}</p>
        <br></br>

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

export default WatchList;