const credentials = require('./credentials');

let SpotifyWebApi = require('spotify-web-api-node');

let clientId = credentials.client_id,
    clientSecret = credentials.client_secret;

// Create the api object with the credentials
let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});


function getGenres() {
    // Retrieve an access token.
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            spotifyApi.getAvailableGenreSeeds()
                .then(function (data) {
                    let genreSeeds = data.body;
                    console.log(genreSeeds);
                    passGenres(genreSeeds);
                }, function (err) {
                    console.log('Something went wrong!', err);
                });

        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
}

function passGenres(data) {
    return data;
}




module.exports = getGenres;
module.exports = passGenres;