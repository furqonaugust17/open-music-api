const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    service,
    songsService,
    playlistActivitiesService,
    validatorPlaylists,
    validatorPlaylistSong,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      service,
      songsService,
      playlistActivitiesService,
      validatorPlaylists,
      validatorPlaylistSong,
    );
    server.route(routes(playlistsHandler));
  },
};
