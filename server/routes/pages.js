import express from 'express'
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile("frontPage.html", {root: 'client'})
})

router.get('/login', (req, res) => {
    res.sendFile("loginPage.html", {root: 'client'})
})

router.get('/register', (req, res) => {
    res.sendFile("registerPage.html", {root: 'client'})
})



export default router