import express from 'express'
import { getMovies } from '../controllers/authentication.js';
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile("frontPage.html", {root: 'public'})
})

router.get('/login', (req, res) => {
    res.sendFile("loginPage.html", {root: 'public'})
})

router.get('/register', (req, res) => {
    res.sendFile("registerPage.html", {root: 'public'})
})

router.get("/movies", getMovies)





export default router