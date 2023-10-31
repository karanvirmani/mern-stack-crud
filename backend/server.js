let express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
let cors = require("cors");
let bodyParser = require("body-parser");

// Express Route

const password = encodeURIComponent("K@ran1307");
const mongoURI = `mongodb+srv://karanvirmani1307:${password}@cluster0.gr3zv56.mongodb.net/?retryWrites=true&w=majority`;
console.log(mongoURI);

const studentRoute = require("../backend/routes/student.routes");

(async () => {
  let retryCount = 1;
  const nativeClient = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  while (retryCount <= 5 && !nativeClient.isConnected()) {
    console.log(
      `Trying Count : ${retryCount}, Server Status : ${nativeClient.isConnected()}`
    );

    // eslint-disable-next-line no-await-in-loop
    await nativeClient.connect();
    retryCount += 1;
  }

  console.log("Successfully connected to db");

  const StudentsCollection = nativeClient
    .db("project1")
    .collection("classrooms");

  global.StudentsCollection = StudentsCollection;
  const app = express();
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cors());
  app.use("/students", studentRoute);

  // PORT
  const port = process.env.PORT || 4000;
  const server = app.listen(port, () => {
    console.log("Connected to port " + port);
  });

  // 404 Error
  app.use((req, res, next) => {
    res.status(404).send("Error 404!");
  });

  app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });
})();
