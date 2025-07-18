class PlaylistsHandler{
    constructor(service, validator){
        this.service = service;
        this.validator = validator;
    }

    async postPlaylistHandler(request, h){
        this.validator.PlaylistsValidator(request.payload);
        const {name} = request.payload;

        const playlistId = await this.service.addPlaylist({name});

        const response = h.response({
            status: 'success',
            data: {
                playlistId
            }
        });

        response.code(201);
        return response;
    }

    async getPlaylistHandler(){
        const playlists = await this.service.getPlaylist();
        return {
            status: 'success',
            data:{
                playlists
            }
        };
    }
}

module.exports = PlaylistsHandler;