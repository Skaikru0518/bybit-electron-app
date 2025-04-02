import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Dashboard from './Components/Dashboard';
import Navbar from './Components/Navbar';
import Trades from './Components/Trades';
import Settings from './Components/Settings';
import About from './Components/About';
import Calculators from './Components/Calculators';
import PageTransitions from './Components/animations/PageTransitions';

// Készíts egy külön komponenst az animált tartalomhoz
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className=" overflow-y-hidden bg-gradient-to-r from-[#130f40] to-black">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransitions>
                <Dashboard />
              </PageTransitions>
            }
          />
          <Route
            path="/Calculators"
            element={
              <PageTransitions>
                <Calculators />
              </PageTransitions>
            }
          />
          <Route
            path="/Settings"
            element={
              <PageTransitions>
                <Settings />
              </PageTransitions>
            }
          />
          <Route
            path="/Trades"
            element={
              <PageTransitions>
                <Trades />
              </PageTransitions>
            }
          />
          <Route
            path="/About"
            element={
              <PageTransitions>
                <About />
              </PageTransitions>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

// Fő App komponens
function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
