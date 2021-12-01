import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';

const Search = () => {
  const navigate = useNavigate();

  // Search Stock
  const [stocks, setStocks] = useState([]);
  const [stockSymbol, setStockSymbol] = useState('');

  // Search Watchlist
  const [watchlists, setWatchlists] = useState([]);
  const [listName, setListName] = useState('');

  // Search Watchlist
  const [communities, setCommunities] = useState([]);
  const [communityName, setCommunityName] = useState('');

  const searchStock = () => {
    Axios.post('http://localhost:3002/api/stock/search', {
      stockSymbol: stockSymbol
    }).then((res)=> {
      setStocks(res.data);
    });
  };

  const searchWatchlists = () => {
    Axios.post('http://localhost:3002/api/watchlist/search', {
      listName: listName
    }).then((res)=> {
      console.log(res.data);
      setWatchlists(res.data);
    });
  };

  const searchCommunities = () => {
    Axios.post('http://localhost:3002/api/community/search', {
      communityName: communityName
    }).then((res)=> {
      setCommunities(res.data);
    });
  };

  const viewStock = (symbol) => {
    navigate("/Stocks/" + symbol);
  };

  const viewWatchlist = (listId) => {
    navigate("/Watchlists/" + listId);
  };

  const viewCommunity = (communityId) => {
    navigate("/Communities/" + communityId);
  };
  
  return (
    <div class="menu">
      <h1>Search Stocks</h1>
      <div className="form">
        <input type="text" name="search" style={{fontSize:"24px", color:"black", height:"40px"}} onChange={(e)=> {setStockSymbol(e.target.value.toUpperCase());}}></input>
        <button disabled={!stockSymbol} style={{fontSize:"16px", height:"40px"}} onClick={searchStock}>submit</button>
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


      <h1>Search Watchlists</h1>
      <div className="form">
        <input type="text" name="search" style={{fontSize:"24px", color:"black", height:"40px"}} onChange={(e)=> {setListName(e.target.value.toUpperCase());}}></input>
        <button disabled={!listName} style={{fontSize:"16px", height:"40px"}} onClick={searchWatchlists}>submit</button>
      </div>

      { watchlists.length > 0 ?
        <div>
          <table>
            {watchlists.map((watchlist) =>
              <div onClick={() => viewWatchlist(watchlist['ListId'])} class="watchlistdisplay">
                <h2>{watchlist['Title'].toLowerCase()}</h2>
                <p>{watchlist['Description'].toLowerCase()}</p>
                <p>--------------------</p>
              </div>
            )}
          </table>
        </div>: <p>Nothing found...</p>
      }

      <h1>Search Communities</h1>
      <div className="form">
        <input type="text" name="search" style={{fontSize:"24px", color:"black", height:"40px"}} onChange={(e)=> {setCommunityName(e.target.value.toUpperCase());}}></input>
        <button disabled={!communityName} style={{fontSize:"16px", height:"40px"}} onClick={searchCommunities}>submit</button>
      </div>

      { communities.length > 0 ?
        <div>
          <table>
            {communities.map((community) =>
              <div onClick={() => viewCommunity(community['CommunityId'])} class="communitydisplay">
                <h2>{community['Name'].toLowerCase()}</h2>
                <p>{community['Description'].toLowerCase()}</p>
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
