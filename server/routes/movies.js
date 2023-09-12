import express from 'express'
import { getMovies, getTrailer, getUpcomingMovies } from '../controllers/movieController.js'
const router = express.Router();

router.get("/movies", getMovies)
router.get("/comingMovies", getUpcomingMovies )

router.get("/trailer/:movieId", getTrailer)


export default router