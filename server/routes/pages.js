import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth.js";

router.get("/", isLoggedIn, (req, res) => {
  res.render("frontPage", {
    isLoggedIn: res.isLoggedIn,
    API_KEY: process.env.API_KEY,
  });
});

router.get("/movies/coming", isLoggedIn, (req, res) => {
  res.render("upcomingMovies", {
    isLoggedIn: res.isLoggedIn,
    API_KEY: process.env.API_KEY,
  });
});

router.get("/findMovie", isLoggedIn, (req, res) => {
  res.render("findMovie", { isLoggedIn: res.isLoggedIn, API_KEY: process.env.API_KEY });
});

router.get("/movieChat", isLoggedIn, (req, res) => {
  res.render("movieChat", { isLoggedIn: res.isLoggedIn });
});

router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "client/public" });
});

router.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "client/public" });
});

export default router;
