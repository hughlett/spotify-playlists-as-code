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

### Follow all SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac spac
```

### Unfollow all SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac teardown
```

## [Resources](./docs/RESOURCES.md)
