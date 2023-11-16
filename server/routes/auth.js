import express from "express";
import { register, login, signOut } from "../middleware/auth.js"
import { updateProfile } from "../middleware/profile.js";


const router = express.Router();

router.post("/registerUser", register);
router.post("/login", login);
router.post("/updateProfile", updateProfile)
router.get("/signout", signOut)



export default router;
