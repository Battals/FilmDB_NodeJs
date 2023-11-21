import { client } from "./dbConnection.js";

const usersCollection = client.db("FilmDB").collection("users");
const favouriteMoviesCollection = client.db("FilmDB").collection("savedMovies");
const seenMoviesCollection = client.db("FilmDB").collection("seenMovies");

export { usersCollection, favouriteMoviesCollection, seenMoviesCollection };
