import express from "express";
import {
  getPopularMovies,
  getTrailer,
  getUpcomingMovies,
  getMovieDetails,
} from "../middleware/movies.js";
import { isLoggedIn } from "../middleware/auth.js";
const router = express.Router();

router.get("/popularMovies", isLoggedIn, getPopularMovies);
router.get("/comingMovies", isLoggedIn, getUpcomingMovies);
router.get("/trailer/:movieId", getTrailer);
router.get("/findMovie/:movieId", isLoggedIn, getMovieDetails);

export default router;
