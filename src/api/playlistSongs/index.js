const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(service, validator);
    server.route(routes(playlistSongsHandler));
  },
};
