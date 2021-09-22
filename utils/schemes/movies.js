const joi = require('joi')

const movieIdScheme = joi.string().regex(/^[0-9a-fA-F{24}]$/);
const movieTitleScheme = joi.string().max(80);
const movieYearScheme = joi.number().min(1888).max(2077);
const movieCoverScheme = joi.string().uri();
const movieDescriptionScheme = joi.string().max(300);
const movieDurationScheme = joi.string().min(1).max(300);
const movieContentRatingScheme = joi.string().max(5);
const movieSourceScheme = joi.string().uri();
const movieTagsScheme = joi.array().items(joi.string().max(50))

const createMovieScheme = {
  title: movieTitleScheme.required(),
  year: movieYearScheme.required(),
  cover: movieCoverScheme.required(),
  description: movieDescriptionScheme.required(),
  duration: movieDurationScheme.required(),
  rating: movieContentRatingScheme.required(),
  source: movieSourceScheme.required(),
  tags: movieTagsScheme
};

const updateMovieScheme = {
  title: movieTitleScheme,
  year: movieYearScheme,
  cover: movieCoverScheme,
  description: movieDescriptionScheme,
  duration: movieDurationScheme,
  rating: movieContentRatingScheme,
  source: movieSourceScheme,
  tags: movieTagsScheme
};

module.exports = {
  movieIdScheme,
  createMovieScheme,
  updateMovieScheme
}