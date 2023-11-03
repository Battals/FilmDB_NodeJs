import jwt, { decode } from 'jsonwebtoken'

import {client} from '../db/dbConnection2.js'
import bcrypt from 'bcrypt'


const favoriteMovies = client.db("Cluster0").collection("savedMovies");
const seenMovies = client.db("Cluster0").collection("seenMovies")
const users = client.db("Cluster0").collection("users")


export const displaySingleMovie = async (req, res) => {
    try{
        const movieId = req.params.movieId
        displayMovieDetails(movieId).then((data) => {
            const movieDetails = data
            res.render("movieDetails", {movieDetails})
          })
    }
    catch (error){
        console.log(error)
    }
  }


  export const displayProfile = async (req, res) => {
    const token = req.cookies.token;
    const apiKey = process.env.API_KEY;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send('Unauthorized');
        }
        const username = decoded.userName
        const data = {
            username: username,
        };


        async function getProfileData() {
            try {
                const savedMovies = await favoriteMovies.find({ userName: username }).toArray();
                const seenMovies1 = await seenMovies.find({ userName: username }).toArray();

                res.render("myProfile", { savedMovies: JSON.stringify(savedMovies), seenMovies: JSON.stringify(seenMovies1), apiKey, data });
            } catch (error) {
                console.log("Error:", error);
            }
        }

        getProfileData();
    });
};


    export const displayAccount = async (req, res) => {
        const token = req.cookies.token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                console.log(err)
            }

           const username = decoded.userName

        
        async function getAccountData(){
            try{
                const userInfo = await users.find({username: username}).toArray();
                const user = userInfo[0]
                res.render("myAccount", {userName: username, email: user.email})
            }
            catch(error){
                console.log("Error", error)
            }
        
        }


        getAccountData()

    } )
        
    }

    export const updateProfile = async (req, res) => {
        let username;
        const token = req.cookies.token
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
             username = decoded.userName;


        } catch (err) {

            console.log(err);
        }

        const newUserValues = req.body;
        for(const key in newUserValues){
            if(newUserValues[key] === ''){
                delete newUserValues[key]
            }
        }

        if(newUserValues.password){
            const hashedPassword = await bcrypt.hash(newUserValues.password, 8)
            newUserValues.password = hashedPassword
        }



        const updatedUsername = await users.findOne({username: newUserValues.username})
        const updatedEmail = await users.findOne({email: newUserValues.email})
        if(updatedUsername || updatedEmail){
            return res.status(409).send("")
        }

        try{

        await users.updateOne({username: username}, {$set: newUserValues})


        const token = jwt.sign({userName: newUserValues.username }, process.env.SECRET_KEY);

        if(newUserValues.username){

            res.cookie("token", token, {
              expires: new Date(Date.now() + 3 + 3600000),
              httpOnly: true,
            });
            await favoriteMovies.updateMany({userName: username}, {$set: {userName:newUserValues.username} })
            await seenMovies.updateMany({userName: username}, {$set: {userName: newUserValues.username}})
        }



        return res.status(200).json({token: token, username: newUserValues.username})
    } catch(error){
        console.log(error)
        return res.status(500).send("")
    }

}