import express from "express";
import {
  getMovies,
  getTrailer,
  getUpcomingMovies,
  getMovieDetails,
  displayMovieDetails,
  displaySingleMovie,
  saveMovie,
  deleteMovie,
  seenMovie
} from "../controllers/movieController.js";
import { isLoggedIn} from "../middleware/middleware.js";
const router = express.Router();

router.get("/movies", isLoggedIn, getMovies);
router.get("/comingMovies", isLoggedIn, getUpcomingMovies);

router.get("/trailer/:movieId", getTrailer);
router.get("/findMovie/:movieId", isLoggedIn, getMovieDetails);
router.get("/movieDetails/:movieId", isLoggedIn, displaySingleMovie)
router.post("/saveMovie/:movieId/:userName", isLoggedIn, saveMovie)
router.post("/seenMovie/:movieId/:userName", isLoggedIn, seenMovie)
router.post("/deleteMovie/:movieId/:userName", deleteMovie)




export default router;
