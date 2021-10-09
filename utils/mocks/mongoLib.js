const sinon = require('sinon');

const { moviesMocks, filteredMoviesMocks } = require('./movies');

const getAllStub = sinon.stub();
getAllStub.withArgs('menu').resolves(moviesMocks);

const tagQuery = { tags: { $in: ['Drama'] } }
getAllStub.withArgs('menu', tagQuery).resolves(filteredMoviesMocks('Drama'));

const createStub = sinon.stub().resolves(moviesMocks[0].id);

class MongoLibMock{
  getAll(collection, query){
    return getAllStub(collection, query)
  }

  create(collection, data){
    return createStub(collection, data)
  }
}

module.exports = {
  getAllStub,
  createStub,
  MongoLibMock
}