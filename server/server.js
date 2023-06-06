const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/main', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000/main",
    clientId: "4db376ff1b0941de8908d1748f1eb266",
    clientSecret: "cd0b26d43e434b89bda2b3805c791d16"
  });

  spotifyApi
  .authorizationCodeGrant(code)
  .then((data) => {
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    });
  })
  .catch((error) => {
    console.error('Error during authorization code grant:', error);
    res.sendStatus(400);
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
