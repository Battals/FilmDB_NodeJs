import express from "express";
import {
  getMovies,
  getTrailer,
  getUpcomingMovies,
  getMovieDetails,
  displaySingleMovie,
  saveMovie,
  deleteMovie,
  seenMovie,
  deleteSeenMovie,
} from "../middleware/movies.js";
import { isLoggedIn } from "../middleware/auth.js";
import {shareMovies} from "../middleware/profile.js"
const router = express.Router();

router.get("/popularMovies", isLoggedIn, getMovies);
router.get("/comingMovies", isLoggedIn, getUpcomingMovies);
router.get("/trailer/:movieId", getTrailer);
router.get("/findMovie/:movieId", isLoggedIn, getMovieDetails);
router.get("/movieDetails/:movieId", isLoggedIn, displaySingleMovie);
router.post("/saveMovie/:movieId/:userName", isLoggedIn, saveMovie);
router.post("/seenMovie/:movieId/:userName", isLoggedIn, seenMovie);
router.post("/deleteMovie/:movieId/:userName", isLoggedIn, deleteMovie);
router.post("/deleteSeenMovie/:movieId/:userName", isLoggedIn, deleteSeenMovie);
router.get("/getUserMovies/:type", isLoggedIn, shareMovies);

export default router;
