const express = require("express");
const cors = require("cors");
require("dotenv").config();

const referralRoutes = require("./src/routes/referralRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", referralRoutes);

module.exports = app;
