import express from "express";
import {
  getPopularMovies,
  getTrailer,
  getUpcomingMovies,
  getMovieDetails,
} from "../middleware/movies.js";
import { isLoggedIn } from "../middleware/auth.js";
const router = express.Router();


//Rest conventions - Rest API should consist of nouns and not verbs
router.get("/movies/popular", isLoggedIn, getPopularMovies);
router.get("/movies/upcoming", isLoggedIn, getUpcomingMovies);
router.get("/trailer/:movieId", getTrailer);
router.get("/movie/:movieId", isLoggedIn, getMovieDetails);

export default router;
