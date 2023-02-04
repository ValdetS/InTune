// Changing Location Permission
let locationAccess = userLocation = JSON.parse(localStorage.getItem("allowLocation"));
let latitude = 0;
let longitude = 0;
let toggleBtn = document.querySelector('input');
toggleBtn.addEventListener('click', changePermission);

// Check Current Permission
function checkLocation() {
    if (locationAccess == true) {
        toggleBtn.checked = true;
    } else {
        toggleBtn.checked = false;
    }
}
checkLocation();

function changePermission() {
    if(locationAccess == true) {
        toggleBtn.checked = false;
        locationAccess = false;
    } else {
        locationAccess = true;
        getLocation();
    }
}

function getLocation() {
    if (!navigator.geolocation) {
        window.alert('Geolocation is not supported by your broswer.');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        localStorage.setItem('userLatitude', latitude);
        localStorage.setItem('userLongitude', longitude);
        toggleBtn.checked = true;
    }

    function error() {
        window.alert('Unable to retrieve your location.');
    }
}

// Changing Genres
const genreContainer = document.querySelector('.settings-genre-container');
let spotifyGenres = JSON.parse(localStorage.getItem("spotifyGenresStored"));
let userGenres = JSON.parse(localStorage.getItem("userGenres"));

const btn = document.querySelector('.settings-genre');
btn.addEventListener('click', selectGenre);

for (i = 0; i < spotifyGenres.length; i++) {
    let item = document.createElement('button');
    let node = document.createTextNode(spotifyGenres[i]);
    item.addEventListener('click', selectGenre);

    if (userGenres.indexOf(spotifyGenres[i]) !== -1) {
        item.classList.add('selected');
        item.setAttribute('value', 'selected');
    }

    item.classList.add('settings-genre');
    item.appendChild(node);
    genreContainer.appendChild(item);
}

function selectGenre(event) {
    console.log('click');
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

// Saving Changes
const iconBtn = document.querySelector('.icon-btn');
iconBtn.addEventListener('click', saveChanges)

function isEmpty(array) {
    if (array.length <= 0) {
        return true;
    } else {
        return false
    }
}

function saveChanges() {
    let isArrayEmpty = isEmpty(userGenres);
    if (isArrayEmpty == true) {
        window.alert('Please select atleast one genre of music.')
    }else {
        let userGenresSaved = JSON.stringify(userGenres);
        localStorage.setItem('userGenres', userGenresSaved);
        localStorage.setItem('allowLocation', locationAccess);
        window.location.assign('home.html');
    }
}