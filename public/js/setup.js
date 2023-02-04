// Select Genres
const genreContainer = document.querySelector('.genre-container');
const btn = document.querySelector('.genre');
btn.addEventListener('click', selectGenre);

let userGenres = [];

fetch('https://intune-production.up.railway.app/genres')
    .then(res => res.json())
    .then(data => {
        // Storing api response for later use
        let spotifyGenres = data.genres;
        let spotifyGenresSaved = JSON.stringify(spotifyGenres);
        localStorage.setItem('spotifyGenresStored', spotifyGenresSaved);

        for (let i = 0; i < data.genres.length; i++) {
            let item = document.createElement('button');
            let node = document.createTextNode(data.genres[i]);
            item.className = 'genre';
            item.appendChild(node);
            item.addEventListener('click', selectGenre);
            genreContainer.appendChild(item);
        }
    })
    .catch(err => console.log(err))

function selectGenre(event) {
    event.target.classList.toggle('selected');
    if (!event.target.hasAttribute('value')) {
        event.target.setAttribute('value', 'selected');
        // Prevent adding duplicates to array
        if (userGenres.indexOf(event.target.innerText) === -1) userGenres.push(event.target.innerText);
    } else {
        event.target.removeAttribute('value');
        let index = userGenres.indexOf(event.target.innerText);
        userGenres.splice(index, 1);
    }
}

// Change Questions
const bar = document.querySelector('.progress-bar');
const card = document.querySelector('#card-1');
const card2 = document.querySelector('#card-2');
card2.style.display = 'none';
const next = document.querySelector('.big-btn');
next.addEventListener('click', changeQuestion);

let clickCounter = 0;

function changeQuestion() {
    if (userGenres.length <= 0) {
        window.alert('Please select atleast one genre of music.')
    } else {
        if (clickCounter == 0) {
            clickCounter = 1;
            bar.style.width = '50%';
            let userGenresSaved = JSON.stringify(userGenres);
            localStorage.setItem('userGenres', userGenresSaved);
            card.style.display = 'none';
            card2.style.display = 'block';
        }
    }
}

// Get User Location
const allowBtn = document.querySelector('.allow');
const denyBtn = document.querySelector('.deny');
allowBtn.addEventListener('click', getLocation);
denyBtn.addEventListener('click', finish);

let locationAccess = false;
let latitude = 0;
let longitude = 0;

function getLocation() {
    if (!navigator.geolocation) {
        window.alert('Geolocation is not supported by your broswer.');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        locationAccess = true;
        localStorage.setItem('userLatitude', latitude);
        localStorage.setItem('userLongitude', longitude);
        finish();
    }

    function error() {
        window.alert('Unable to retrieve your location.');
    }
}

// Send User To Homepage
function finish() {
    clickCounter = 0;
    bar.style.width = '100%';
    localStorage.setItem('allowLocation', locationAccess);
    window.location.assign('home.html');
}