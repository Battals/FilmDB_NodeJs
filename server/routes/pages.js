import express from 'express'
const router = express.Router();

import {
    displayProfile
   } from "../controllers/profileController.js";
import { isLoggedIn, isLoggedInHeader } from '../middleware/middleware.js';


router.get('/', isLoggedIn, (req, res)  => {
    res.render('frontPage', {isLoggedIn: res.locals.isLoggedIn})
})

router.get('/findMovie', isLoggedIn, (req, res) => {
    res.render('findMovie', {isLoggedIn: res.locals.isLoggedIn})
})

router.get('/upcomingMovies', isLoggedIn, (req, res) => {
    res.render('upcomingMovies', {isLoggedIn: res.locals.isLoggedIn})
})

router.get("/myProfile", isLoggedIn, displayProfile)

router.get('/login', (req, res) => { 
    res.render('login', {req})
})

router.get('/register', (req, res) => {
    res.render('register', res)
})








export default router