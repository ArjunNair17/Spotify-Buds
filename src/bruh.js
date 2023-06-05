import React, { useEffect, useState } from 'react';

const clientID = "4db376ff1b0941de8908d1748f1eb266";
const redirectURL = "http://localhost:3000/main";


const MainComponent = () => {
  const [name, setName] = useState("No Currently Playing");
  const [accessToken, setToken] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    const handleAuthentication = async () => {
      if (!code) {
        redirectToAuthCodeFlow(clientID);
      } else {
        const storedAccessToken = window.localStorage.getItem('accessToken');
        if (storedAccessToken) {
          setToken(storedAccessToken);
          const profile = await fetchProfile(storedAccessToken);
          if (profile !== null) {
            console.log(profile.item.name)
            setName(profile.item.name);
          }
          else {
            setName("Nothing is playing")
          }
        } else {
          const accessToken = await getAccessToken(clientID, code);
          setToken(accessToken);
          window.localStorage.setItem('accessToken', accessToken);
          const profile = await fetchProfile(accessToken);
          if (profile.item !== null) {
            console.log(profile.item.name)
            setName(profile.item.name);
          }
          else {
            setName("Nothing is Playing");
          }
        }
      }
    };

    handleAuthentication();
  }, []);
  
  const refresh = async () => {
    const profile = await fetchProfile(accessToken);

    if (profile !== null) {
      console.log(profile.item.name);
      setName(profile.item.name);
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
    params.append("scope", "user-read-currently-playing user-read-recently-played");
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
    params.append("redirect_uri", redirectURL);
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Result: " + result.status);
      
    if(result.status != 204) {
      return await result.json();
    }
    else {
      console.log("Token: " + token);
      return null;
    }
  }

  return (
    <div>
      <h1>{name}</h1>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
};

export default MainComponent;