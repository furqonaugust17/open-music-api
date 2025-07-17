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


    
}

module.exports = PlaylistsService;