const joi = require('joi');

const { movieIdScheme } = require('./movies');
const { userIdSchema } = require('./users');

const userMovieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserMovieSchema = {
  userId: userIdSchema.required(),
  movieId: movieIdScheme.required(),
};

module.exports = {
  userMovieIdSchema,
  createUserMovieSchema
}
