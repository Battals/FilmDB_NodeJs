import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { usersCollection, favouriteMoviesCollection, seenMoviesCollection } from '../db/dbCollections.js';


  export const displayProfile = async (req, res) => {

    const apiKey = process.env.API_KEY;

    if(!res.isLoggedIn){
        return res.status(401).send("Unauthorized")
    }
    const username = res.username;

    const data = {
        username: username,
    };

    try {
        const savedMovies = await favouriteMoviesCollection.find({ userName: username }).toArray();
        const seenMovies = await seenMoviesCollection.find({ userName: username }).toArray();

        res.render("myProfile", { savedMovies: JSON.stringify(savedMovies), seenMovies: JSON.stringify(seenMovies), apiKey, data });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



    export const displayAccount = async (req, res) => {
        if(!res.isLoggedIn){
            return res.status(401).send("Unauthorized")
        }

           const username = res.username


            try{
                const userInfo = await usersCollection.find({username: username}).toArray();
                const user = userInfo[0]
                console.log(user)
                res.render("myAccount", {username: username, email: user.email})
            }
            catch(error){
                console.log("Error", error)
            }
        
        }

        
    

    export const updateProfile = async (req, res) => {

        if(!res.isLoggedIn){
            return res.status(401).send("Unauthorized")
        }


        let username = res.username


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



        const updatedUsername = await usersCollection.findOne({username: newUserValues.username})
        const updatedEmail = await usersCollection.findOne({email: newUserValues.email})
        if(updatedUsername || updatedEmail){
            return res.status(409).send("")
        }

        try{

        await usersCollection.updateOne({username: username}, {$set: newUserValues})


        const token = jwt.sign({userName: newUserValues.username }, process.env.SECRET_KEY);

        if(newUserValues.username){

            res.cookie("token", token, {
              expires: new Date(Date.now() + 3 + 3600000),
              httpOnly: true,
            });
            await favouriteMoviesCollection.updateMany({userName: username}, {$set: {userName:newUserValues.username} })
            await seenMoviesCollection.updateMany({userName: username}, {$set: {userName: newUserValues.username}})
        }

        return res.status(200).json({token: token, username: newUserValues.username})
    } catch(error){
        console.log(error)
        return res.status(500).send("")
    }

}

export const shareMovies = async (req, res) => {
    const type = req.params.type;

    if (!res.isLoggedIn) {
        return res.status(401).json({ errorMessage: `Du skal logge ind for at dele din ${type}-liste` });
    }

    const username = res.username;
    let movieList, movieIds;

    if (type === "Favorit") {
        movieList = await favouriteMoviesCollection.find({ userName: username }).toArray();
    } else if (type === "Set") {
        movieList = await seenMoviesCollection.find({ userName: username }).toArray();
    }

    if (movieList) {
        movieIds = movieList.map(document => document.movieId);
        return res.status(200).json({movies: movieIds}) 
    }
};









