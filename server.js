const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const UserController = require('./controllers/UserController');
const GameController = require('./controllers/GameController');

require('dotenv').config();
const port = 3000;

const app = express();
const dbUrl = process.env.MONGO_URI;
const dbClient = new MongoClient(dbUrl);
const userController = new UserController();
const gameController = new GameController();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

(async ()=> {
    global.conn = await dbClient.connect(dbUrl);
    global.db = global.conn.db("1st");
})();

app.post("/start", userController.startGame);
app.post("/roll", gameController.roll);

app.listen(port, () => {
  console.log(`Game app listening on port ${port}`)
});