const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getPlaylistActivitiesHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
