## Problems and Solutions

- I prefer to have dedicated playlists for genres, moods, etc. over shuffling through all of Liked Songs.
- Problem now becomes what is the easiest way to make a playlist from my collection of Liked Songs?
- (First step is to prune Liked Songs of music you don't listen to anymore)
- Scrolling through all of Liked Songs is the most thorough method but incredibly inefficient and mind numbing.
- Being able to see every artist that makes up Liked Songs would be a nice balance between efficiency and volume of search results. I have a pretty good understanding of what songs I have saved by a specific artist, and depending on the playlist can decide quickly (e.g. Skip The Beatles for a rap genre playlist.)
- Spotify shows a list of all liked songs for an artist on their page but:
  1.  You need to visit the artist's page. Not helpful for discovery because you could forget about an artist or song.
  2.  Doesn't include artist features.
  3.  Tedious.
- Can automate creation of playlists for a specific artist or group from Liked Songs.
- Needs to be some kind of cut-off for who to make a playlist for and not, don't want a playlist for an artist with only one liked song. (Cutoff for me ~5 songs).
- (Maybe have a playlist of every Liked Song that isn't a part of the user's playlist?)
- Manually curate and maintain a list of artists to have playlists for.
- Ok but how do I keep these automated playlists separate from my curated playlists? Ideally we could hide these automated playlists to a folder but [the Spotify web API doesn't provide an interface for folder management](https://developer.spotify.com/documentation/web-api/concepts/playlists#folders).
- Best I can do is make the curated playlists stand out from the automated playlists. Preface each curated playlist with an emoji and use all lowercase (could use all uppercase instead). Use a custom playlist image cover.
- Still have to scroll on smaller displays to find a certain playlist (I'm at 85 total playlists right now) but if I know the name of the playlist I'll just ask voice assistant to play it directly.
- Emojis and custom playlist image cover adds some personality as well as look nice on displays (CarPlay, TV, watchOS).
- Automated playlists should create/delete depending on the cut-off.
- Automated playlists should maintain themselves and add/remove songs as the songs are added/removed from Liked Songs.
- Edge case if artist changes name on Spotify then script will break.
- Future could generate themed playlist cover art.
