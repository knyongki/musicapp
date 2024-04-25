/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notnull: true,
      references: 'playlists',
      onDelete: 'CASCADE',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notnull: true,
      references: 'songs',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notnull: true,
      references: 'users',
    },
    action: {
      type: 'VARCHAR(50)',
      notnull: true,
    },
    time: {
      type: 'TEXT',
      notnull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
