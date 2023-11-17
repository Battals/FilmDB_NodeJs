import express from "express"

import { displayAccount, displayProfile, updateProfile, shareMovies } from "../middleware/profile.js";
import { isLoggedIn } from "../middleware/auth.js";
import { saveMovie, seenMovie, deleteMovie, deleteSeenMovie } from "../middleware/movies.js";

const router = express.Router()

router.get("/myProfile", isLoggedIn, displayProfile);
router.get("/myAccount", isLoggedIn, displayAccount);
router.get("/getUserMovies/:type", isLoggedIn, shareMovies);
router.post("/updateProfile", isLoggedIn, updateProfile)
router.post("/saveMovie/:movieId", isLoggedIn, saveMovie);
router.post("/seenMovie/:movieId", isLoggedIn, seenMovie);
router.delete("/deleteMovie/:movieId", isLoggedIn, deleteMovie);
router.delete("/deleteSeenMovie/:movieId", isLoggedIn, deleteSeenMovie);

export default router