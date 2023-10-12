import express from "express";
import { register, login, signOut } from "../controllers/authentication.js";


const router = express.Router();

router.post("/registerUser", register);
router.post("/login", login);
router.get("/signout", signOut)



export default router;
