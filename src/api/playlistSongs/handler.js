class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    this.deleteSongInPlaylistHandler = this.deleteSongInPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;

    const SongInPlaylistId = await this._service.addSongToPlaylist({ id, songId });

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
    const { songId } = request.payload;

    await this._service.deleteSongsInPlaylist(songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
