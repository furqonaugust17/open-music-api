const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistsService{
    constructor(){
        this.pool = new Pool();
    }

    async addPlaylist({name}){
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2) RETURNING id',
            values:[id, name]
        };

        const result = await this.pool.query(query);

        if (!result.rows[0].id) {
        throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylist(){
        const result = await this.pool.query('SELECT * FROM playlists');
        return result.rows;
    }

    async deletePlaylistById(id){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id]
        };

        const result = this.pool.query(query);

        if(!result.rows.length){
            throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }
    
    async addPlaylistSongs(id, {songId}){
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2) RETURNING id',
            values: [songId, id]
        };

        const result = this.pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist song gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylistSongsById(id){
        const query = {
            text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
            values: [id]
        };
        const result = await this.pool.query(query);
        return result.rows;
    }

    async deletePlaylistSongById(id, {songId}){
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND id = $2 RETURNING id',
            values: [id, songId]
        };

        const result = this.pool.query(query);

        if(!result.rows.length){
            throw new InvariantError('Playlist Song gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = PlaylistsService;