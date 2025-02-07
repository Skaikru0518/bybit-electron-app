import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importáld a Navigate komponenst

import Dashboard from './Components/Dashboard'
import Navbar from './Components/Navbar'
import Trades from './Components/Trades';
import Settings from './Components/Settings';
import About from './Components/About'
import Calculators from './Components/Calculators';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Átirányítás a Dashboard-ra, ha a gyökér útvonalat nyitják meg */}
                {/* <Route path="/" element={<Navigate to="/Dashboard" replace />} /> */}


                {/* Dashboard oldal renderelése */}
                <Route path='/' element={<Dashboard />} />
                <Route path='/Calculators' element={<Calculators />} />
                <Route path='/Settings' element={<Settings />} />
                <Route path='/Trades' element={<Trades />} />
                <Route path='/About' element={<About />} />

            </Routes>
        </Router>
    )
}

export default App