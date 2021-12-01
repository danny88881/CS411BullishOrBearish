import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';
import Watchlists from "./watchlists";

const Stock = () => {
  let { symbol } = useParams();
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [industry, setIndustry] = useState("");
  const [bull, setBull] = useState(0);
  const [bear, setBear] = useState(0);

  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [watchlists, setWatchlists] = useState([]);
  const [watchlistsIn, setWatchlistsIn] = useState([]);
  const [addWL, setAddWL] = useState(0);
  const [removeWL, setRemoveWL] = useState(0);

  const [updateContent, setUpdateContent] = useState("");

  const submitComment = (e) => {
    e.preventDefault();
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const userId = localStorage.getItem('userId');

    // create a new comment
    Axios.post('http://localhost:3002/api/insert', {
      userId: userId,
      content: content,
      date: date,
      likeCount: 0
    }).then(() => {
      // get the id to which the StockComment will be associated
      Axios.get('http://localhost:3002/api/mostrecentcomment').then((res) => {
        // insert into the StockComment table
        Axios.post('http://localhost:3002/api/stockcomment', {
          symbol: symbol,
          commentId: res.data[0].CommentId
        }).then(() => {
          // refresh comments
          Axios.get('http://localhost:3002/api/stockcomment', {
            params: {symbol: symbol}
          }).then((res) => {
            setComments(res.data);
          });
        });
      });
    });
  };

  const updateComment = (updateId) => {
    if (updateContent.length !== 0) {
      Axios.post('http://localhost:3002/api/update', {
        commentId: updateId,
        newContent: updateContent,
      }).then(()=> {
        Axios.get('http://localhost:3002/api/stockcomment', {
          params: {symbol: symbol}
        }).then((res) => {
          console.log(res.data);
          setComments(res.data);
        });
      });
    }
  };

  const deleteComment = (deleteId) => {
    Axios.post('http://localhost:3002/api/deletestockcomment', {
      commentId: deleteId
    }).then(()=> {
      Axios.post('http://localhost:3002/api/deletestockcomment', {
        commentId: deleteId
      }).then(() => {
        Axios.get('http://localhost:3002/api/stockcomment', {
          params: {symbol: symbol}
        }).then((res) => {
          setComments(res.data);
        });
      });
    });
  };  

  const likeComment = (commentId, userId) => {
    Axios.post('http://localhost:3002/api/likecomment', {
      commentId: commentId,
      userId: userId,
    }).then(()=> {
      Axios.get('http://localhost:3002/api/stockcomment', {
        params: {symbol: symbol}
      }).then((res) => {
        setComments(res.data);
      });
    });
  };

  const addToWatchlist = (watchlist) => {
    Axios.post('http://localhost:3002/api/stock/addToWatchlist', {
      symbol: symbol,
      watchlist: watchlist
    }).then((res)=> {
      setAddWL(0)
    });
  }

  const removeFromWatchlist = (watchlist) => {
    Axios.post('http://localhost:3002/api/stock/removeFromWatchlist', {
      symbol: symbol,
      watchlist: watchlist
    }).then((res)=> {
      setRemoveWL(0)
    });
  }

  const onChangeAWL = (event) => {
    var newValue = event.nativeEvent.target.value;
    setAddWL(newValue);
  }

  const onChangeRWL = (event) => {
    var newValue = event.nativeEvent.target.value;
    setRemoveWL(newValue);
  }

  useEffect(() => {
    Axios.post('http://localhost:3002/api/stock/search', {
      stockSymbol: symbol
    }).then((res)=> {
      if (res.data.length === 0) {
        // TODO: redirect to 404?
      } else {
        const retrievedStock = res.data[0];
        setName(retrievedStock['Name']);
        setSector(retrievedStock['Sector']);
        setIndustry(retrievedStock['Industry']);
      }
    });

    Axios.get('http://localhost:3002/api/stockcomment', {
      params: {symbol: symbol}
    }).then((res) => {
      console.log(res.data);
      setComments(res.data);
    });
  }, []);

  useEffect(() => {
    Axios.get('http://localhost:3002/api/stock/bearish', {params:{
      Symbol: symbol
    }}).then((res)=> {
      if (res.data.length === 0) {
      } else {
        const retrievedStock = res.data[0];
        setBear(retrievedStock['COUNT(*)'])
      }
    });
  }, []);

  useEffect(() => {
    Axios.get('http://localhost:3002/api/stock/bullish', {params:{
      Symbol: symbol
    }}).then((res)=> {
      if (res.data.length === 0) {
      } else {
        console.log(res.data)
        const retrievedStock = res.data[0];
        setBull(retrievedStock["COUNT(*)"])
      }
    });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    Axios.get('http://localhost:3002/api/getManagedWatchlists', {params:{
      userId: userId,
      symbol: symbol
    }}).then((res)=> {
      setWatchlists(res.data);
    });
  }, [addWL, removeWL]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    Axios.get('http://localhost:3002/api/getManagedWatchlistsAlrIn', {params:{
      userId: userId,
      symbol: symbol
    }}).then((res)=> {
      setWatchlistsIn(res.data);
    });
  }, [addWL, removeWL]);

  if (name === null) {
    return <p>not found</p>;
  } else {
    return (
      <div class="stock">
        <h1>{symbol.toLowerCase()}<div class="score"><p style={{width:"10px", fontSize:"32px", display:"inline", color:"#adff2f"}}>+{bull}</p><p style={{width:"10px", fontSize:"32px", display:"inline", color:"#ff0000"}}>-{bear}</p></div></h1>
        <p>{name.toLowerCase()}</p>
        <p>{sector.toLowerCase()} : {industry.toLowerCase()}</p>
        <br></br>

        <div class="addToWatchlist" style={{display: watchlists.length>0 ? "block":"none"}}>
        <select name="watchlist" id="watchlist" onChange={onChangeAWL}>
          <option value="">none</option>
          {watchlists &&
          watchlists.map((watchlist) =>
            <option value={watchlist["ListId"]}>
              {watchlist["Title"]}
            </option>
         )}
        </select>
        <button onClick={()=>{addToWatchlist(addWL)}}>add</button>
        </div>

        <div class="addToWatchlist" style={{display: watchlistsIn.length>0 ? "block":"none"}}>
        <select name="watchlist" id="watchlistIn" onChange={onChangeRWL}>
          <option value="">none</option>
          {watchlistsIn &&
          watchlistsIn.map((watchlist) =>
            <option value={watchlist["ListId"]}>
              {watchlist["Title"]}
            </option>
         )}
        </select>
        <button onClick={()=>{removeFromWatchlist(removeWL)}}>remove</button>
        </div>

        <h2>comments</h2>
        <textarea class="commentBox" name="content" cols="40" rows="5" maxlength="256"
                  onChange={(e) => setContent(e.target.value)}
                  ></textarea>
        <br></br>
        <button class="commentButton" onClick={submitComment}>submit comment</button>

        {comments &&
         comments.map((comment) =>
           <div>
             <h3>user: {comment['FirstName'].toLowerCase() + " " + comment['LastName'].toLowerCase()}</h3>
             <p>{comment['TimePosted']}</p>
             <p>{comment['Content'].toLowerCase()}</p>
             <p>likes: {comment['LikeCount']}</p>
             {parseInt(localStorage.getItem('userId')) === comment['UserId'] &&
              <div class="update">
                <textarea class="commentBox" name="content" cols="50" rows="4" maxlength="256" onChange={(e)=> {
                  setUpdateContent(e.target.value);
                } }></textarea>
              </div>}
             <div class="update">
               <div>
                 {parseInt(localStorage.getItem('userId')) === comment['UserId'] && <button onClick={()=>updateComment(comment['CommentId'])}>update</button>}
                 {parseInt(localStorage.getItem('userId')) === comment['UserId'] && <button onClick={()=>deleteComment(comment['CommentId'])}>delete</button>}
                 <button onClick={()=>likeComment(comment['CommentId'], comment['UserId'])}>like</button> 
               </div>
             </div>             
           </div>
         )}
      </div>
    );
  }
};

export default Stock;
