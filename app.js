import express from "express";
import dotenv from "dotenv/config";
import router from "./server/routes/pages.js";
import pagesRouter from "./server/routes/auth.js";
import movieRouter from "./server/routes/movies.js";
import protectedRoutes from "./server/routes/protectedRoutes.js"
import {run} from "./server/db/dbConnection2.js"
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import http from "http"
import {Server} from "socket.io"

//TO DO - Fix projekt strukur, ryd op i client.js, gør alle fetch requests ens / Gør projektet ensartet og konsistent

const app = express();

const server = http.createServer(app)
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "server/views"));

app.use("/client/JS", express.static(path.join(__dirname, "client/JS")));
app.use("/client/CSS", express.static(path.join(__dirname, "client/CSS")));

app.use(router);
app.use(pagesRouter);
app.use(movieRouter);
app.use(protectedRoutes)


run()

const PORT = 8080;

server.listen(PORT, (error) => {
  if(error) {
    console.log(error)
  }
  console.log("Server running on " + PORT)
})

let clientsConnected = 0;
io.on("connection", (socket) => {
  clientsConnected++
  
    io.emit("connectedClientsCount", clientsConnected)  

  socket.on("sendMessage", (messageObject) => {
    socket.broadcast.emit("recieveMessage", messageObject)
  })

  socket.on("disconnect", () => {
    console.log(clientsConnected)
    console.log("A user disconnected")
    clientsConnected--
    io.emit("connectedClientsCount", clientsConnected)
  })
})


