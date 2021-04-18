const service = require("./movies.service.js");

// Helper fxns ----------------------------------------------------------------

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Validation fxns ------------------------------------------------------------

async function movieExists(req, res, next) {
  const { movie_id } = req.params;
  const foundMovie = await service.read(movie_id);

  if (foundMovie.length > 0) {
    res.locals.movie = foundMovie[0];
    next();
  } else {
    next({status: 404, message: `No movie found with id: ${movie_id}`});
  }
}

// Make sure that any id passed in via the url params is a valid number
function idIsValid(req, res, next) {
  const { movie_id } = req.params;

  if (isNaN( +movie_id )) {
    next({
      status: 400,
      message: `Movie ID must be a number. Received: ${movie_id}`
    });
  } else {
    next();
  }
}

// Route Handler fxns ---------------------------------------------------------

// GET /movies
async function list(req, res) {
  let movies;
  if (req.query.is_showing) { // query is everything after the "?"
    movies = await service.listShowing();
  } else {
    movies = await service.listAll();
  }
  res.json({ data: movies });
}

// GET /movies/:movie_id
// params are variables as part of the url path
async function read(req, res) {
  res.json({ data: res.locals.movie });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [idIsValid ,movieExists, asyncErrorBoundary(read)],
  movieExists
};
