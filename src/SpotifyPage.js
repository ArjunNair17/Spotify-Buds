import React, { useEffect, useState } from 'react';

const clientID = "4db376ff1b0941de8908d1748f1eb266";
const redirectURL = "http://localhost:3000/main";


const MainComponent = () => {
  const [name, setName] = useState("No Currently Playing");
  const [currentAccessToken, setToken] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    const handleAuthentication = async () => {
      if (!code) {
        redirectToAuthCodeFlow(clientID);
      } else {
        console.log("got here!");
        await getAccessToken(clientID, code);
        const profile = await fetchProfile(currentAccessToken);
        //setToken(current);
        if(profile.is_playing === true){
          setName(profile.item.name);
        }

        else {
          setName("Nothing is currently playing.")
        }
      }
    };

    handleAuthentication();
  }, []);
  const params = new URLSearchParams(window.location.search);
    const code = params.get('code')
  const refresh = async () => {
        const accessToken = await getAccessToken(clientID, code);
        const profile = await fetchProfile(currentAccessToken);
        console.log(profile);
        if(profile.is_playing === true){
          setName(profile.item.name);
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
    params.append("scope", "user-read-private user-read-email user-read-currently-playing user-read-recently-played");
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

    console.log(result.json);
    const { access_token } = await result.json();
    
    if(access_token !== undefined) {
      setToken(access_token);
      localStorage.setItem("accessToken", access_token);
    }
    return access_token;
  }

  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Token: "  + token);
    console.log(result.status);
    return await result.json();
  }

  return (
    <div>
      <h1>{name}</h1>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
};

export default MainComponent;