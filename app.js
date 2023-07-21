import express from 'express'
import dotenv from 'dotenv/config'
import router from './routes/pages.js'





const app = express()
app.use(router)
app.use(express.static("public"))



const PORT = 8080
app.listen(PORT, (error) => {
    if(error){
        console.log(error)
    }
    console.log('Server running on port: ' + PORT)
})