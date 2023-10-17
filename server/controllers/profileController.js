import jwt, { decode } from 'jsonwebtoken'

import {client} from '../db/dbConnection2.js'


const userMovies = client.db("Cluster0").collection("savedMovies");
const seenMovies = client.db("Cluster0").collection("seenMovies")


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
    const apiKey = process.env.API_KEY;
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

        async function getProfileData() {
            try {
                const savedMovies = await userMovies.find({ userName: username}).toArray();
                const seenMovies1 = await seenMovies.find({userName: username}).toArray();
                console.log("Collection Data:", seenMovies1);

                res.render("myProfile", {savedMovies: JSON.stringify(savedMovies), seenMovies: JSON.stringify(seenMovies1), apiKey, data})
            } catch (error) {
                console.log("Error:", error);
            }
        }
        
        getProfileData();
        
    })}