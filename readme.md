# erora.live
Over-engineered website for my musical alias.

[![Subscribe to the RSS Feed](.github/rss.png)](https://erora.live/api/rss)

### Philosophy
Stuff goes here about why I did this.

### API
For some reason, I put effort into an API.

### Setup
1. Ensure that [Bun](https://bun.sh) is installed.
2. `git clone` the repository and `bun install` dependencies.
3. Configure `.env` with your [Bandcamp cookie](https://github.com/patrickkfkan/bandcamp-fetch/wiki/How-to-obtain-Cookie) and [Spotify credentials](https://developer.spotify.com/documentation/web-api/tutorials/getting-started).

> [!TIP]
> By copying `.env` to `.env.local`, your secrets are safe from git!

### Building
1. `bun run assets` to download audio and cover art
2. `bun run build:static` to update `/static/releases/`
3. `bun run build` to do both!
