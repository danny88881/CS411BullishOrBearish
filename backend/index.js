require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS
})

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

//console.log(process.env);

app.post('/api/insert', (require, response) => {
  const userId = require.body.userId;
  const content = require.body.content;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const likeCount = 0

  const sqlInsert = "INSERT INTO Comment (`UserId`, `Content`, `TimePosted`, `LikeCount`) VALUES (?, ?, ?, ?);";
  db.query(sqlInsert, [userId, content, date, likeCount], (err, result)=>{
    console.log(err);
    response.send(err);
  })
})

app.listen(3002, () => {
  console.log("Running on port 3002")
})