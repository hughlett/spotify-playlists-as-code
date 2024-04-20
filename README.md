# Spotify Playlists as Code (SPaC)

## Usage

### Login

```sh
docker compose run -v $(pwd)/tokens:/tokens -p 5173:5173 --rm spac login
```

### Healthcheck

```sh
docker compose run -v $(pwd)/tokens:/tokens --rm spac whoami
```

### Process managed playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac managedPlaylists
```

### Process dangling tracks

```sh
docker compose run -v $(pwd)/tokens:/tokens --rm spac danglingTracks
```
