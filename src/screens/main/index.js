import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../home";
import Discover from "../discover";
import Search from "../search"
import './main.css';
import Sidebar from '../../components/sidebar';

export default function Main() {
    return (
    <Router>
        <div className="main-body">
            <Sidebar />
            <Routes>
                <Route path= "/" element={<Home />} />
                <Route path= "/discover" element={<Discover />} />
                <Route path= "/search" element={<Search />} />
            </Routes>
        </div>
    </Router>
    )
}
