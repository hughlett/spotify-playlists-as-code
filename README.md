# Spotify Playlists as Code (SPaC)

## Usage

### [GitHub Actions](https://docs.github.com/en/actions) and [GitHub CLI](https://cli.github.com/manual/)

#### Healthcheck

```sh
gh workflow run "Healthcheck"
```

#### Follow SPaC playlists

```sh
gh workflow run "Follow SPaC playlists"
```

#### Unfollow SPaC playlists

```sh
gh workflow run "Unfollow SPaC playlists"
```

### Local with Docker

#### Login

```sh
docker compose run -v $(pwd)/tokens:/tokens -p 5173:5173 --rm spac login
```

#### Healthcheck

```sh
docker compose run -v $(pwd)/tokens:/tokens --rm spac healthcheck
```

#### Follow SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac follow
```

#### Unfollow SPaC playlists

```sh
docker compose run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data --rm spac unfollow
```

## [Resources](./docs/RESOURCES.md)
