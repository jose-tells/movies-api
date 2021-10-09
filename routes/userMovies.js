const express = require('express');

const UserMoviesService = require('../services/userMovies');
const passport = require('passport');

const { movieIdScheme } = require('../utils/schemes/movies');
const { userIdSchema } = require('../utils/schemes/users');
const { createUserMovieSchema } = require('../utils/schemes/userMovies');

// Middleware
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler');
const validationHandler = require('../utils/middlewares/validationHandler');

//JWT Strategy
require('../utils/auth/strategies/jwt');

function userMoviesApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesService();

  router.get('/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:user-movies']),
    validationHandler({ userId: userIdSchema }, 'query'),
    async function (req, res, next) {
      const { userId } = req.query;

      try {
        const userMovies = await userMoviesService.getUserMovies({ userId });

        res.status(200).json({
          data: userMovies,
          message: 'User movies listed'
        })
      } catch (error) {
        next(error)
      }
    }
  );

  router.post('/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:user-movies']),
    validationHandler(createUserMovieSchema),
    async function(req, res, next){
      const { body: userMovie } = req;

      try {
        const createdUserMovie = await userMoviesService.createUserMovie({ userMovie });

        res.status(201).json({
          data: createdUserMovie,
          message: 'user movie created'
        })
      } catch (err) {
        next(err)
      }
  });

  router.delete('/:userMovieId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:user-movies']),
    validationHandler({ userMovieId: movieIdScheme }, 'params'), 
    async function(req, res, next) {
      const { userMovieId } = req.params;

      try {
        const deleteUserMovieId = await userMoviesService.deleteUserMovie({ userMovieId });

        res.status(200).json({
          data: deleteUserMovieId,
          message: 'User movie deleted'
        })
      } catch (err) {
        next(err)
      }
  })
};

module.exports = userMoviesApi;
