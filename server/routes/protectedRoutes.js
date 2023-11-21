import express from "express"

import { displayAccount, displayProfile, updateProfile, shareMovies } from "../middleware/profile.js";
import { isLoggedIn } from "../middleware/auth.js";
import { saveMovie, seenMovie, deleteMovie, deleteSeenMovie } from "../middleware/movies.js";

const router = express.Router()


//Rest conventions
router.get("/profile", isLoggedIn, displayProfile);
router.get("/account", isLoggedIn, displayAccount);
router.get("/user/movies/:type", isLoggedIn, shareMovies);
router.post("/profile/update", isLoggedIn, updateProfile)
router.post("/movie/save/:movieId", isLoggedIn, saveMovie);
router.post("/movie/seen/:movieId", isLoggedIn, seenMovie);
router.delete("/movie/delete/:movieId", isLoggedIn, deleteMovie);
router.delete("/movie/seen/delete/:movieId", isLoggedIn, deleteSeenMovie);

export default router