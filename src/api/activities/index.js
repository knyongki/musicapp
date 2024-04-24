const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongActivities',
  version: '1.0.0',
  register: async (server, { playlistService, activitiesService }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      playlistService,
      activitiesService,
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};
