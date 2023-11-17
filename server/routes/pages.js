import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth.js";

router.get("/", isLoggedIn, (req, res) => {
  res.render("frontPage", { isLoggedIn: res.isLoggedIn });
});

router.get("/findMovie", isLoggedIn, (req, res) => {
  res.render("findMovie", { isLoggedIn: res.isLoggedIn });
});

router.get("/upcomingMovies", isLoggedIn, (req, res) => {
  res.render("upcomingMovies", { isLoggedIn: res.isLoggedIn });
});

router.get("/movieChat", isLoggedIn, (req, res) => {
  res.render("movieChat", { isLoggedIn: res.isLoggedIn });
});

router.get("/login", (req, res) => {
  res.sendFile("login.html", {root: "client/public"})
});

router.get("/register", (req, res) => {
  res.sendFile("register.html", {root: "client/public"})
});


export default router;
