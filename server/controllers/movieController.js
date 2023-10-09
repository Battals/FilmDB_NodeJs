const API_KEY = process.env.API_KEY;
import createDbConnection from "../db/dbConnection.js";
import jwt from 'jsonwebtoken'
const db = createDbConnection()

export const getMovies = async (req, res) => {
  const isLoggedIn = res.locals.isLoggedIn
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=da&page=1&sort_by=popularity.desc`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log("Movies fetched successfully!");
    res.json(data);
  } catch (error) {
    console.log(error.message)
    console.error("Error fetching movies:", error.message);
    res.status(500).send("Error fetching movies");
  }
};
export const getTrailer = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;

    const response = await fetch(apiUrl);
    const data = await response.json(); 

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).send("Error fetching trailers");
    }
  } catch (error) {
    console.error("Error fetching trailers:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUpcomingMovies = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=da&page=1&region=US`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Movies fetched successfully!");
    res.json(data);
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).send("Error fetching movies");
  }
};

export const getMovieDetails = async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=da`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
    return data
    } catch (error) {
    console.log(error.message);
  }
};

export async function displayMovieDetails(movieId){
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=da`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = await response.json();
    return data
    } catch (error) {
    console.log(error.message);
  }
}

  export const displaySingleMovie = async (req, res, next) => {
    const isLoggedIn = res.locals.isLoggedIn
    try{
        const movieId = req.params.movieId
        displayMovieDetails(movieId).then((data) => {
            const movieDetails = data
            res.render("movieDetails", {movieDetails, isLoggedIn})
            next()
          })
          
    }
    catch (error){
        console.log(error)

        next()
    }

  }

export const saveMovie = async (req, res) => {
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decodedToken.userId;
  const movieId = req.params.movieId
  const values = [userId, movieId]
  db.query("INSERT INTO user_movies (user_id, movie_id) VALUES (?, ?)", values, (error, results) => {
  if(error){
    res.status(409)
  } else {
    console.log("Data inserted into user_movies")
    res.status(200).send({Succes: "Movie succesfully saves"})
  }
  })
}

export const deleteMovie = (req, res) => {
const token = req.cookies.token;
const movieId = req.params.movieId
const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
const userId = decodedToken.userId

db.query("DELETE FROM user_movies WHERE user_id = ? AND movie_id = ?", 
[userId, movieId], (error, results) => {
  if (error) {
    res.status(409)
  } else {
    console.log("Filmen blev slettet")
    res.status(200).send({Succes: "Filmen blev slettet"})
  }
}
)
  
}







