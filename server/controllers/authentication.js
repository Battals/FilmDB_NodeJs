import { fileURLToPath } from "url";
import { dirname } from "path";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";


const __dirname = fileURLToPath("file:///C:/Users/Battal/Desktop/Node_r2");
const publicDir = path.join(__dirname, "client");


const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

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
          const filePath = path.join(publicDir, "frontPage.html");
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
            const filePath = path.join(publicDir, "frontPage.html");
            return res.sendFile(filePath, {
              message: "User registered",
            });
          }
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
        return res.status(400).json({ error: "Ugyldig adgangskode eller brugernavn" });}

      const user = results[0];
      

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ error: "Ugyldig adgangskode eller brugernavn" });}
      
      else if (isPasswordMatch) {
        const token = jwt.sign({ userId: user.ID }, process.env.SECRET_KEY); 
        const filePath = path.join(publicDir, "frontpage.html");
        console.log(user.ID)
        return res.sendFile(filePath, {
          message: "Login success",
          token: token,
        });
      }
    }
  );
};



