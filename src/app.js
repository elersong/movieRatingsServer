if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors");

const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

const criticsRouter = require("./critics/critics.router");
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theaterssRouter = require("./theaters/theaters.router");

// Initiate the express app and configure it to parse incoming JSON on requests
const app = express();
app.use(express.json());

// Enable cors for all routes in the app
app.use(cors());

// Connect middleware for the four resources
app.use("/critics", criticsRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theaterssRouter);

// Handle paths that are not predetermined
app.use(notFound);
app.use(errorHandler);

module.exports = app;
