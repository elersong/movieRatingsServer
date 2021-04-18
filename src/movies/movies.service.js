const knex = require("../db/connection");

// return all movies in the table
function listAll() {
  return knex("movies")
    .select("*");
}

// return only movies that are currently showing
function listShowing() {
  return knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .select("movies.*")
    .where({ "is_showing": true})
    .groupBy("movies.movie_id");
}

// return only the movie with the specified id
function read(movie_id) {
  return knex("movies")
    .select("*")
    .where({ movie_id });
}

module.exports = {
  listAll,
  listShowing,
  read,
};
