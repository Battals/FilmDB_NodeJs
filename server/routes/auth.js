import express from "express";
import multer from "multer";
import { register, login } from "../controllers/authentication.js";
import createDBConnection from '../db/dbConnection.js';

const upload = multer();
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/createMovie", upload.single("image"), (req, res) => {
  const { movie_name, release_year } = req.body;
  const imageBuffer = req.file.buffer;

  const db = createDBConnection()

  const sql = 'INSERT INTO movies (movie_name, release_year, movie_image) VALUES (?, ?, ?)';
  db.query(sql, [movie_name, release_year, imageBuffer], (err, result) => {
    if (err) {
      console.error('Error inserting movie:', err);
      res.status(500).send('Error inserting movie');
    } else {
      res.send("Movie created successfully!");
    }
  });
});

export default router;
