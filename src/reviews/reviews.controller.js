const service = require("./reviews.service.js");

// Helper fxns ----------------------------------------------------------------

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Validation fxns ------------------------------------------------------------

async function reviewExists(req, res, next) {
  const { review_id } = req.params;
  const foundReview = await service.read(review_id);

  if (foundReview.length > 0) {
    res.locals.review = foundReview[0];
    next();
  } else {
    next({status: 404, message: `Review cannot be found. ID: ${ review_id }` });
  }
}

// Route Handler fxns ---------------------------------------------------------

// GET /reviews
async function list(req, res) {
  let reviews
  if (req.params.movie_id) { // query is everything after the "?"
    reviews = await service.listSpecific(req.params.movie_id);
  } else {
    reviews = await service.listAll();
  }
  res.json({ data: reviews });
}

// GET /reviews/:review_id
// params are variables as part of the url path
async function read(req, res) {
  res.json({ data: res.locals.review });
}

// DELETE /reviews/:review_id
async function destroy(req, res) {
  await service.destroy(req.params.review_id);
  res.sendStatus(204);
}

// PUT /reviews/:review_id
async function update(req, res) {
  res.status(201).json({ data: await service.update(req.body.data, res.locals.review.review_id) })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [reviewExists, asyncErrorBoundary(read)],
  reviewExists,
  delete: [reviewExists, asyncErrorBoundary(destroy)],
  update: [reviewExists, asyncErrorBoundary(update)]
};
