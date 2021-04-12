# Brief

## global config cache

- mac:
  - `~/.zprc`: global common config
  - `~/.user.zprc`: global custom config

## process exit code

- `1000`: project name exists
- `2000`: lack of configs
  - `2001`: lack of module config
- `3000`: i/o error
  - `3001`: cmd git error
  - `3002`: cmd npm error
