import express from "express";
import { register, login, signOut } from "../controllers/authentication.js";
import { updateProfile } from "../controllers/profileController.js";


const router = express.Router();

router.post("/registerUser", register);
router.post("/login", login);
router.post("/updateProfile", updateProfile)
router.get("/signout", signOut)



export default router;
