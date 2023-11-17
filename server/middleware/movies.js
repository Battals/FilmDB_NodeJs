const API_KEY = process.env.API_KEY;

import { client } from "../db/dbConnection2.js";

const userMovies = client.db("Cluster0").collection("savedMovies");
const seenMovies = client.db("Cluster0").collection("seenMovies");


export const getMovies = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=da&page=1`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    console.log("Movies fetched successfully!");
    res.json(data);
  } catch (error) {
    console.log(error.message);
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
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=da&append_to_response=credits,similar,details,recommendations,latest`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export async function displayMovieDetails(movieId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=da`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export const displaySingleMovie = async (req, res, next) => {
  const isLoggedIn = res.isLoggedIn;
  try {
    const movieId = req.params.movieId;
    displayMovieDetails(movieId).then((data) => {
      const movieDetails = data;
      res.render("movieDetails", { movieDetails, isLoggedIn });
      next();
    });
  } catch (error) {
    console.log(error);
}
};

export const saveMovie = async (req, res) => {
  if (!res.isLoggedIn) {
    return res
      .status(409)
      .json({ message: "Log venligst ind for at gemme denne film" });
  } else {
    const movieId = req.params.movieId;
    const userName = res.username;
    const existingRecord = await userMovies.findOne({ userName, movieId });
    if (existingRecord) {
      return res
        .status(409)
        .json({
          message: "Du har allerede tilføjet denne film til favoritter",
        });
    }
    await userMovies.insertOne({ userName, movieId });
    return res.status(200).json({message: "Tilføjet til favorit"});
  }
};

export const seenMovie = async (req, res) => {
  if(!res.isLoggedIn){
    return res.status(409).json({message: "Log venligst ind for at gemme denne film"})
  }
  const userName = res.username;
  const movieId = req.params.movieId;

  const existingRecord = await seenMovies.findOne({userName, movieId})
  if(existingRecord) {
    return res.status(409).json({message: "Er i forvejen gemt i din Set-liste"})
  }

  await seenMovies.insertOne({userName, movieId})
  return res.status(200).json({message: "Gemt til din Set-liste"})
}

export const deleteMovie = async (req, res) => {
  if(!res.isLoggedIn){
    return res.status(403).send({message: "Log venligst ind for at slette denne film"})
  }

  const username = res.username
  const movieId = req.params.movieId;

 const result = await userMovies.deleteOne({userName: username, movieId: movieId})
 if(result.acknowledged == true){
  return res.status(200).json({message: "Filmen er nu slettet fra din Favorit-liste"})
 } else {
  return res.status(500)
 }
  }

  export const deleteSeenMovie = async (req, res) => {
    if(!res.isLoggedIn){
      return res.status(403).send("Du skal logge ind for at udføre denne handling")
    }
    const username = res.username
    const movieId = req.params.movieId

    const result = await seenMovies.deleteOne({userName: username, movieId: movieId})
    if(result.acknowledged === true){
      return res.status(200).json({message: "Filmen er nu slettet fra din Set-liste"})
    }
    else {
      res.status(409).json({message: "Der opstod en fejl"})
  }
}
  

  

