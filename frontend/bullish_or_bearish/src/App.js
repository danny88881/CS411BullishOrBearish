import './App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';

function App() {
  const [commentList, setCommentList] = useState([]);

  // Submit Comment
  const [userId, setUserId] = useState(0);
  const [content, setContent] = useState('');

  // Update Comment
  const [updateContent, setUpdateContent] = useState('');

  // Search Stock
  const [retrievedStock, setRetrievedStock] = useState(null);
  const [stockSymbol, setStockSymbol] = useState('');

  // Advanced SQL Query 1
  const [bullishOrBearishAdvanced1, setBullishOrBearishAdvanced1] = useState(0);
  const [resultsAdvanced1, setResultsAdvanced1] = useState([]);

  // Advanced SQL Query 2
  const [bullishOrBearishAdvanced2, setBullishOrBearishAdvanced2] = useState('');
  const [resultsAdvanced2, setResultsAdvanced2] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3002/api/get').then((response) => {
      setCommentList(response.data)
    })
  },[])

  const submitComment = () => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const likeCount = 0

    Axios.post('http://localhost:3002/api/insert', {
      userId: userId,
      content: content,
      date: date,
      likeCount: likeCount
    }).then(()=> {
      alert('Add Comment Success')
    })
  };

  const updateComment = (updateId) => {
    Axios.post('http://localhost:3002/api/update', {
      commentId: updateId,
      newContent: updateContent,
    }).then(()=> {
      alert('Add Comment Success')
    })
  };

  const deleteComment = (commentId) => {
    Axios.post('http://localhost:3002/api/delete', {
      commentId: commentId
    }).then(()=> {
      alert('Delete Comment Success')
    })
  };

  const searchStock = () => {
    Axios.post('http://localhost:3002/api/stock/search', {
      stockSymbol: stockSymbol
    }).then((res)=> {
      setRetrievedStock(res.data[0]);
    })
  };

  const advancedQuery1 = () => {
    Axios.post('http://localhost:3002/api/advanced1', {
      bullishOrBearish: bullishOrBearishAdvanced1
    }).then((res)=> {
      setResultsAdvanced1(res.data);
    })
  };

  const advancedQuery2 = () => {
    const date =  bullishOrBearishAdvanced2.slice(0, 19).replace('T', ' ');
    Axios.post('http://localhost:3002/api/advanced2', {
      bullishOrBearish: date
    }).then((res)=> {
      setResultsAdvanced2(res.data);
    })
  };

  return (
    <div className="App">
      <h1>Midterm Demo</h1>
      <h2>CRUD+Search+Advanced Queries</h2>
      <hr></hr>
      <h2>Create Comment</h2>
      <div className="form">
        <label>UserId:</label><input type="number" name="userId" onChange={(e)=> {
          setUserId(e.target.value)
        } }></input>
        <br></br>
        <label>Content:</label>
        <br></br>
        <textarea name="content" cols="40" rows="5" maxlength="256" onChange={(e)=> {
          setContent(e.target.value)
        } }></textarea>
        <br></br>
        <button onClick={submitComment}>Submit</button>
      </div>

      <hr></hr>
      <h2>Last 5 Comments</h2>

      {commentList.map((val) => {
        return(
          <div className="card">
            <h3>User ID: {val.UserId}</h3>
            <p>Time Posted: {val.TimePosted}</p>
            <p>Likes: {val.LikeCount}</p>
            <p>Content: {val.Content}</p>
            <button onClick={()=>deleteComment(val.CommentId)}>Delete</button>
            <textarea name="content" cols="10" rows="2" maxlength="256" onChange={(e)=> {
            setUpdateContent(e.target.value)
            } }></textarea>
            <button onClick={()=>updateComment(val.CommentId)}>Update</button>
          </div>
        );
      })
    }

      <hr></hr>

      <h2>Search for stocks</h2>
      <div className="form">
        <label>Search:</label>
        <input type="text" name="search" onChange={(e)=> {setStockSymbol(e.target.value);}}></input>
        <br></br>
        <button onClick={searchStock}>Submit</button>
      </div>

      { retrievedStock ?
        <div>
          <h3>Found Stock:</h3>
          <table>
            <tr>
              <th>Symbol</th>
              <td>{retrievedStock['Symbol']}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{retrievedStock['Name']}</td>
            </tr>
            <tr>
              <th>Sector</th>
              <td>{retrievedStock['Sector']}</td>
            </tr>
            <tr>
              <th>Industry</th>
              <td>{retrievedStock['Industry']}</td>
            </tr>
          </table>
        </div> : <p>Nothing found...</p>
      }

      <hr></hr>

      <h2>Advanced Query 1 - Sectors With The Most Bullish Or Bearish Votes</h2>
      <div className="form">
        <input
          type="radio"
          id="bullish"
          name="bullishorbearish"
          value="bullish"
          checked={bullishOrBearishAdvanced1 == 0}
          onClick={() => {setBullishOrBearishAdvanced1(1 - bullishOrBearishAdvanced1)}}>
        </input>
        <label for="bullish">Bullish</label>
        <br></br>
        <input
          type="radio"
          id="bearish"
          name="bullishorbearish"
          value="bearish"
          checked={bullishOrBearishAdvanced1 == 1}
          onClick={() => {setBullishOrBearishAdvanced1(1 - bullishOrBearishAdvanced1)}}>
        </input>
        <label for="bearish">Bearish</label>
        <br></br>
        <button onClick={advancedQuery1}>Submit</button>
      </div>


      { resultsAdvanced1.length ?
        <table>
          <tr><th>Sector</th><th>Number of Votes</th></tr>
          {
            resultsAdvanced1.map((sectorResult) => {
              return <tr><td>{sectorResult.Sector}</td><td>{sectorResult.NumVotes}</td></tr>;
            })
          }
        </table>
        : <p>Choose bullish or bearish to see the top sectors by votes</p>
      }


      <hr></hr>

      <h2>Advanced Query 2 - Number of votes after given date</h2>
      <div className="form">
        <input type="date" name="date" onChange={(e)=> {setBullishOrBearishAdvanced2(e.target.value);}}></input>
        <br></br>
        <button onClick={advancedQuery2}>Submit</button>
      </div>


      { resultsAdvanced2.length ?
        <table>
          <tr><th>Stock</th><th>Number of Votes</th></tr>
          {
            resultsAdvanced2.map((sectorResult) => {
              return <tr><td>{sectorResult.Symbol}</td><td>{sectorResult.NumVotes}</td></tr>;
            })
          }
        </table>
        : <p>Choose the date to see the top stocks by number of votes</p>
      }
    </div>
  )
}

export default App;
