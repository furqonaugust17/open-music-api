const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivities {
  constructor() {
    this.pool = new Pool();
  }

  async addActivity({
    playlistId, songId, userId, action,
  }) {
    const id = `pas-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Activity gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivities({ playlistId }) {
    const query = {
      text: `SELECT D.username, C.title, A.action, A.time FROM playlist_song_activities A 
LEFT JOIN playlists B ON B.id = A.playlist_id 
LEFT JOIN songs C ON C.id = A.song_id 
LEFT JOIN users D ON D.id = A.user_id WHERE A.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivities;
