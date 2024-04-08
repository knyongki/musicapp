const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({ id, songId }) {
    await this.verifySongs(songId);

    const idPlaylistSongs = `playlistSongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [idPlaylistSongs, id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylist(id) {
    const queryPlaylist = {
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON playlists.owner = users.id
        WHERE playlists.id = $1
      `,
      values: [id],
    };

    const playlistData = await this._pool.query(queryPlaylist);

    if (!playlistData.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const querySongs = {
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM playlist_songs
        JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [id],
    };

    const songsResult = await this._pool.query(querySongs);

    const songsData = songsResult.rows;

    const formattedSongs = songsData.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    const responseData = {
      id: playlistData.rows[0].id,
      name: playlistData.rows[0].name,
      username: playlistData.rows[0].username,
      songs: formattedSongs,
    };

    return responseData;
  }

  async deleteSongsInPlaylist(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist, Id tidak ditemukan');
    }
  }

  async verifySongs(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = PlaylistSongsService;
