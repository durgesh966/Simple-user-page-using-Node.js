const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require('express-session');

require("dotenv").config({ path: "./config.env" });
const db = require("./db/connection");
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(bodyparser.json());
app.use(session({
    secret: "Durgesh",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

app.listen(port, () => {
    console.log(`Setver listening on port: ${port}`);
});