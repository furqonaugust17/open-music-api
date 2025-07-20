class PlaylistsHandler {
  constructor(service, songsService, validatorPlaylists, validatorPlaylistSong) {
    this.service = service;
    this.validatorPlaylists = validatorPlaylists;
    this.validatorPlaylistSong = validatorPlaylistSong;
    this.songsService = songsService;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this.validatorPlaylists.validatePlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { userId: owner } = request.auth.credentials;

    const playlistId = await this.service.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { userId: credentialId } = request.auth.credentials;
    const playlists = await this.service.getPlaylist(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { userId: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(id, credentialId);
    await this.service.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this.validatorPlaylistSong.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    await this.service.getPlaylistById(playlistId);
    await this.songsService.getSongById(songId);
    await this.service.verifyPlaylistOwner(playlistId, userId);
    await this.service.addPlaylistSongs({ playlistId, songId });
    const response = h.response({
      status: 'success',
      message: 'Playlist Song berhasil ditambahkan',
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(id, userId);
    const playlist = await this.service.getPlaylistById(id);
    const songs = await this.service.getPlaylistSongsById(id);
    Object.assign(playlist, { songs });
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this.validatorPlaylistSong.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(playlistId, userId);
    await this.service.deletePlaylistSongById({ playlistId, songId });
    return {
      status: 'success',
      message: 'Playlist Song berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
