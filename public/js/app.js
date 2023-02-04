// User Data
let userGenres = JSON.parse(localStorage.getItem("userGenres"));
let userPreference = localStorage.getItem("userPreference");
let userLocation = JSON.parse(localStorage.getItem("allowLocation"));
let userLatitude = JSON.parse(localStorage.getItem("userLatitude"));
let userLongitude = JSON.parse(localStorage.getItem("userLongitude"));
let userHour = new Date().getHours();

const spotifyGenres = JSON.parse(localStorage.getItem("spotifyGenresStored"));
// Smaller Array For GET Method 
let searchGenres = [];

// Selecting 3 Random Genres For A New Smaller Array, If userGenres == 'any' || userGenres.length > 3
function selectGenres() {
    if (userGenres.indexOf('any') !== -1) {
        for (let i = 0; i < 3; i++) {
            // Getting a random item from userGenre array.
            genres = spotifyGenres[Math.floor(Math.random() * spotifyGenres.length)];
            searchGenres.push(genres);
        }
    } else if (userGenres.length > 3) {
        for (let i = 0; i < 3; i++) {
            genres = userGenres[Math.floor(Math.random() * userGenres.length)];
            searchGenres.push(genres);
        }
    } else {
        searchGenres = userGenres;
    }
}

// Playlist Storage Object
let playlistStorage = {
    mood: {},
    activity: {},
    time: {},
    weather: {}
};

// Check If The Returned Arrays Are Empty
function isEmpty(array, array2, array3) {
    if (array.length === 0 && array2.length === 0 && array3.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

// Displaying Music On Mood Change
const moodMenu = document.querySelector('#mood');
moodMenu.addEventListener('change', selectMood);

const moodHeader = document.querySelector('#mood-header');
const moodSpan = document.querySelector('#mood-span');
const moodImg = document.querySelector('#mood-img');
const moodResults = document.querySelector('#mood-result');
const moodPrompt = document.querySelector('#mood-prompt');

function selectMood(event) {
    event.preventDefault();
    mood = event.target.value;
    getMoodMusic(mood, searchGenres);
}

// GET Music
async function getMoodMusic(value, array) {
    let playlists = {};
    // Loop through genres to GET music for each genre
    for (let i = 0; i < array.length; i++) {
        const res = await fetch(`https://intune-production.up.railway.app/moodMusic/${value}/${array[i]}`, { method: 'GET' })
        const data = await res.json()
        playlists = data.body.playlists.items;
        playlistStorage.mood[array[i]] = { playlists: playlists };
    }
    updateMood(value, playlistStorage.mood);
}

// Alter Page/Display Response
function updateMood(value, object) {
    if (value == 'angry') {
        moodHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Anger');
        moodHeader.prepend(headerContent);

        moodSpan.innerText = '';
        let spanContent = document.createTextNode('Management');
        moodSpan.appendChild(spanContent);

        moodImg.src = 'images/angry.png';
        moodPrompt.style.display = 'none';

        // Clear Previous Result
        moodResults.innerText = '';
        displayMood(object);
    } else if (value == 'happy') {
        moodHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Good');
        moodHeader.prepend(headerContent);

        moodSpan.innerText = '';
        let spanContent = document.createTextNode('Times');
        moodSpan.appendChild(spanContent);

        moodImg.src = 'images/happy.png';
        moodPrompt.style.display = 'none';

        moodResults.innerText = '';
        displayMood(object);
    } else if (value == 'sad') {
        moodHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Sad');
        moodHeader.prepend(headerContent);

        moodSpan.innerText = '';
        let spanContent = document.createTextNode('Vibes');
        moodSpan.appendChild(spanContent);

        moodImg.src = 'images/sad.png';
        moodPrompt.style.display = 'none';

        moodResults.innerText = '';
        displayMood(object);
    }
}

function displayMood(object) {
    let gernre1Key = Object.keys(object)[0];
    let gernre2Key = Object.keys(object)[1];
    let gernre3Key = Object.keys(object)[2];

    // If User Only Has 1 or 2 Genres Picked
    if (gernre3Key == undefined && gernre2Key == undefined) {
        gernre3Key = gernre1Key;
        gernre2Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('mood', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }
        }

    } else if (gernre3Key == undefined) {
        gernre3Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('mood', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }
        }

    } else {
        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('mood', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('mood', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    moodResults.appendChild(div);
                }
            }
        }
    }

}

// Displaying Music On Activity Change
const activityMenu = document.querySelector('#activity');
activityMenu.addEventListener('change', selectActivity);

const activityHeader = document.querySelector('#activity-header');
const activitySpan = document.querySelector('#activity-span');
const activityResults = document.querySelector('#activity-result');
const activityPrompt = document.querySelector('#activity-prompt');

function selectActivity(event) {
    event.preventDefault();
    activity = event.target.value;
    getActivityMusic(activity, searchGenres);
}

// GET Music
async function getActivityMusic(value, array) {
    let playlists = {};
    // Loop through genres to GET music for each genre
    for (let i = 0; i < array.length; i++) {
        const res = await fetch(`https://intune-production.up.railway.app/activityMusic/${value}/${array[i]}`, { method: 'GET' })
        const data = await res.json()
        playlists = data.body.playlists.items;
        playlistStorage.activity[array[i]] = { playlists: playlists };
    }
    updateActivity(value, playlistStorage.activity);
}

// Alter Page/Display Response
function updateActivity(value, object) {
    if (value == 'dancing') {
        activityHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Dance');
        activityHeader.prepend(headerContent);

        activitySpan.innerText = '';
        let spanContent = document.createTextNode('Party');
        activitySpan.appendChild(spanContent);

        activityPrompt.style.display = 'none';

        // Clear Previous Result
        activityResults.innerText = '';
        displayActivity(object);
    } else if (value == 'exercising') {
        activityHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Workout');
        activityHeader.prepend(headerContent);

        activitySpan.innerText = '';
        let spanContent = document.createTextNode('Music');
        activitySpan.appendChild(spanContent);

        activityPrompt.style.display = 'none';

        activityResults.innerText = '';
        displayActivity(object);
    } else if (value == 'relaxing') {
        activityHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Chill');
        activityHeader.prepend(headerContent);

        activitySpan.innerText = '';
        let spanContent = document.createTextNode('Mode');
        activitySpan.appendChild(spanContent);

        activityPrompt.style.display = 'none';

        activityResults.innerText = '';
        displayActivity(object);
    } else if (value == 'studying') {
        activityHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Study');
        activityHeader.prepend(headerContent);

        activitySpan.innerText = '';
        let spanContent = document.createTextNode('Mix');
        activitySpan.appendChild(spanContent);

        activityPrompt.style.display = 'none';

        activityResults.innerText = '';
        displayActivity(object);
    } else if (value == 'working') {
        activityHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Jobsite');
        activityHeader.prepend(headerContent);

        activitySpan.innerText = '';
        let spanContent = document.createTextNode('Jams');
        activitySpan.appendChild(spanContent);

        activityPrompt.style.display = 'none';

        activityResults.innerText = '';
        displayActivity(object);
    }
}

function displayActivity(object) {
    let gernre1Key = Object.keys(object)[0];
    let gernre2Key = Object.keys(object)[1];
    let gernre3Key = Object.keys(object)[2];

    // If User Only Has 1 or 2 Genres Picked
    if (gernre3Key == undefined && gernre2Key == undefined) {
        gernre3Key = gernre1Key;
        gernre2Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('activity', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }
        }


    } else if (gernre3Key == undefined) {
        gernre3Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('activity', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }
        }

    } else {
        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('activity', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('activity', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    activityResults.appendChild(div);
                }
            }
        }
    }

}

// Display Music Based On Time Of Day
const timeHeader = document.querySelector('#time-header');
const timeSpan = document.querySelector('#time-span');
const timeImg = document.querySelector('#time-img');
const timeResults = document.querySelector('#time-result');
const timePrompt = document.createElement('p');

// Check Current Time
function checkTime() {
    if (userHour >= 4 && userHour <= 17) {
        let time = 'day time';
        getTimeMusic(time, searchGenres);
    }
    else {
        let time = 'night time'
        getTimeMusic(time, searchGenres);
    }
}

// Get Music
async function getTimeMusic(value, array) {
    let playlists = {}
    // Loop through genres to GET music for each genre
    for (let i = 0; i < array.length; i++) {
        const res = await fetch(`https://intune-production.up.railway.app/timeMusic/${value}/${array[i]}`, { method: 'GET' })
        const data = await res.json()
        playlists = data.body.playlists.items;
        playlistStorage.time[array[i]] = { playlists: playlists };
    }
    updateTime(value, playlistStorage.time);
}

// Alter Page/Display Response
function updateTime(value, object) {
    if (value == 'day time') {

        timeHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Day');
        timeHeader.prepend(headerContent);

        timeSpan.innerText = '';
        let spanContent = document.createTextNode('Jams');
        timeSpan.appendChild(spanContent);

        timeImg.src = 'images/sun.png';

        displayTime(object);
    }
    else {
        timeHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Night');
        timeHeader.prepend(headerContent);

        timeSpan.innerText = '';
        let spanContent = document.createTextNode('Mix');
        timeSpan.appendChild(spanContent);

        timeImg.src = 'images/moon.png';

        displayTime(object);
    }
}

function displayTime(object) {
    let gernre1Key = Object.keys(object)[0];
    let gernre2Key = Object.keys(object)[1];
    let gernre3Key = Object.keys(object)[2];

    // If User Only Has 1 or 2 Genres Picked
    if (gernre3Key == undefined && gernre2Key == undefined) {
        gernre3Key = gernre1Key;
        gernre2Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('time', 'your current conditions');
        } else {

            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

        }

    } else if (gernre3Key == undefined) {
        gernre3Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('time', 'your current conditions');
        } else {

            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

        }

    } else {
        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('time', 'your current conditions');
        } else {

            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('time', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    timeResults.appendChild(div);
                }
            }

        }
    }

}

// Display Music Based On Weather
const weatherHeader = document.querySelector('#weather-header');
const weatherSpan = document.querySelector('#weather-span');
const weatherImg = document.querySelector('#weather-img');
const weatherResults = document.querySelector('#weather-result');
const weatherPrompt = document.createElement('p');

// Check Permission For Location Access
function checkPermission() {
    if (userLocation == true) {
        getWeather();
    } else {
        weatherPrompt.classList.add('prompt');
        weatherPrompt.innerText = 'Please allow location access in order to get music recommendations based on weather.'
        weatherResults.appendChild(weatherPrompt);
    }
}

//GET Open Weather api With Latitude And Longitude Values
function getWeather() {
    fetch(`https://intune-production.up.railway.app/weather/${userLatitude}/${userLongitude}`)
        .then(res => res.json())
        .then(data => {
            getWeatherMusic(data, searchGenres);
        })
        .catch(err => console.log(err));
}

// GET Music
async function getWeatherMusic(value, array) {
    // Change api weather forecast into a more search friendly term for Spotify api
    let weather;
    if (value == 'Thunderstorm' || value == 'Drizzle' || value == 'Rain') {
        weather = 'rainy'

    } else if (value == 'Fog' || value == 'Mist' || value == 'Haze' || value == 'Clouds') {
        weather = 'cloudy'
    } else if (value == 'Snow') {
        weather = 'snowy'
    } else if (value == 'Clear') {
        weather = 'sunny'
    } else {
        weather = 'chill'
    }

    let playlists = {};
    // Loop through genres to GET music for each genre
    for (let i = 0; i < array.length; i++) {
        const res = await fetch(`https://intune-production.up.railway.app/weatherMusic/${weather}/${array[i]}`, { method: 'GET' })
        const data = await res.json()
        playlists = data.body.playlists.items;
        playlistStorage.weather[array[i]] = { playlists: playlists };
    }
    updateWeather(value, playlistStorage.weather);
}

// Alter Page/Display Response
function updateWeather(value, object) {
    if (value == 'Thunderstorm' || value == 'Drizzle' || value == 'Rain') {
        weatherHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Rainy');
        weatherHeader.prepend(headerContent);

        weatherSpan.innerText = '';
        let spanContent = document.createTextNode('Days');
        weatherSpan.appendChild(spanContent);

        weatherImg.src = 'images/rain.png';

        displayWeather(object);
    } else if (value == 'Fog' || value == 'Mist' || value == 'Haze' || value == 'Clouds') {
        weatherHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Calm');
        weatherHeader.prepend(headerContent);

        weatherSpan.innerText = '';
        let spanContent = document.createTextNode('Overcasts');
        weatherSpan.appendChild(spanContent);

        weatherImg.src = 'images/cloud.png';

        displayWeather(object);
    } else if (value == 'Snow') {
        weatherHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Cozy');
        weatherHeader.prepend(headerContent);

        weatherSpan.innerText = '';
        let spanContent = document.createTextNode('Vibes');
        weatherSpan.appendChild(spanContent);

        weatherImg.src = 'images/snow.png';

        displayWeather(object);
    } else if (value == 'Clear') {
        weatherHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('Sunny');
        weatherHeader.prepend(headerContent);

        weatherSpan.innerText = '';
        let spanContent = document.createTextNode('Skies');
        weatherSpan.appendChild(spanContent);

        weatherImg.src = 'images/sun.png';

        displayWeather(object);

    } else {
        weatherHeader.childNodes[0].nodeValue = '';
        let headerContent = document.createTextNode('In');
        weatherHeader.prepend(headerContent);

        weatherSpan.innerText = '';
        let spanContent = document.createTextNode('Season');
        weatherSpan.appendChild(spanContent);

        weatherImg.src = 'images/sun.png';

        displayWeather(object);
    }
}

function displayWeather(object) {
    let gernre1Key = Object.keys(object)[0];
    let gernre2Key = Object.keys(object)[1];
    let gernre3Key = Object.keys(object)[2];

    // If User Only Has 1 or 2 Genres Picked
    if (gernre3Key == undefined && gernre2Key == undefined) {
        gernre3Key = gernre1Key;
        gernre2Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('weather', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }
        }

    } else if (gernre3Key == undefined) {
        gernre3Key = gernre1Key;

        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('weather', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }
        }

    } else {
        let genre1Array = object[gernre1Key].playlists;
        let genre2Array = object[gernre2Key].playlists;
        let genre3Array = object[gernre3Key].playlists;

        let isObjectEmpty = isEmpty(genre1Array, genre2Array, genre3Array);
        if (isObjectEmpty == true) {
            noResults('weather', 'your current conditions');
        } else {
            // Choose 2 Random Playlists From Each Genre To Display
            let genre1RandomPlaylists = [];
            let genre2RandomPlaylists = [];
            let genre3RandomPlaylists = [];
            for (let i = 0; i < 1; i++) {
                random = genre1Array[Math.floor(Math.random() * genre1Array.length)];
                genre1RandomPlaylists.push(random);

                random2 = genre2Array[Math.floor(Math.random() * genre2Array.length)];
                genre2RandomPlaylists.push(random2);

                random3 = genre3Array[Math.floor(Math.random() * genre3Array.length)];
                genre3RandomPlaylists.push(random3);
            }

            // Display Playlists
            if (genre1Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre1RandomPlaylists.length; i++) {
                    let playlist = genre1RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }

            if (genre2Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre2RandomPlaylists.length; i++) {
                    let playlist = genre2RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }

            if (genre3Array.length === 0) {
                noResults('weather', 'this genre');
            } else {
                for (let i = 0; i < genre3RandomPlaylists.length; i++) {
                    let playlist = genre3RandomPlaylists[i];
                    let div = document.createElement('div');
                    let infoDiv = document.createElement('div');
                    let img = document.createElement('img');
                    let p = document.createElement('p');
                    let link = document.createElement('a')

                    infoDiv.classList.add('playlist-info')
                    div.classList.add('playlist');
                    p.innerText = playlist.name;
                    link.innerText = 'Open On Spotify'
                    link.href = playlist.external_urls.spotify;
                    link.target = "_blank";
                    img.src = playlist.images[0].url;

                    infoDiv.appendChild(p);
                    infoDiv.appendChild(link);
                    div.appendChild(img);
                    div.appendChild(infoDiv)
                    weatherResults.appendChild(div);
                }
            }
        }
    }

}

// If Spotify api Returns Null
function noResults(value, value2) {
    if (value == 'mood') {
        moodPrompt.style.display = 'block';
        moodPrompt.innerText = `Sorry, we couldn\'t find any recommendations based on ${value2}.`
        moodResults.appendChild(moodPrompt);
    } else if (value == 'activity') {
        activityPrompt.style.display = 'block';
        activityPrompt.innerText = `Sorry, we couldn\'t find any recommendations based on ${value2}.`
        activityResults.appendChild(activityPrompt);
    } else if (value == 'time') {
        timePrompt.classList.add('prompt');
        timePrompt.innerText = `Sorry, we couldn\'t find any recommendations based on ${value2}.`
        timeResults.appendChild(timePrompt);
    }
    else if (value == 'weather') {
        weatherPrompt.classList.add('prompt');
        weatherPrompt.innerText = `Sorry, we couldn\'t find any recommendations based on ${value2}.`
        weatherResults.appendChild(weatherPrompt);
    }
}

window.onload = () => {
    selectGenres();
    checkTime();
    checkPermission();
};