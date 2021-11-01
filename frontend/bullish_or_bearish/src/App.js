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

  const updateComment = () => {
    
  };

  const deleteComment = () => {
    
  };

  const searchStock = () => {
    
  };

  const advancedQuery1 = () => {
    
  };

  const advancedQuery2 = () => {
    
  };

  return (
    <div className="App">
      <h1>Midterm Demo</h1>
      <h2>CRUD+Search+Advanced Queries</h2>
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

      <h2>Last 5 Comments</h2>

      {commentList.map((val) => {
        return(
          <div className="card">
            <h3>User ID: {val.UserId}</h3>
            <p>Time Posted: {val.TimePosted}</p>
            <p>Likes: {val.LikeCount}</p>
            <p>Content: {val.Content}</p>
            <button onClick={()=>deleteComment(val.commentId)}>Delete</button>
            <textarea name="content" cols="10" rows="2" maxlength="256" onChange={(e)=> {
            setUpdateContent(e.target.value)
            } }></textarea>
            <button onClick={()=>updateComment(val.commentId)}>Update</button>
          </div>
        );
      })
    }

      <h2>Search for stocks</h2>
      <div className="form">
        <label>Search:</label><input type="text" name="search"></input>
        <br></br>
        <button onClick={searchStock}>Submit</button>
      </div>

      <h2>Advanced Query 1</h2>
      <div className="form">
        <input type="radio" id="bullish" name="bullishorbearish" value="bullish"></input><label for="bullish">Bullish</label>
        <br></br>
        <input type="radio" id="bearish" name="bullishorbearish" value="bearish"></input><label for="bearish">Bearish</label>
        <br></br>
        <button onClick={advancedQuery1}>Submit</button>
      </div>

      <h2>Advanced Query 2</h2>
      <div className="form">
        <input type="date" name="date"></input>
        <br></br>
        <button onClick={advancedQuery2}>Submit</button>
      </div>
    </div>
  )
}

export default App;
