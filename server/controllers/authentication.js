import { fileURLToPath } from "url";
import { dirname } from "path";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import createDbConnection from "../db/dbConnection.js";

const __dirname = fileURLToPath(
  "file:///C:/Users/Battal/Desktop/MovieDB/Node_r2-1"
);
const publicDir = path.join(__dirname, "server/views");

const db = createDbConnection();
export const register = (req, res) => {
  const { username, password, email } = req.body;
  db.query(
    "SELECT email from users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length > 0) {
          const filePath = path.join(publicDir, "myProfile.ejs");
          return res.sendFile(filePath, {
            message: "The email is already in use",
          });
        }
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users SET ?",
        { username: username, password: hashedPassword, email: email },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            //const filePath = path.join(publicDir, "myProfile");
            res.redirect("/myProfile");
            //return res.redirect("/myProfile")
          }
          db.end((err) => {
            if (err) {
              console.log("Error closing the database connection:", err);
            }
          });
        }
      );
    }
  );
};

export const login = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users where username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length === 0) {
        return res
          .status(400)
          .json({ error: "Ugyldig adgangskode eller brugernavn" });
      }

      const user = results[0];

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ error: "Ugyldig adgangskode" });
      } else if (isPasswordMatch) {
        const token = jwt.sign({ userId: user.ID }, process.env.SECRET_KEY);
        
        res.cookie("userName", username, {
          expires: new Date(Date.now() + 24 + 3600000),
          httpOnly: true
        })
        
        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 3600000),
          httpOnly: true,
        });

        

        return res.status(200).json({
          message: "Login success",
          userId: user.ID,
          userName: user.username,
          token: token,
        });

      }
      db.end((err) => {
        if (err) {
          console.log("Error closing the database connection:", err);
        }
      });
    }
  );
};

export const signOut = (req, res) => {
  res.clearCookie('token')
  res.redirect("/?loggedOut=true");
}



