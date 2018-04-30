<p align="center">
  <img src="./readme-img.jpg"/>
</p>

# Introduction

[Soundvision](http://www.spotifysoundvision.com) is a web-based visualization tool for exploring listening history and creating playlists. It creates a unique interactive timeline of saved music using D3 and the Spotify API. Users can brush over their history, select albums and tracks, and export playlists to Spotify.

## Usage

### Login
Login is handled using PassportJS for Spotify OAuth, creating a user and passing an access token to make requests from the Spotify Web API. Upon first-time login, the application makes requests to the Spotify Web API to retrieve the user's saved music. The interactive timeline renders once this process completes.
<p align="center">
  <img src="https://media.giphy.com/media/fWfFZrUgTF7hmQSxjV/giphy.gif" width="430" height="300" />
</p>

### Selection
The brush in the bottom visual is used to select the range for the top section. Each selectable node represents an album in the user's Spotify Library and the date which it was saved. The color of the node reflects the decade the album was released. On mouseover, a tooltip apears with basic album information. Clicking on a node adds the album with its tracks to a queue at the bottom of the page. You may deselect these elements by toggling nodes individually or pressing 'CLEAR SELECTIONS' button.
<p align="center">
  <img src="https://media.giphy.com/media/3JURBBW6DYNqCKtATg/giphy.gif" width="430" height="300"/>
</p>

### Creating a Playlist
After making album selections, users are free to choose individual tracks to add to the playlist queue. The user may export this playlist with a discriptive title (ex. "Summer 2013", "First month of college", etc) to Spotify by pressing the 'EXPORT PLAYLIST' button.
<p align="center">
  <img src="https://media.giphy.com/media/mWHiQX6RNae6Gqh1iY/giphy.gif" width="430" height="300"/>
</p>



## Built With

* [React](https://reactjs.org/) - Frontend
* [Passport.js](http://www.passportjs.org/) - Spotify OAuth
* [D3.js](https://github.com/d3/d3) - Interactive Timeline
* [Node](https://github.com/nodejs/node) - Backend
* [MongoDB](https://www.mongodb.com/) - Database
* [Spoitfy Web API](https://beta.developer.spotify.com/documentation/web-api/) - API

## Authors

* **Trevor Manz**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
