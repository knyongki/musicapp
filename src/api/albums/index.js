const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumsHandelr = new AlbumsHandler(service);
    server.route(routes(albumsHandelr));
  },
};
