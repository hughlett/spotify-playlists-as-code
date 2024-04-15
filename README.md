# spotify-playlists-as-code

## Build

```sh
# Build the image
docker build . -t spac

# Run the image
docker run -v $(pwd)/tokens:/tokens -p 5173:5173 --rm spac
```
