import express from "express";
import dotenv from "dotenv/config";
import router from "./server/routes/pages.js";
import mysql from "mysql2";
import pagesRouter from "./server/routes/auth.js";
import movieRouter from "./server/routes/movies.js"


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



app.use(router);
app.use(pagesRouter);
app.use(movieRouter)
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MYSQL connected");
  }
});

const PORT = 8080;

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("Server running on port: " + PORT);
});
