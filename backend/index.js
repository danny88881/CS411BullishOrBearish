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

app.get('/api/getId', (require, response) => {
  const sqlSelect = "SELECT UserId FROM User WHERE Email = ?";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
})

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

app.post('/api/stocks', (request, response) => {
  const stockOrderBy = request.body.stockOrderBy;
  const sqlSearch = "SELECT * FROM Stock ORDER BY ?";
  db.query(sqlSearch, [stockOrderBy], (err, result) => {
    console.log(err);
    response.send(result);
  });
});

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

app.post('/api/advanced2', (request, response) => {
  const bullishOrBearish = request.body.bullishOrBearish;
  console.log(bullishOrBearish);
  const sqlAdvanced2 = "SELECT Symbol, COUNT(Symbol) as NumVotes FROM (SELECT s.Symbol as Symbol, v.Date as Date FROM Stock s NATURAL JOIN StockVote v WHERE v.Date >= ?) as VotesOctAndAfter GROUP BY Symbol ORDER BY NumVotes DESC;";
  db.query(sqlAdvanced2, [bullishOrBearish], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.post('/api/delete', (require, response) => {
  const commentId = require.body.commentId;
  const sqlDelete = "DELETE FROM Comment where CommentId = ?"; 
  db.query(sqlDelete, [commentId], (err, result)=>{
    console.log(err);
    response.send(err);
  })
});

app.post('/api/register', (require, response) => {
  const firstName = require.body.first_name;
  const lastName = require.body.last_name;
  const email = require.body.email;
  const password = require.body.password;
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const sqlRegister = "INSERT INTO User (FirstName, LastName, Email, Password, JoinDate) VALUES (?, ?, ?, ?, ?)"; 
  db.query(sqlRegister, [firstName, lastName, email, password, datetime], (err, result)=>{
    console.log(err);
    response.send(err);
  })
})

app.listen(3002, () => {
  console.log("Running on port 3002")
});
