import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app'
import { EmailAuthCredential, getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, onValue, update, push } from "firebase/database";
import { app } from './Firebase/config';
import "./list.css";


const clientID = "4db376ff1b0941de8908d1748f1eb266";
const redirectURL = "http://localhost:3000/main";


const MainComponent = () => {
  const [name, setName] = useState("Nothing Currently Playing.");
  const [currentAccessToken, setToken] = useState("");
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [users, setUsers] = useState([]);
  const [song, setSong] = useState("Cannot fetch song!");
  const [artists, setArtists] = useState([]);

  const updatePosition = () => {
    const position = navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

    });
  };

  useEffect(() => {
    updatePosition();

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const currentEmail = user.email;
        console.log("userEmail " + currentEmail);
        setEmail(currentEmail);
        setUid(uid);
        // ...
      } else {
        console.log("signed out");
        // User is signed out
        // ...
      }
    });

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    const handleAuthentication = async () => {
      if (!code) {
        redirectToAuthCodeFlow(clientID);
      } else {
        console.log("got here!");
        if (currentAccessToken === "") {
          await getAccessToken(clientID, code);
        }


        const profile = await fetchProfile();
        //setToken(current);
        console.log(profile);
        if (profile !== null) {
          if (profile.is_playing === true) {
            if (song === "Cannot fetch song!")
              setName();
            writeData();

          }
          else {
            setName("Nothing is currently playing.")
            //getUsers();
          }
        }


        else {
          setName("Nothing is currently playing.")
          //getUsers();
        }


      }
    };

    handleAuthentication();





  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 2000);

    return () => clearInterval(interval);
  });

  function writeData(currentPlayingSong) {

    updatePosition();
    if (song === "Cannot fetch song!") {
      return;
    }
    const database = getDatabase();

    // User data to be added or updated
    const user = {
      userName: email,
      currentSong: song,
      latitude: latitude,
      longitude: longitude,
      artists: artists
    };

    // Reference to the user's location in the database
    console.log(uid);
    const userRef = ref(database, 'users/' + uid);

    // Check if the user already exists
    get(userRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          // User exists, update the existing user's information
          update(userRef, user)
            .then(() => {
              console.log("User information updated successfully");
            })
            .catch(error => {
              console.error("Error updating user information:", error);
            });
        } else {
          // User doesn't exist, add a new user using push()
          const newUserRef = ref(database, 'users/' + uid);
          set(newUserRef, user)
            .then(() => {
              console.log("New user added successfully");
            })
            .catch(error => {
              console.error("Error adding new user:", error);
            });
        }
      })
      .catch(error => {
        console.error("Error checking user existence:", error);
      });

    // set(ref(db, "users/" + uid), {
    //   userName: email,
    //   currentSong: song,
    //   latitude: latitude,
    //   longitude: longitude,
    //   artists: artists
    // });
  }

  const getUsers = async () => {
    const db = getDatabase();
    updatePosition();
    const usersRef = ref(db, 'users');
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        console.log(users);
        const closest = findClosestUsers(latitude, longitude, users, 1000);
        //console.log("closests: " + closest[0].artists);
        setUsers(closest);

      }
    });
  }

  //   if (dataSnapshot.exists()) {
  //     const users = dataSnapshot.val();
  //     console.log("users: " + users.name);


  //   } else {
  //     console.log('No users found');
  //   }
  // } catch (error) {
  //   console.log('Error getting users:', error);
  // }



  const params = new URLSearchParams(window.location.search);
  const code = params.get('code')


  const refresh = async () => {
    updatePosition();
    if (currentAccessToken === "") {
      await getAccessToken(clientID, code);
    }
    const profile = await fetchProfile();

    if (profile !== null) {
      if (profile.is_playing === true) {
        //setName(profile.item.name);
        writeData();
        getUsers();
      }
      else {
        setName("Nothing is currently playing.")
      }
    }


    else {
      setName("Nothing is currently playing.")
    }


  }

  async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectURL);
    params.append("scope", "user-read-private user-read-email user-read-currently-playing user-read-recently-played user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/main");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();

    if (access_token !== undefined) {
      setToken(access_token);
      localStorage.setItem("accessToken", access_token);
    }
    return access_token;
  }


  async function fetchProfile() {
    console.log("at fetch profile");
    const token = localStorage.getItem("accessToken");
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(result.status);
    if (result.status === 204) {
      setSong("Nothing is currently playing");
      return null;
    }

    const currentPlaying = await result.json();
    console.log("here!");
    //console.log(currentPlaying.item.name);

    const artistsTop = await fetch("https://api.spotify.com/v1/me/top/artists?limit=3", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    const artistTopJson = await artistsTop.json();
    setArtists(artistTopJson.items);

    if (result.status === 200) {
      if (currentPlaying.is_playing === true) {
        setSong(currentPlaying.item.name);

      }
    }

    return currentPlaying;
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
    const roundedDistance = distanceInFeet.toFixed(2); // Round to two decimal places
    return roundedDistance;
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function findClosestUsers(userLat, userLon, database, radius) {
    const distances = [];
    //onsole.log("Database: " + database);
    for (const person in database) {
      //console.log(database[person]);
      const distance = calculateDistance(userLat, userLon, database[person].latitude, database[person].longitude);
      //console.log("distance: " + distance);
      console.log("distance; " + distance);
      if (distance <= radius) {
        distances.push({ user: database[person].userName, distance: distance, song: database[person].currentSong, artists: database[person].artists });
      }
    }

    distances.sort((a, b) => a.distance - b.distance);
    console.log("this.state.distances:", distances);
    return distances;
  }










  return (
    <div className="box">
      <div className="list-container">
        <ul className="list">
          {users.length > 0 ? (
            users.map((item) => (
              <li key={item.id} className="wrapper">
                <h3 className="infoStyle">{item.user}</h3>
                <p className="infoStyle">{"Listening to: "}{item.song}</p>
                <p className="infoStyle">
                  {item.artists.map((artist, index) => (
                    <span key={index}>
                      {artist.name}
                      {index !== item.artists.length - 1 && ","}
                    </span>
                  ))}
                </p>              
              </li>
            ))
          ) : (
            <p>No users available.</p>
          )}
        </ul>

      </div>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );


};

export default MainComponent;