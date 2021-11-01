import './App.css';
import Axios from 'axios';

function App() {
  return (
    <div className="App">
      <h1>Midterm Demo</h1>
      <p>CRUD+Search+Advanced Queries</p>
      <h2>Create Comment</h2>
      <div className="form">
        <label>UserId:</label><input type="number" name="userId"></input>
        <br></br>
        <label>Content:</label>
        <br></br>
        <textarea name="content" cols="40" rows="5" maxlength="256"></textarea>
        <br></br>
        <button>Submit</button>
      </div>

      <h2>Reading first 15 Comments</h2>
      
      <h2>Update a comment</h2>
      <div className="form">
        <label>CommentId:</label><input type="number" name="commentId"></input>
        <br></br>
        <label>New Content:</label>
        <br></br>
        <textarea name="content" cols="40" rows="5" maxlength="256"></textarea>
        <br></br>
        <button>Submit</button>
      </div>

      <h2>Delete a comment</h2>
      <div className="form">
        <label>CommentId:</label><input type="number" name="commentId"></input>
        <br></br>
        <button>Submit</button>
      </div>

      <h2>Search for stocks</h2>
      <div className="form">
        <label>Search:</label><input type="text" name="search"></input>
        <br></br>
        <button>Submit</button>
      </div>

      <h2>Advanced Query 1</h2>
      <div className="form">
        <input type="radio" id="bullish" name="bullishorbearish" value="bullish"></input><label for="bullish">Bullish</label>
        <br></br>
        <input type="radio" id="bearish" name="bullishorbearish" value="bearish"></input><label for="bearish">Bearish</label>
        <br></br>
        <button>Submit</button>
      </div>

      <h2>Advanced Query 2</h2>
      <div className="form">
        <input type="date" name="date"></input>
        <br></br>
        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;
