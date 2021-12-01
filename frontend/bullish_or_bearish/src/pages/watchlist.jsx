import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';

const WatchList = () => {
  let { listid } = useParams();

  const [score, setScore] = useState(0);

  const [stocks, setStocks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");

  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  const [updateContent, setUpdateContent] = useState("");

  useEffect(() => {
  Axios.get('http://localhost:3002/api/getWatchlistStocks', {
        params: {listid: listid}
      }).then((res)=> {
          setStocks(res.data);
    });

  Axios.get('http://localhost:3002/api/getWatchlistScore', {
      params: {listid: listid}
    }).then((res)=> {
      console.log(res.data);
      setScore(res.data[0].Score);
  });
  
  Axios.get('http://localhost:3002/api/getWatchlistInfo', {
        params: {listid: listid}
      }).then((res)=> {
          const retrievedInfo = res.data[0];
          setTitle(retrievedInfo['Title'].toLowerCase());
          setDescription(retrievedInfo['Description'].toLowerCase());
          setCreator(retrievedInfo['CreatorId']);
      });

    Axios.get('http://localhost:3002/api/watchlistcomment', {
      params: {listId: listid}
    }).then((res) => {
      setComments(res.data);
    });
 }, []);

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
      // get the id to which the WatchlistComment will be associated
      Axios.get('http://localhost:3002/api/mostrecentcomment').then((res) => {
        // insert into the WatchlistComment table
        Axios.post('http://localhost:3002/api/watchlistcomment', {
          listId: parseInt(listid),
          commentId: res.data[0].CommentId
        }).then(() => {
          // refresh comments
          Axios.get('http://localhost:3002/api/watchlistcomment', {
            params: {listId: parseInt(listid)}
          }).then((res) => {
            setComments(res.data);
          });
        });
      });
    });
  };
  
  const updateComment = (updateId) => {
    if (updateContent.length !== 0) {
      Axios.post('http://localhost:3002/api/updatewatchlistcomment', {
        commentId: updateId,
        newContent: updateContent,
      }).then(()=> {
        Axios.get('http://localhost:3002/api/watchlistcomment', {
          params: {listId: listid}
        }).then((res) => {
          setComments(res.data);
        });
      });
    }
  };

  const deleteComment = (deleteId) => {
    Axios.post('http://localhost:3002/api/deletewatchlistcomment', {
      commentId: deleteId
    }).then(()=> {
      Axios.post('http://localhost:3002/api/deletewatchlistcomment', {
        commentId: deleteId
      }).then(() => {
        Axios.get('http://localhost:3002/api/watchlistcomment', {
          params: {listId: listid}
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
      Axios.get('http://localhost:3002/api/watchlistcomment', {
        params: {listId: listid}
      }).then((res) => {
        setComments(res.data);
      });
    });
  };  

    return (
      <div class="menu">
        <h1 style={{display:"inline", color:score>0?"#adff2f":"#ff0000", fontSize:"64px"}}>{title}:{score}</h1>
        <p>{creator}</p>
        <p>{description}</p>
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
  };

export default WatchList;
