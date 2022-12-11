const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const router = require("./routes");
const paypal = require('paypal-rest-sdk');
require('dotenv').config();


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3002"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Set public path
app.use(express.static(path.join(__dirname, "public")));
// view engine setup
app.set("views", path.join(__dirname, "resources", "views"));
app.set("view engine", "ejs");

paypal.configure({
  'mode': 'sandbox',
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET,
});

app.use(logger("dev"));

// Router
router(app);

module.exports = app;
