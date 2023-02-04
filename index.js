const path = require('path');

const express = require('express');
const { json } = require('express');

const axios = require('axios');
const cors = require('cors');

const app = express();
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

const credentials = require('./credentials');

let SpotifyWebApi = require('spotify-web-api-node');
let clientId = credentials.spotify.client_id;
let clientSecret = credentials.spotify.client_secret;
// Create the api object with the credentials
let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

app.get('/genres', (req, res) => {
    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.getAvailableGenreSeeds()
                .then(function (data) {
                    let genreSeeds = data.body;
                    // console.log(genreSeeds);
                    res.json(genreSeeds);
                }, function (err) {
                    console.log('Something went wrong!', err);
                });

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});

app.get('/moodMusic/:mood/:genres?', (req, res) => {
    let { mood, genres } = req.params;

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.searchPlaylists(`${mood} ${genres ? genres : 'pop'}`).then(function (data) {
                console.log('Found playlists are', data.body);
                res.json(data);
            }, function (err) {
                console.log('Something went wrong!', err);
            });

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});

app.get('/activityMusic/:activity/:genres?', (req, res) => {
    let { activity, genres } = req.params;

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.searchPlaylists(`${activity} ${genres ? genres : 'pop'}`).then(function (data) {
                console.log('Found playlists are', data.body);
                res.json(data);
            }, function (err) {
                console.log('Something went wrong!', err);
            });

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});

app.get('/timeMusic/:time/:genres?', (req, res) => {
    let { time, genres } = req.params;

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.searchPlaylists(`${time} ${genres ? genres : 'pop'}`).then(function (data) {
                console.log('Found playlists are', data.body);
                res.json(data);
            }, function (err) {
                console.log('Something went wrong!', err);
            });

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});

app.get('/weather/:latitude/:longitude', (req, res) => {
    let { latitude, longitude } = req.params
    axios({
        method: 'get',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${credentials.openWeather.api_key}`,
        responseType: 'json'
    }).then(function (response) {
        let data = response.data;
        res.json(data.weather[0].main);
    });
});

app.get('/weatherMusic/:weather/:genres?', (req, res) => {
    let { weather, genres } = req.params;

    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.searchPlaylists(`${weather} ${genres ? genres : 'pop'}`).then(function (data) {
                console.log('Found playlists are', data.body);
                res.json(data);
            }, function (err) {
                console.log('Something went wrong!', err);
            });

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));