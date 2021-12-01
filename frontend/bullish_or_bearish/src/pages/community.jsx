import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';

const Community = () => {
  let { communityid } = useParams();

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");

  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  const [topContributors, setTopContributors] = useState([]);

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
      // get the id to which the CommunityComment will be associated
      Axios.get('http://localhost:3002/api/mostrecentcomment').then((res) => {
        // insert into the CommunityComment table
        Axios.post('http://localhost:3002/api/communitycomment', {
          communityid: parseInt(communityid),
          commentId: res.data[0].CommentId
        }).then(() => {
          // refresh comments
          Axios.get('http://localhost:3002/api/communitycomment', {
            params: {communityid: parseInt(communityid)}
          }).then((res) => {
            setComments(res.data);
          });
        });
      });
    });
  };

  useEffect(() => {
    Axios.get('http://localhost:3002/api/community', {
      params: {communityid: communityid}
    }).then((res)=> {
      const retrievedInfo = res.data[0];
      setName(retrievedInfo['Name'].toLowerCase());
      setDescription(retrievedInfo['Description'].toLowerCase());
      setCreator(retrievedInfo['CreatorId']);
    });

    Axios.get('http://localhost:3002/api/communityusers', {
      params: {communityid: communityid}
    }).then((res)=> {
      setUsers(res.data);
    });

    Axios.get('http://localhost:3002/api/communitycomment', {
      params: {communityid: communityid}
    }).then((res) => {
      setComments(res.data);
    });

    Axios.get('http://localhost:3002/api/topcontributors', {
      params: {communityid: communityid}
    }).then((res) => {
      setTopContributors(res.data);
    });    
  }, []);

  const updateComment = (updateId) => {
    if (updateContent.length !== 0) {
      Axios.post('http://localhost:3002/api/updatecommunitycomment', {
        commentId: updateId,
        newContent: updateContent,
      }).then(()=> {
        Axios.get('http://localhost:3002/api/communitycomment', {
          params: {communityid: communityid}
        }).then((res) => {
          setComments(res.data);
        });
      });
    }
  };

  const deleteComment = (deleteId) => {
    Axios.post('http://localhost:3002/api/deletecommunitycomment', {
      commentId: deleteId
    }).then(()=> {
      Axios.post('http://localhost:3002/api/deletecommunitycomment', {
        commentId: deleteId
      }).then(() => {
        Axios.get('http://localhost:3002/api/communitycomment', {
          params: {communityid: communityid}
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
      Axios.get('http://localhost:3002/api/communitycomment', {
        params: {communityid: communityid}
      }).then((res) => {
        setComments(res.data);
      });
    });
  };  

  return (
    <div class="menu">
      <h1>{name}</h1>
      <p>{description}</p>
      <br></br>

      <h1>top contributors:</h1>
      {topContributors &&
       topContributors.map((user) =>
         <div>
           <p>{user.FirstName.toLowerCase() + " " + user.LastName.toLowerCase()}</p>
         </div>
       )}

      <h1>users:</h1>
      {users &&
       users.map((user) =>
         <div>
           <p>{user.FirstName.toLowerCase() + " " + user.LastName.toLowerCase()}</p>
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

export default Community;
