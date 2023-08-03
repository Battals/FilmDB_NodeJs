import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = path.join(__dirname, '../public'); // Define the public directory path

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export const register = (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);
  db.query(
    "SELECT email from users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length > 0) {
          const filePath = path.join(publicDir, 'frontPage.html'); // Use publicDir variable
          return res.sendFile(filePath, {
            message: "The email is already in use",
          });
        }
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword)

      db.query(
        "INSERT INTO users SET ?",
        { username: username, password: hashedPassword, email: email },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            const filePath = path.join(publicDir, 'frontPage.html');
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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).sendFile(publicDir + "/login.html", {
        message: "Please Provide an email and password",
      });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          const errorMessage = "Invalid email or password";

          return res.status(401).json({ error: errorMessage });
        } else {
          const id = results[0].id;

          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("the token is " + token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("userSave", token, cookieOptions);
          res.sendFile(filePath, { email });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
