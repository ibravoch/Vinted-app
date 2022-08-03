require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost:27017/vinted-app");

mongoose.connect(process.env.MONGODB_URI);

const usersRoutes = require("./routes/users");
app.use(usersRoutes);

const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

app.all("*", (req, res) => {
  res.json({ message: "cette route n'existe pas" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
