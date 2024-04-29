const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistSongActivities {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivities(playlistId, {
    songId, credentialId, action, time,
  }) {
    const id = `action-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, credentialId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
        FROM playlist_song_activities
        LEFT JOIN users ON users.id = playlist_song_activities.user_id
        LEFT JOIN songs ON songs.id = playlist_song_activities.song_id WHERE playlist_song_activities.playlist_id = $1
        ORDER BY playlist_song_activities.action`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlistId, activities: result.rows,
    };
  }
}

module.exports = PlaylistSongActivities;
