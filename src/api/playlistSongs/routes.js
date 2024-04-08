const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsInPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongInPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
