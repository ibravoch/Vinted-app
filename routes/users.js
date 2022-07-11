const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  const salt = uid2(16);
  const token = uid2(16);
  const hash = SHA256(req.body.password + salt).toString(encBase64);

  const isExisting = await User.findOne({ email: req.body.email });

  if (isExisting === null) {
    const newUser = new User({
      token: token,
      username: req.body.username,
      email: req.body.email,
      hash: hash,
      salt: salt,
    });
    await newUser.save();
    res.status(200).json("votre compte a bien été crée");
  } else {
    res.status(400).json("error");
  }
});

router.post("/user/login", async (req, res) => {
  const thisUser = await User.findOne({ email: req.body.email });

  const salt = thisUser.salt;
  const token = thisUser.token;
  const hash = thisUser.hash;
  const newHash = SHA256(req.body.password + salt).toString(encBase64);

  if (newHash === hash) {
    res.status(200).json("tu es connecté");
    console.log(hash);
    console.log(newHash);
  } else {
    res.status(400).json(error);
  }
});

module.exports = router;
