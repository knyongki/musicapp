const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: (server, {
    service, playlistService, activitiesService, validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      service,
      playlistService,
      activitiesService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
