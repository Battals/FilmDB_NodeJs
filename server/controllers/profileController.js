import createDBConnection from "../db/dbConnection.js"
import jwt, { decode } from 'jsonwebtoken'
const db = createDBConnection()

import {client} from '../db/dbConnection2.js'


export const displaySingleMovie = async (req, res) => {
    try{
        const movieId = req.params.movieId
        displayMovieDetails(movieId).then((data) => {
            const movieDetails = data
            console.log(data)
            res.render("movieDetails", {movieDetails})
          })
    }
    catch (error){
        console.log(error)
    }
  }


  export const displayProfile = async (req, res) => {
    const token = req.cookies.token;
    const username = req.cookies.username;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send('Unauthorized');
        }

        const userId = decoded.userId;

        const data = {
            username: req.cookies.username, 
            id: userId,
        };

        const userMovies = client.db("Cluster0").collection("savedMovies");


        async function getUserMovies() {
            try {
                const results = await userMovies.find({ userName: username }).toArray();
                console.log("Collection Data:", results);
                res.render("myProfile", {results: JSON.stringify(results), apiKey, data})
            } catch (error) {
                console.log("Error:", error);
            }
        }


        
        getUserMovies();

        

      

        const apiKey = process.env.API_KEY;


    })}