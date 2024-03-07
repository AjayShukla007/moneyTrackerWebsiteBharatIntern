require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const connectToMongo = require("./db.js");
const Transaction = require("./model/Transactions.js");

const app = express();
const PORT = 3000;

connectToMongo();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/transactions", async (req, res) => {
  const { description, amount } = req.body;
  try {
    const newTransaction = new Transaction({ description, amount });
    await newTransaction.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


mongoose.connection.once("open", () => {
  console.log("connected to mongo db");
  // STARTING SERVER
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
});

mongoose.connection.on("error", err => {
  console.log(err);
});

