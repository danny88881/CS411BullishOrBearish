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
  const email = require.query.email
  const sqlSelect = "SELECT UserId FROM User WHERE Email = ?";
  db.query(sqlSelect, [email], (err, result) => {
    response.send(result);
  });
})

app.get('/api/getUserData', (require, response) => {
  const id = require.query.UserId
  const sqlSelect = "SELECT FirstName, LastName, Email, JoinDate FROM User WHERE UserId = ?";
  db.query(sqlSelect, [id], (err, result) => {
    response.send(result);
  });
})

app.get('/api/getPassword', (require, response) => {
  const email = require.query.email
  const sqlSelect = "SELECT Password FROM User WHERE Email = ?";
  db.query(sqlSelect, [email], (err, result) => {
    response.send(result);
  });
})

app.get('/api/getUnvoted', (require, response) => {
  const id = require.query.UserId
  const sqlSelect = "SELECT Stock.Symbol FROM Stock LEFT JOIN (SELECT Symbol, UserId FROM StockVote WHERE StockVote.UserId = ?) Voted ON Stock.Symbol = Voted.Symbol WHERE UserID IS NULL";
  db.query(sqlSelect, [id], (err, result) => {
    response.send(result);
  });
})

app.post('/api/vote', (require, response) => {
  const id = require.body.UserId
  const symbol = require.body.Symbol
  const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const bullish = + require.body.Bullish
  const sqlPost = "INSERT INTO StockVote (`UserId`, `Symbol`, `Date`, `BullishOrBearish`) VALUES (?, ?, ?, ?)"
  db.query(sqlPost, [id, symbol, datetime, bullish],(err, result) => {
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

app.get('/api/mostrecentcomment', (request, response) => {
  const sqlSearch = "SELECT CommentId from Comment ORDER BY TimePosted DESC LIMIT 1;";
  db.query(sqlSearch, (err, result) => {
    console.log(err);
    response.send(result);
  });
});

app.post('/api/stockcomment', (request, response) => {
  const symbol = request.body.symbol;
  const commentId = request.body.commentId;
  const sqlInsert = "INSERT INTO StockComment VALUES (?, ?);";
  db.query(sqlInsert, [symbol, commentId], (err, result) => {
    console.log(err);
    response.send(result);
  });
});

app.get('/api/stockcomment', (request, response) => {
  const symbol = request.query.symbol;
  const sqlSearch = "SELECT FirstName, LastName, UserId, Content, TimePosted, CommentId from Comment c NATURAL JOIN StockComment NATURAL JOIN User WHERE Symbol = ? ORDER BY c.TimePosted DESC";
  db.query(sqlSearch, [symbol], (err, result) => {
    console.log(err);
    response.send(result);
  });
});

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
  const sqlSearch = "SELECT Symbol, Name, Sector, Industry, (COUNT(BullishOrBearish) \
  - (SELECT COUNT(BullishOrBearish) \
  FROM Stock NATURAL JOIN StockVote \
  WHERE BullishOrBearish = 0 AND Symbol = a.Symbol \
  GROUP BY Symbol)) as Score \
  FROM Stock as a NATURAL JOIN StockVote \
  WHERE BullishOrBearish = 1 \
  GROUP BY Symbol \
  ORDER BY Score DESC \
  LIMIT 50";
  db.query(sqlSearch, [stockOrderBy], (err, result) => {
    console.log(err);
    response.send(result);
  });
});

app.post('/api/stock', (request, response) => {
  const stockOrderBy = request.body.stockOrderBy;
  const sqlSearch = "SELECT * FROM Stock ORDER BY ?";
  db.query(sqlSearch, [stockOrderBy], (err, result) => {
    console.log(err);
    response.send(result);
  });
});

app.post('/api/stock/search', (request, response) => {
  const stockSymbol = request.body.stockSymbol;
  const sqlSearch = "SELECT * FROM Stock WHERE Symbol LIKE " + db.escape('%'+stockSymbol+'%');
  db.query(sqlSearch, (err, result) => {
    console.log(sqlSearch);
    console.log(err);
    response.send(result);
  })
});

app.post('/api/advanced1', (request, response) => {
  const bullishOrBearish = request.body.bullishOrBearish;
  const sqlAdvanced1 = "SELECT s.Sector, Count(v.Symbol) as NumVotes FROM  StockVote v Natural JOIN Stock s WHERE v.BullishOrBearish = ? GROUP by s.Sector Order by NumVotes DESC LIMIT 5;";
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

app.get('/api/watchlist', (request, response) => {
  const userId = request.query.UserId;
  const sql = "SELECT * from Watchlist WHERE ListId NOT IN (SELECT ListId FROM Watchlist NATURAL JOIN WatchlistFavorite w WHERE w.UserId = ?)";
  db.query(sql, [userId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.post('/api/favoritewatchlist', (request, response) => {
  const sql = "INSERT into WatchlistFavorite VALUES (?, ?)";
  const userId = request.body.UserId;
  const listId = request.body.ListId;
  console.log(request.body);
  db.query(sql, [userId, listId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.post('/api/unfavoritewatchlist', (request, response) => {
  const sql = "DELETE from WatchlistFavorite where UserId=? AND ListId=?;";
  const userId = request.body.UserId;
  const listId = request.body.ListId;
  console.log(request.body);
  db.query(sql, [userId, listId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/getFavoriteLists', (request, response) => {
  const userId = request.query.UserId;
  const sql = "SELECT * FROM Watchlist NATURAL JOIN WatchlistFavorite w WHERE w.UserId = ?";
  db.query(sql, [userId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/stock/bullish', (request, response) => {
  const symbol = request.query.Symbol;
  const sql = "SELECT COUNT(*) FROM StockVote WHERE Symbol = ? AND BullishOrBearish = 1;";
  db.query(sql, [symbol], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/stock/bearish', (request, response) => {
  const symbol = request.query.Symbol;
  const sql = "SELECT COUNT(*) FROM StockVote WHERE Symbol = ? AND BullishOrBearish = 0;";
  db.query(sql, [symbol], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/getWatchlistStocks', (request, response) => {
  const listId = request.query.listid;
  const sql = "SELECT * FROM Stock s NATURAL JOIN WatchlistStock ws join Watchlist w on (ws.ListId = w.ListId) where w.ListId = ?";
  db.query(sql, [listId], (err, result) => {
    console.log(err);
    console.log(result);
    response.send(result);
  })
});

app.get('/api/getWatchlistInfo', (request, response) => {
  const listId = request.query.listid;
  const sql = "SELECT * FROM Watchlist w where w.ListId = ?";
  db.query(sql, [listId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.post('/api/WatchlistCreate', (request, response) => {
  console.log(request.query);
  const creatorId = request.body.creatorid;
  const title = request.body.title;
  const desc = request.body.desc;
  const date = request.body.time;
  const sql = "INSERT INTO Watchlist (CreatorId, CreationDate, Title, Description) VALUES (?, ?, ?, ?);";
  db.query(sql, [creatorId, date, title, desc], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/community', (request, response) => {
  const communityid = request.query.communityid
  const sql = "SELECT * FROM Community where CommunityId = ?";
  db.query(sql, [communityid], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/communityusers', (request, response) => {
  const communityid = request.query.communityid;
  const sql = "SELECT u.FirstName, u.LastName, u.UserId FROM (CommunityMember cm JOIN User u ON cm.UserId = u.UserId) WHERE cm.CommunityId = ?;";
  db.query(sql, [communityid], (err, result) => {
    console.log(err);
    response.send(result);
  })
});


app.post('/api/communitycreate', (request, response) => {
  console.log(request.query);
  const creatorId = request.body.creatorid;
  const title = request.body.name;
  const desc = request.body.desc;
  const sql = "INSERT INTO Community (CreatorId, Name, Description) VALUES (?, ?, ?);";
  db.query(sql, [creatorId, name, desc], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.get('/api/usercommunities', (request, response) => {
  const userId = request.query.userId;
  const sql = "SELECT * FROM Community NATURAL JOIN CommunityMember where CommunityMember.UserId = ?;";
  db.query(sql, [userId], (err, result) => {
    console.log(err);
    response.send(result);
  })  
});

app.get('/api/othercommunities', (request, response) => {
  const userId = request.query.userId;
  const sql = "SELECT * FROM Community where CommunityId NOT IN (SELECT Community.CommunityId from Community NATURAL JOIN CommunityMember where CommunityMember.UserId = ?);";
  db.query(sql, [userId], (err, result) => {
    console.log(err);
    response.send(result);
  })  
});

app.post('/api/joincommunity', (request, response) => {
  const communityId = request.body.communityId;
  const userId = request.body.userId;
  const sql = "INSERT INTO CommunityMember VALUES (?, ?);";
  db.query(sql, [userId, communityId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.post('/api/leavecommunity', (request, response) => {
  const communityId = request.body.communityId;
  const userId = request.body.userId;
  const sql = "DELETE FROM CommunityMember WHERE UserId = ? AND CommunityId = ?;";
  db.query(sql, [userId, communityId], (err, result) => {
    console.log(err);
    response.send(result);
  })
});

app.listen(3002, () => {
  console.log("Running on port 3002")
});

