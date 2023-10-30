import express from 'express'
const router = express.Router();

import {
    displayProfile,
    displayAccount
   } from "../controllers/profileController.js";
import { isLoggedIn } from '../middleware/middleware.js';


router.get('/', isLoggedIn, (req, res)  => {
    res.render('frontPage', {isLoggedIn: res.isLoggedIn})
})

router.get('/findMovie', isLoggedIn, (req, res) => {
    res.render('findMovie', {isLoggedIn: res.isLoggedIn})
})

router.get('/upcomingMovies', isLoggedIn, (req, res) => {
    res.render('upcomingMovies', {isLoggedIn: res.isLoggedIn})
})

router.get("/myProfile", isLoggedIn, displayProfile)

router.get("/myAccount", isLoggedIn, displayAccount)

router.get('/login', (req, res) => { 
    res.render('login', {req})
})

router.get('/register', (req, res) => {
    res.render('registerPage', res)
})



export default router