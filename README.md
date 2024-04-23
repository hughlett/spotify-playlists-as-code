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
docker compose run spac login
```

#### Healthcheck

```sh
docker compose run spac healthcheck
```

#### Follow SPaC playlists

```sh
docker compose run spac follow
```

#### Unfollow SPaC playlists

```sh
docker compose run spac unfollow
```

## [Resources](./docs/RESOURCES.md)
