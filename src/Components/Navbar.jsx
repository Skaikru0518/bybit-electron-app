import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-navbar-bg border-b border-navbar-border text-navbar-link p-4 flex justify-between shadow-lg h-[60px]">
            <h1 className="text-xl font-semibold text-primary-text">Bybit Trader</h1>
            <div className="space-x-6">
                <NavLink to="/" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover transition-all'}>
                    Dashboard
                </NavLink>
                <NavLink to="/trades" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover'}>
                    Trades
                </NavLink>
                <NavLink to="/calculators" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover'}>
                    Calculators
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover'}>
                    Settings
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover'}>
                    About
                </NavLink>
            </div>
        </nav>
    );
}