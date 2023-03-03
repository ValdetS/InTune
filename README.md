<!-- Welcome Section -->
# What Is InTune? 🤔
InTune is a music selection tool. This web app uses a mix of APIs to help find music based on mood, activity, time of day, or weather. To learn more about my project, or to try it out yourself. Feel free to visit the project page [project page](https://valdetsemovski.com/intune-project-page.html "Visit https://valdetsemovski.com/intune-project-page.html") on my portfolio site. This documentation will cover the technical details about the project.

<br>

# Table of Contents 📖
 - [Technologies Used 🛠](#technologies-used-🛠)
 - [Instructions 💻](#instructions-💻)

<br>

# Technologies Used 🛠
InTune uses:
- [Node.js 🔗](https://nodejs.org/en/ "Visit https://nodejs.org/en/")
    - [Express 🔗](https://expressjs.com/ "Visit https://expressjs.com/")
    - [Axios 🔗](https://axios-http.com/ "Visit https://axios-http.com/")
    - [CORS 🔗](https://github.com/expressjs/cors#readme "Visit https://github.com/expressjs/cors#readme")
    - [spotify-web-api-node 🔗](https://github.com/thelinmichael/spotify-web-api-node "Visit https://github.com/thelinmichael/spotify-web-api-node")

APIs used:
 - [Spotify Web API 🔗](https://developer.spotify.com/documentation/web-api/ "Visit https://developer.spotify.com/documentation/web-api/")
 - [OpenWeather WeatherAPI 🔗](https://openweathermap.org/api "Visit https://openweathermap.org/api")


# Instructions 💻
If you want to build you own InTune project from scratch please refer to the, [Technologies Used 🛠](#technologies-used-🛠) section, for links to all the resources used in the project.

If you are cloning the InTune repository then follow the steps below.

## Installation ⬇️ 
Once you have cloned the repository, open your terminal to the project file directory and run:

```
npm install
```
This will download all the needed dependencies for the proeject.

## API Credentials 🔑
**Please Note:** In order for you to use any of the APIs you must have your own credentials. These can be obtained by following the API's documentation.

For security reasons I stored my API credentials in a seperate "credentials.js" file and exported them as a module to be used in my "index.js" file:

```javascript
// Index.js
const credentials = require('./credentials');
```

You can do the same or just replace the `credentials` object in the code with your actual credentials:

```javascript
// Using the credentials object
let clientId = credentials.spotify.client_id; 

// Using the actual credentials
let clientSecret = //Your crednetials here;
```

## Conclusion
After following all the instructions you should have your own functioning InTune project. Congratulations! 🎉🎊🥳
