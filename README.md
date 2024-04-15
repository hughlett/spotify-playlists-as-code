# spotify-playlists-as-code

## Usage

```sh
# Build the image
docker build . -t spac

# Run the image
docker run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data -p 5173:5173 --rm spac
```
