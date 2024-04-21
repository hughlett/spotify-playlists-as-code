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

### Follow SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac spac
```

### Unfollow SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac teardown
```

## [Resources](./docs/RESOURCES.md)
