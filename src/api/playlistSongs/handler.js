class PlaylistSongsHandler {
  constructor(service, playlistService, activitiesService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    this.deleteSongInPlaylistHandler = this.deleteSongInPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const SongInPlaylistId = await this._service.addSongToPlaylist({ id, songId });

    const action = 'add';
    const time = new Date().toISOString();
    await this._activitiesService.addPlaylistSongActivities(id, {
      songId, credentialId, action, time,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam Playlist',
      data: {
        SongInPlaylistId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._service.getSongsInPlaylist(id);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongInPlaylistHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongsInPlaylist(songId);

    const action = 'delete';
    const time = new Date().toISOString();
    await this._activitiesService.addPlaylistSongActivities(id, {
      songId, credentialId, action, time,
    });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
