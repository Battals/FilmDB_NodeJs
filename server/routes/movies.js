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
  seenMovie,
  deleteSeenMovie
} from "../controllers/movieController.js";
import { isLoggedIn} from "../middleware/middleware.js";
const router = express.Router();

router.get("/popularMovies", isLoggedIn, getMovies);
router.get("/comingMovies", isLoggedIn, getUpcomingMovies);
router.get("/trailer/:movieId", getTrailer);
router.get("/findMovie/:movieId", isLoggedIn, getMovieDetails);
router.get("/movieDetails/:movieId", isLoggedIn, displaySingleMovie)
router.post("/saveMovie/:movieId/:userName", isLoggedIn, saveMovie)
router.post("/seenMovie/:movieId/:userName", isLoggedIn, seenMovie)
router.post("/deleteMovie/:movieId/:userName", isLoggedIn, deleteMovie)
router.post("/deleteSeenMovie/:movieId/:userName", isLoggedIn, deleteSeenMovie)







export default router;
