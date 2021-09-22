const boom = require('@hapi/boom')
const { config } = require('../../config')
const debug = require('debug')('app:server')

function withErrorStack(err, stack){
  if(config.dev) {
    return {...err, stack};
  }

  return err;
};

function logErrors(err, req, res, next){
  debug(err);
  next(err);
};

function wrapErrors(err, req, res, next){
  if(!err.isBoom){
    next(boom.badImplementation())
  }

  next(err);
}

function errorHandler(err, req, res, next){ // eslint-disable-line
  const { output: 
    {
      statusCode, 
      payload
    } 
  } = err;
  res.status(statusCode); // The status 500 is an error that the server throws by default.
  res.json(withErrorStack(payload, err.stack));
};

module.exports = {
  logErrors,
  errorHandler,
  wrapErrors
}