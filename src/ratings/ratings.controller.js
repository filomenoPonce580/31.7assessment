const path = require("path");
const ratings = require(path.resolve("src/data/ratings-data"));


function list(req, res) {
  res.json({ data: res.locals.ratings });
}


function filterByNoteId(request, response, next) {
  const { noteId } = request.params;
  const byNodeId = noteId 
    ? (rating) => rating.noteId === Number(noteId) 
    : () => true ;
  response.locals.ratings = ratings.filter(byNodeId);
  next();
}

function ratingExists(request, response, next) {
  const ratingId = Number(request.params.ratingId);
  const foundRating = response.locals.ratings.find((rating) => rating.id === ratingId);
  if (foundRating) {
    response.locals.rating = foundRating;
    return next();
  }
  next({
    status: 404,
    message: `Rating id not found: ${request.params.ratingId}`,
  });
};

function read(req, res, next) {
  res.json({ data: res.locals.rating });
};

module.exports = {
  list: [filterByNoteId, list],
  read: [filterByNoteId, ratingExists, read],
};