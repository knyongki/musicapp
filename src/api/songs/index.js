const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: (server, { service }) => {
    const songsHandler = new SongsHandler(service);
    server.route(routes(songsHandler));
  },
};
