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

app.post('/api/update', (require, response) => {
  const commentId = require.body.commentId;
  const newContent = require.body.newContent;

  const sqlUpdate = "UPDATE Comment SET Content = ? WHERE CommentId = ?";
  db.query(sqlUpdate, [newContent, commentId], (err, result) => {
    console.log(err);
    response.send(err);
  })
})

app.post('/api/stock/search', (request, response) => {
  const stockSymbol = request.body.stockSymbol;
  const sqlSearch = "SELECT * FROM Stock WHERE Symbol LIKE ?";
  db.query(sqlSearch, [stockSymbol], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.post('/api/advanced1', (request, response) => {
  const bullishOrBearish = request.body.bullishOrBearish;
  const sqlAdvanced1 = "SELECT s.Sector, Count(v.Symbol) as NumVotes FROM  StockVote v Natural JOIN Stock s WHERE v.BullishOrBearish = ? GROUP by s.Sector Order by NumVotes DESC LIMIT 15;";
  db.query(sqlAdvanced1, [bullishOrBearish], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.listen(3002, () => {
  console.log("Running on port 3002")
})
