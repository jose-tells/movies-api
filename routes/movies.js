const express = require('express');
// const slash = require('express-slash');
const MoviesService = require('../services/movies');
const passport = require('passport');
const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time')

const {
  movieIdScheme,
  createMovieScheme,
  updateMovieScheme
} = require('../utils/schemes/movies')

//JWT Strategy
require('../utils/auth/strategies/jwt');

// Middlewares
const validationHandler = require('../utils/middlewares/validationHandler')
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');


function moviesApi(app) {
  const router = express.Router();

  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  router.get('/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['read:movies']),
    async (req, res, next) => {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags } = req.query;

      try {
        const movies = await moviesService.getMovies({ tags })
        res.status(200).json({
          data: movies,
          message: 'movies listed'
        })
      } catch (err) {
        next(err)
      }
  });

  router.get('/:movieId', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['read:movies']), 
    validationHandler({ movieId: movieIdScheme }, 'params'),
    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)

      const { movieId } = req.params
      try {
        const movies = await moviesService.getMovie({ movieId })
        res.status(200).json({
          data: movies,
          message: 'movie retrieved'
        })
      } catch (err) {
        next(err)
      }
  });

  router.post('/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['create:movies']), 
    validationHandler(createMovieScheme), 
    async (req, res, next) => {
      const { body: movie } = req;

      try {
        const createdMovieId = await moviesService.createMovie({ movie })
        res.status(201).json({
          data: createdMovieId,
          message: 'movie created'
        })
      } catch (err) {
        next(err)
      }
  });

  router.put('/:movieId', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['update:movies']), 
    validationHandler({ movieId: movieIdScheme }, 'params'), 
    validationHandler(updateMovieScheme), 
    async (req, res, next) => {
      const { movieId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMovieId = await moviesService.updateMovie({ movieId, movie })
        res.status(200).json({
          data: updatedMovieId,
          message: 'movie updated'
        })
      } catch (err) {
        next(err)
      }
  });

  router.delete('/:movieId', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['delete:movies']), 
    validationHandler({ movieId: movieIdScheme }, 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;
      try {
        const deletedMovieId = await moviesService.deleteMovie({ movieId })
        res.status(200).json({
          data: deletedMovieId,
          message: 'movie deleted'
        })
      } catch (err) {
        next(err)
      }
  });

};

module.exports = moviesApi;