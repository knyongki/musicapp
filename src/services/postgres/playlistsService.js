const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `
        SELECT p.id AS id, p.name AS name, u.username AS username
        FROM playlists AS p
        LEFT JOIN users AS u ON p.owner = u.id
        LEFT JOIN collaborations AS c ON c.playlist_id = p.id
        WHERE p.owner = $1 OR c.user_id = $1
      `,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getPlaylistById(id) {
    const queryPlaylist = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(queryPlaylist);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    const querySongsInPlaylist = {
      text: 'SELECT song_id FROM playlist_songs WHERE playlist_id = $1',
      values: [playlist.id],
    };

    const song = await this._pool.query(querySongsInPlaylist);

    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [song.rows[0].song_id],
    };

    const songResult = await this._pool.query(querySongs);

    playlist.songs = songResult.rows;

    return playlist;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Gagal menghapus playlists, Id tidak ditemukan');
      }
    } catch (error) {
      console.error('Error saat menghapus playlist:', error);
      throw error; // Melempar error agar dapat ditangkap oleh pengguna fungsi ini
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = PlaylistsService;
