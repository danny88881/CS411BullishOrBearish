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

app.get('/api/get', (require, response) => {
  const sqlSelect = "SELECT * FROM Comment ORDER BY TimePosted DESC LIMIT 5";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
})

app.post('/api/insert', (require, response) => {
  const userId = require.body.userId;
  const content = require.body.content;
  const date = require.body.date;
  const likeCount = require.body.likeCount;
  const sqlInsert = "INSERT INTO Comment (`UserId`, `Content`, `TimePosted`, `LikeCount`) VALUES (?, ?, ?, ?);";
  db.query(sqlInsert, [userId, content, date, likeCount], (err, result)=>{
    console.log(err);
    response.send(err);
  })
})

app.listen(3002, () => {
  console.log("Running on port 3002")
})