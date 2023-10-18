import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";
import {client} from '../db/dbConnection2.js'

const __dirname = fileURLToPath(
  "file:///C:/Users/Battal/Desktop/MovieDB/Node_r2-1"
);
const publicDir = path.join(__dirname, "server/views");
const usersCollection = client.db("Cluster0").collection("users");

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  const existingMail = await usersCollection.findOne({ email: email });
  const existingUsername = await usersCollection.findOne({username: username})
  if (existingMail || existingUsername) {
   return res.status(409).json({message: 'En bruger med denne e-mailadresse eller brugernavn eksisterer allerede'})
  } else {
  const hashedPassword = await bcrypt.hash(password, 8);
  await usersCollection.insertOne({ username, password: hashedPassword, email });

  

  const user = await usersCollection.findOne({username: username})
  const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY)
  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 + 3600000),
    httpOnly: true
  })
  res.cookie("username", username, {
    expires: new Date(Date.now() + 24 + 3600000),
    httpOnly: true
  })
  return res.status(200).json({
    message: "Register sucess",
    userId: user._id,
    username: username,
    token: token
  })

}
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ error: "Ugyldig adgangskode eller brugernavn" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ error: "Ugyldig adgangskode" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

  res.cookie("username", username, {
    expires: new Date(Date.now() + 3 * 3600000),
    httpOnly: true,
  });

  res.cookie("token", token, {
    expires: new Date(Date.now() + 3 + 3600000),
    httpOnly: true,
  });

  return res.status(200).json({
    message: "Login success",
    userId: user._id,
    userName: user.username,
    token: token,
  });
};

export const signOut = (req, res) => {
  res.clearCookie('token')
  res.clearCookie('username')
  res.redirect("/?loggedOut=true");
}



