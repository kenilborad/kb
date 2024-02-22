const getSignedPutUrl = require('./queries/get-signed-put-url')

const resolvers = {
  Query: {
    getSignedPutUrl
  },
  Mutation: {
  },
};

module.exports = resolvers;
