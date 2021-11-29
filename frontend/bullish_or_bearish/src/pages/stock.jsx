import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';

const Stock = () => {
  let { symbol } = useParams();
  const [name, setName] = useState(null);
  const [sector, setSector] = useState(null);
  const [industry, setIndustry] = useState(null);

  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

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

  if (name === null) {
    return <p>not found</p>;
  } else {
    return (
      <div>
        <h1>symbol: {symbol}</h1>
        <p>name: {name}</p>
        <p>sector: {sector}</p>
        <p>industry: {industry}</p>
        <br></br>

        <h1>comments:</h1>
        <textarea name="content" cols="40" rows="5" maxlength="256"
                  onChange={(e) => setContent(e.target.value)}
                  style={{color: "black"}}></textarea>
        <br></br>
        <button onClick={submitComment}>submit comment</button>

        {comments &&
         comments.map((comment) =>
           <div>
             <h1>user: {comment['FirstName'].toLowerCase() + " " + comment['LastName'].toLowerCase()}</h1>
             <p>{comment['TimePosted']}</p>
             <p>{comment['Content'].toLowerCase()}</p>
             {parseInt(localStorage.getItem('userId')) === comment['UserId'] &&
              <div>
                <textarea name="content" cols="50" rows="4" maxlength="256" onChange={(e)=> {
                  setUpdateContent(e.target.value);
                } }></textarea>
                <button onClick={()=>updateComment(comment['CommentId'])}>update</button>
              </div>}
           </div>
         )}
      </div>
    );
  }
};

export default Stock;
