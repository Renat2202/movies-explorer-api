const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');

const { errorMessages } = require('../constants/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(errorMessages.movieCreateValidationError));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError(errorMessages.movieIdNotFoundError);
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(errorMessages.movieDeleteRightsError);
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((deletedMovie) => {
            res.status(200).send(deletedMovie);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(errorMessages.notValidIdError));
        return;
      }
      next(err);
    });
};
