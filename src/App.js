
import React from 'react';
import './App.css';

const userDatabase = [
  { name: "User1", lat: 34.0726251, lon: -118.4536259 },
  { name: "User2", lat: 34.0726400, lon: -118.4536259 },
  { name: "User3", lat: 34.0726450, lon: -118.4536259 },
  { name: "User4", lat: 34.0726351, lon: -118.4536259 },
  { name: "User5", lat: 34.072540, lon: -118.4536269 }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      userAddress: null,
      closestUsers: [],
      radius: 5 // Default radius of 5 feet
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getUserAddress = this.getUserAddress.bind(this);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
  }

  componentDidMount() {
    this.getLocation();
    this.interval = setInterval(this.getLocation, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getCoordinates(position) {
    this.setState(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      this.getUserAddress
    );
  }

  getUserAddress() {
    const { latitude, longitude, radius } = this.state;
    if (latitude && longitude) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBxDQfDy1nwLkmwaJUfQtNNqXla3kZr-ug`)
        .then(response => response.json())
        .then(data => {
          const address = data.results[0].formatted_address;
          this.setState({ userAddress: address });
  
          const closestUsers = this.findClosestUsers(latitude, longitude, userDatabase, radius);
          this.setState({ closestUsers: closestUsers });
        })
        .catch(error => alert(error));
    }
  }  

  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
      default:
        alert("An unknown error occurred.");
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusInFeet = 20903520; // Approximate Earth radius in feet
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInFeet = earthRadiusInFeet * c;
    const roundedDistance = distanceInFeet.toFixed(2); // Round to two decimal places
    return roundedDistance;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  findClosestUsers(userLat, userLon, database, radius) {
    const distances = [];

    for (const person of database) {
      const distance = this.calculateDistance(userLat, userLon, person.lat, person.lon);
      if (distance <= radius) {
        distances.push({ user: person.name, distance: distance });
      }
    }

    distances.sort((a, b) => a.distance - b.distance);

    return distances;
  }

  handleRadiusChange(event) {
    const radius = parseInt(event.target.value, 10);
    this.setState({ radius }, this.getUserAddress);
  }

  render() {
    return (
      <div className="App">
        <h2>Geolocation Finder for SpotifyBuds</h2>
        <label htmlFor="radius">Select radius in feet:</label>
        <select id="radius" value={this.state.radius} onChange={this.handleRadiusChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <p></p><button onClick={this.getLocation}>Get coordinates</button>
        <h4>Your Coordinates</h4>
        <p>Latitude: {this.state.latitude}</p>
        <p>Longitude: {this.state.longitude}</p>
        <h4>Finding people around your area</h4>
        <p>Address: {this.state.userAddress}</p>
        {
          this.state.latitude && this.state.longitude &&
          <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.latitude},${this.state.longitude}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7C${this.state.latitude},${this.state.longitude}&key=AIzaSyBxDQfDy1nwLkmwaJUfQtNNqXla3kZr-ug`} alt=''/>
        }
        <h4>Closest Users</h4>
        {this.state.closestUsers.length > 0 && (
          <ul>
            {this.state.closestUsers.map((user, index) => (
              <li key={index}>{user.user} - {user.distance} feet</li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}
export default App;

