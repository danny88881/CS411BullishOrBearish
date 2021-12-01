import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios';

const Community = () => {
  let { communityid } = useParams();

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");

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
  }, []);
  

  return (
    <div>
      <h1>name: {name}</h1>
      <p>desription: {description}</p>
      <br></br>

      
      <h1>Users in this community:</h1>
      {users &&
       users.map((user) =>
         <div>
           <p>{user.FirstName.toLowerCase() + " " + user.LastName.toLowerCase()}</p>
         </div>
       )}
    </div>
  );
};

export default Community;
