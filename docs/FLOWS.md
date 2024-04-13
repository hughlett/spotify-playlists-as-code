# Control flows

## Creating and updating a managed playlist

1. Get all of the user's liked songs.
2. Get all of the user's playlists.
3. For each playlist given as input...
4. If the playlist doesn't exist and there isn't a playlist with the same name owned by the user, create it.
5. Remove any unliked songs from the playlist.
6. Search for and add any liked songs that match the playlist criteria that aren't already present.

## Creating and updating a playlist of every liked song that isn't included in any of a user's playlists (Dangling tracks)

0. Create 'Dangling tracks' if it doesn't exist
1. Get all of the user's liked songs.
2. Get all of the user's playlists.
3. Get the tracks from each of the user's playlists.
4. For each liked song...
5. See if the liked song exists in the tracks from each of the user's playlists.
6. If yes, remove the track from 'Dangling tracks'. If no, add the track to 'Dangling tracks' if it isn't there already.
