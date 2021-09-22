const assert = require('assert');
const proxyquire = require('proxyquire')

const { MoviesServicesMock } = require('../utils/mocks/movies.js');
const {moviesMocks} = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');


describe('routes - movies', function(){
  const route = proxyquire('../routes/movies', {
    '../services/movies': MoviesServicesMock
  });

  const request = testServer(route);

  describe('GET /movies', function() {
    it('should response with status 200', function(done){
      request.get('/api/movies').expect(200, done)
    })

    it('should respond with the list of movies', function(done){
      request.get('/api/movies').end((err, res) => {
        assert.deepStrictEqual(res.body, {
          data: moviesMocks, 
          message: 'movies listed'
        });
        
        done();
      })
    })
  })
})
