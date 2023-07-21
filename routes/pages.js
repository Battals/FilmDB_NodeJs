import express from 'express'
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile("frontPage.html", {root: './public/'})
})

export default router