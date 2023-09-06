import express from 'express'
import { getMovies, getTrailer } from '../controllers/movieController.js'
const router = express.Router();

router.get("/movies", getMovies)

router.get("/trailer/:movieId", getTrailer)


export default router