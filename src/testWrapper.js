import React from 'react';
import {useState, useEffect} from 'react';
import axios from "axios";
import SpotifyWebApi from 'spotify-web-api-js';
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=8b945ef10ea24755b83ac50cede405a0&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


export default function Bluddu() {
    const code = new URLSearchParams(window.location.search).get('code');
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        axios
          .post("http://localhost:3001/main", {
            code,
          })
          .then(res => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            console.log(accessToken);
            console.log(refreshToken);
            console.log(res.data);
           // window.history.pushState({}, null, "/")
          })
      }, [code])



    return (
        <div>
            <a href = {AUTH_URL}> Login With Spotify </a>
        </div>
    )
}