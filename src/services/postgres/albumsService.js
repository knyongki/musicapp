const { Pool } = require('pg');
const { nanoid } = require('nanoid');
// const { mapDBToModel } = require('../../utils/albums');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, null],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = result.rows[0];

    const querySong = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [album.id],
    };

    const songResult = await this._pool.query(querySong);

    // Menambahkan data lagu ke album
    album.songs = songResult.rows;

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album, Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus albums, Id tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, path) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [path, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  async addLikeAlbum(albumId, credentialId) {
    const albumLikes = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, credentialId],
    };

    const like = await this._pool.query(albumLikes);

    if (like.rows.length) {
      throw new InvariantError('Album sudah disukai');
    }

    const id = `albumLikes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, credentialId],
    };

    await this._pool.query(query);
  }

  async deleteLikeAlbum(albumId, credentialId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus Likes, Album belum disukai');
    }
  }

  async getLikesAlbum(id) {
    const query = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1',
      values: [id],
    };

    const likes = await this._pool.query(query);

    return likes.rowCount;
  }
}

module.exports = AlbumsService;
