import React from 'react';
import './App.css';




class App extends React.Component {


 constructor(props) {
   super(props);
   this.state = {
     latitude: null,
     longitude: null,
     userAddress: null
   };
   this.getLocation = this.getLocation.bind(this);
   this.getCoordinates = this.getCoordinates.bind(this); // Fix the binding here
   this.getUserAddress = this.getUserAddress.bind(this);
 }


 componentDidMount() {
   this.getLocation();
   this.interval = setInterval(this.getLocation, 1000); // Update every 1 seconds
 }


 componentWillUnmount() {
   clearInterval(this.interval); // Clear the interval when the component is unmounted
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
 const { latitude, longitude } = this.state;
 fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBxDQfDy1nwLkmwaJUfQtNNqXla3kZr-ug`)
   .then(response => response.json())
   .then(data => {
     const address = data.results[0].formatted_address;
     this.setState({ userAddress: address });
   })
   .catch(error => alert(error));
}




 handleLocationError(error){
   switch(error.code) {
     case error.PERMISSION_DENIED:
       alert("User denied the request for Geolocation.")
       break;
     case error.POSITION_UNAVAILABLE:
       alert("Location information is unavailable.")
       break;
     case error.TIMEOUT:
       alert("The request to get user location timed out.")
       break;
     case error.UNKNOWN_ERROR:
       alert("An unknown error occurred.")
       break;
     default:
       alert("An unknown error occurred.")
   }
 }


 render() {
   return (
     <div className="App">
       <h2>
         Geolocation Finder for SpotifyBuds
       </h2>
       <button onClick={this.getLocation}>Get coordinates</button>
       <h4>Your Coordinates</h4>
       <p>Latitude: {this.state.latitude}</p>
       <p>Longitude: {this.state.longitude}</p>
       <h4>Finding people around your area</h4>
       <p>Address: {this.state.userAddress}</p>
       {
         this.state.latitude && this.state.longitude &&
         <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.latitude},${this.state.longitude}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7C${this.state.latitude},${this.state.longitude}&key=AIzaSyBxDQfDy1nwLkmwaJUfQtNNqXla3kZr-ug`} alt=''/>
       }
     </div>
   )
 }


}


export default App;

