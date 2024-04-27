const fs = require('fs');
const { Pool } = require('pg');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileSteam = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileSteam.on('error', (error) => reject(error));
      file.pipe(fileSteam);
      file.on('end', () => resolve(filename));
    });
  }

  async updatePlaylistCover(playlistId, coverUrl) {
    const query = {
      text: 'UPDATE playlists SET coverUrl = $1 WHERE id = $2',
      values: [coverUrl, playlistId],
    };

    await this._pool.query(query);
  }
}

module.exports = StorageService;
