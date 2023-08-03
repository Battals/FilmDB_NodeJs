import express from 'express';
import bcrypt from 'bcrypt';
import { register, login } from '../controllers/authentication.js'; // Use ESM import

const router = express.Router();

router.post("/register", register); // Use the imported register function
router.post("/login", login)



export default router;
