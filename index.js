require("dotenv").config();
const express = require("express");
const Razorpay = require('razorpay')
const app = express();

// middlewares
app.use(express.static("./public"));
app.use(express.json());

// routes
app.post("/order", async (req, res) => {
  const amount = req.body.amount;

  const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt#1",
  };

  const myOrder = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    amount: amount,
    order: myOrder,
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000...");
});
