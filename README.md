# Spotify Playlists as Code (SPaC)

## Usage

### Login

```sh
docker compose run -v $(pwd)/tokens:/tokens -p 5173:5173 --rm spac login
```

### Healthcheck

```sh
docker compose run -v $(pwd)/tokens:/tokens --rm spac healthcheck
```

### Follow SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac follow
```

### Unfollow SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac unfollow
```

## [Resources](./docs/RESOURCES.md)
