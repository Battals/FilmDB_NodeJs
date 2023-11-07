import express from "express";
import dotenv from "dotenv/config";
import router from "./server/routes/pages.js";
import pagesRouter from "./server/routes/auth.js";
import movieRouter from "./server/routes/movies.js";
import {run} from "./server/db/dbConnection2.js"
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import http from "http"
import {Server} from "socket.io"





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app)

const io = new Server(server)







app.use(express.json());



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "server/views"));
app.use(express.static("client"));


app.use("/client/JS", express.static(path.join(__dirname, "client/JS")));
app.use("/client/CSS", express.static(path.join(__dirname, "client/CSS")));



app.use(router);
app.use(pagesRouter);
app.use(movieRouter);

run()

const PORT = 8080;

server.listen(PORT, (error) => {
  if(error) {
    console.log(error)
  }
  console.log("Server running on " + PORT)
})

io.on("connection", (socket) => {
  console.log("A user connected")


  socket.on("disconnect", () => {
console.log("A user disconnected")
  })
}
)