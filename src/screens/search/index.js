import './Search.css'
import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";



export default function Search() {
    const [searchOption, setSearchOption] = useState('user');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getDatabase();
                const usersRef = ref(db, 'users');

                onValue(usersRef, (snapshot) => {
                    const data = snapshot.val();
                    console.log(data);
                    if (data) {
                        const userData = Object.values(data);
                        setUserData(userData);
                    }
                });
            } catch (error) {
                console.log('Error fetching user data: ', error);
            }
        };

        fetchData();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
    };

    const toRadians = (degrees) => {
        return degrees * (Math.PI / 180);
    };

    const handleSearchOptionChange = (event) => {
        setSearchOption(event.target.value);
    };

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearch = () => {
        console.log("got here!");
        console.log(searchOption);
        console.log(userData);
        if (!userData) {
            return; // Return early if userData is undefined
        }

        if (searchOption === 'artist') {
            const filteredUsers = userData.filter((user) =>
                user.topArtists && user.topArtists.includes(searchText)
            );
            setSearchResults(filteredUsers);
        } else if (searchOption === 'user') {
            const filteredUsers = userData.filter((user) =>
                user.userName && user.userName.toLowerCase().includes(searchText.toLowerCase())
            );
            console.log(filteredUsers);
            setSearchResults(filteredUsers);
        } else if (searchOption === 'song') {
            const filteredUsers = userData.filter((user) =>
                user.currentSong && user.currentSong.toLowerCase().includes(searchText.toLowerCase())
            );
            setSearchResults(filteredUsers);
            console.log(filteredUsers);
        }
    };

    return (
        <div>
            <div>
                {/* <select value={searchOption} onChange={handleSearchOptionChange}>
                    <option value="">Select an option</option>
                    <option value="artist">Search for artist</option>
                    <option value="user">Search for user</option>
                    <option value="song">Search for song</option>
                </select> */}
                <input className="bar" type="text" value={searchText} onChange={handleSearchTextChange} />
                <button className="button" onClick={handleSearch}>Search</button>
            </div>
            <div className="results">
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((result) => (
                            <li  key={result.uid}>
                                {searchOption !== 'user' ? (
                                    <span>{result.userName}</span>
                                ) : (
                                    <div>
                                        <li>Username: {result.userName}</li>
                                      
                                        <li>Current Song: {result.currentSong}</li>
                                     
                                        <li>
                                            Top Artists: {result.artists.map((artist) => artist.name).join(', ')}
                                        </li>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
}
