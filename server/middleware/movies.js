const API_KEY = process.env.API_KEY;

import {
  favouriteMoviesCollection,
  seenMoviesCollection,
} from "../db/dbCollections.js";

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
    const existingRecord = await favouriteMoviesCollection.findOne({
      userName,
      movieId,
    });
    if (existingRecord) {
      return res.status(409).json({
        message: "Du har allerede tilføjet denne film til favoritter",
      });
    }
    await favouriteMoviesCollection.insertOne({ userName, movieId });
    return res.status(200).json({ message: "Tilføjet til favorit" });
  }
};

export const seenMovie = async (req, res) => {
  if (!res.isLoggedIn) {
    return res
      .status(409)
      .json({ message: "Log venligst ind for at gemme denne film" });
  }
  const userName = res.username;
  const movieId = req.params.movieId;

  const existingRecord = await seenMoviesCollection.findOne({
    userName,
    movieId,
  });
  if (existingRecord) {
    return res
      .status(409)
      .json({ message: "Er i forvejen gemt i din Set-liste" });
  }

  await seenMoviesCollection.insertOne({ userName, movieId });
  return res.status(200).json({ message: "Gemt til din Set-liste" });
};

export const deleteMovie = async (req, res) => {
  if (!res.isLoggedIn) {
    return res
      .status(403)
      .send({ message: "Log venligst ind for at slette denne film" });
  }

  const username = res.username;
  const movieId = req.params.movieId;


  const result = await favouriteMoviesCollection.deleteOne({
    userName: username,
    movieId: movieId,
  });
  if (result.acknowledged == true) {
    return res
      .status(200)
      .json({ message: "Filmen er nu slettet fra din Favorit-liste" });
  } else {
    return res.status(500);
  }
};

export const deleteSeenMovie = async (req, res) => {
  if (!res.isLoggedIn) {
    return res
      .status(403)
      .send("Du skal logge ind for at udføre denne handling");
  }
  const username = res.username;
  const movieId = req.params.movieId;

  const result = await seenMoviesCollection.deleteOne({
    userName: username,
    movieId: movieId,
  });
  if (result.acknowledged === true) {
    return res
      .status(200)
      .json({ message: "Filmen er nu slettet fra din Set-liste" });
  } else {
    res.status(409).json({ message: "Der opstod en fejl" });
  }
};
