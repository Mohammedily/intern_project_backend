const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");


dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("mongodb connected"))
.catch((error) => console.log(error));

app.use(express.json());
app.use(cors());

// routes

app.use(userRouter)

const PORT = process.env.PORT;

app.listen(PORT, () => {
console.log("PORT CONNECTED...");
})