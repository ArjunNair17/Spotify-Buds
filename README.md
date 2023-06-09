# SpotifyBuds: Make Friends With Similar Music Intrests

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Code Examples](#code-examples)
* [Contributing](#contributing)


## General info
Have you ever wondered what people around you are listening to? Have you wanted to approach someone and strike up a conversation about music? SpotifyBuds is a location-based social finder app that lets you meet new friends in your vicinity and acquire new music tastes.
  
## Technologies
Project is created with:
* Firebase CLI v11.4.0.
* React 18.2.0
* Google API 2021-12
* Spotify API Version 3.202.356
  
## Setup
To run this project, install it locally using npm:

```
$ npm install
$ npm install firebase
$ npm install react-icon
$ npm install react-router-dom
$ npm start

```
# Important
It is important to note that Spotify API requires that any potential users of their API must be added to Spotify API's allowlist
* Example: johnDoe@gmail.com 

## Features
This app has the following unique features:

* Allows users to login (saves and stores user API data)
* Displays pings of users near you and relevant information on google maps
* Displays real time, changing music information about users in an n feet radius around you.
* Allows users to search for friends even is they arent in their vacinity.

## Code examples
Finding closest users for location feature

```
function findClosestUsers(userLat, userLon, database, n) {
  // Create an array to store distances
  const distances = [];

  // Calculate distance from user to each user in the database
  for (const person of database) {
    const distance = calculateDistance(userLat, userLon, person.lat, person.lon);
    distances.push({ user: person.name, distance: distance });
  }

  // Sort distances in ascending order
  distances.sort((a, b) => a.distance - b.distance);

  // Get the closest n users
  const closestUsers = distances.slice(0, n);

  return closestUsers;
}
```

Haversine Formula to covert Longitude and Latitude into feet

```
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusInFeet = 20903520; // Approximate Earth radius in feet
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInFeet = earthRadiusInFeet * c;
  return distanceInFeet;
}
```
Parse data from Database
```
 const fetchUserData = () => {
   const db = getDatabase();
   const usersRef = ref(db, "users");


   onValue(usersRef, (snapshot) => {
     const userData = snapshot.val();
     if (userData) {
       const markers = Object.values(userData).map((user) => {
         const { latitude, longitude, currentSong, artists } = user;
         console.log("user: ", user);
         return [`${user.userName}'s Location`, latitude, longitude, currentSong, artists];
       })
     }
   })
 }
```
## Contributing
Thank you for considering contributing to the SpotifyBuds project! We welcome any contributions that can help improve the app and enhance the user experience. To ensure a smooth collaboration, please review the following guidelines before making any contributions.

# Setting up the Development Environment

To set up the development environment for SpotifyBuds and make the app on your own, please follow these steps:

* Clone the repository to your local machine using the following command:
* Navigate to the project's root directory:
* Install the required dependencies using npm:
* Create a Firebase project and obtain the necessary configuration credentials (API key, project ID, etc.).
* Create a .env file in the project's root directory and add the Firebase configuration credentials in the following format:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```
* Start the development server:

```
npm start
```

Open your browser and navigate to http://localhost:3000 to access SpotifyBuds locally.

# Contribution Guidelines
To contribute to the project, please adhere to the following guidelines:

* Create a new branch for each contribution or bug fix:

```
git checkout -b my-contribution
```
* Make sure your code follows the project's coding style and conventions.
* Write clear and concise commit messages that describe the purpose of your changes.
* Include appropriate tests for your contributions to maintain code quality.
* Push your changes to your forked repository and create a pull request against the main repository's master branch.
* Provide a detailed description of your changes in the pull request, explaining the problem you're addressing and the proposed solution.
* Be responsive to any feedback or suggestions provided during the review process.

We appreciate your effort and value your contributions to making SpotifyBuds even better! Together, let's create an amazing music discovery platform.

