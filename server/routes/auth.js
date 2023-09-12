import express from "express";
import multer from "multer";
import { register, login } from "../controllers/authentication.js";
import createDBConnection from '../db/dbConnection.js';
import path from 'path'

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const storage = multer.diskStorage({
  destination: 'client/assets/',
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  }
});

const upload = multer({ storage: storage });

router.post('/createMovie', upload.single('image'), (req, res) => {
  const { movie_name, release_year, description } = req.body;
  console.log(req.body);
  const imagePath = req.file.filename; 

  const db = createDBConnection();

  const sql = 'INSERT INTO movies (movie_name, release_year, image_path, description) VALUES (?, ?, ?, ?)';
  db.query(sql, [movie_name, release_year, imagePath, description], (err, result) => {
    if (err) {
      console.error('Error inserting movie:', err);
      res.status(500).send('Error inserting movie');
    } else {
      res.sendFile("frontPage.html", {root: 'client'})
    }
  });
});

export default router;
