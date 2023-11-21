import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "../db/dbConnection.js";
import { usersCollection } from "../db/dbCollections.js";

export const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.isLoggedIn = false;
    } else {
      res.isLoggedIn = true;
      res.username = decoded.userName;
    }
    next();
  });
};

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  const existingMail = await usersCollection.findOne({ email: email });
  const existingUsername = await usersCollection.findOne({
    username: username,
  });
  if (existingMail || existingUsername) {
    return res
      .status(409)
      .json({
        message:
          "En bruger med denne e-mailadresse eller brugernavn eksisterer allerede",
      });
  } else {
    const hashedPassword = await bcrypt.hash(password, 8);
    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      email,
    });

    const user = await usersCollection.findOne({ username: username });
    const token = jwt.sign({ userName: username }, process.env.SECRET_KEY);
    res.cookie("token", token, {
      expires: 0,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Register sucess",
      userId: user._id,
      username: username,
      token: token,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username: username });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Ugyldig adgangskode eller brugernavn" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ error: "Ugyldig adgangskode" });
  }

  const token = jwt.sign({ userName: username }, process.env.SECRET_KEY);

  res.cookie("token", token, {
    expires: 0,
    httpOnly: true,
  });

  return res.status(200).json({
    message: "Login success",
    userName: user.username,
    token: token,
  });
};

export const signOut = (req, res) => {
  res.clearCookie("token");
  res.redirect("/?loggedOut=true");
};
