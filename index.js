const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');

const debug = require('debug')('app:server')

const { 
  logErrors, 
  errorHandler, 
  wrapErrors 
} = require('./utils/middlewares/errorHandlers')

const notFoundHandler = require('./utils/middlewares/notFoundHandler');

// body parser
app.use(express.json())

// Routes
moviesApi(app);

// 404 Handler
app.use(notFoundHandler);

// Error Handlers
app.use(logErrors);
app.use(wrapErrors)
app.use(errorHandler);

app.listen(config.port, function(){
  debug(`Listening http://localhost:${config.port}`)
});


