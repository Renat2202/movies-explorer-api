const router = require('express').Router();

const { validateMovieCreation, validateMovieId } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieCreation, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
