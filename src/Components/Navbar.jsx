import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/icon.ico'

export default function Navbar() {
    return (
        <nav className="bg-navbar-bg border-b border-navbar-border text-navbar-link p-4 flex justify-between shadow-lg h-[60px]">
            <div className='flex flex-row space-x-4'>
                <img src={Logo} alt="" className='rounded-md' />
                <h1 className="text-xl font-semibold text-primary-text">| ZenTrader |</h1>
            </div>

            <div className="space-x-6 mr-5">
                <NavLink to="/" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover transition-all duration-300'}>
                    Dashboard
                </NavLink>
                <NavLink to="/trades" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover duration-300'}>
                    Trades
                </NavLink>
                <NavLink to="/calculators" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover duration-300'}>
                    Calculators
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover duration-300'}>
                    Settings
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'text-navbar-link-active border-b-2 border-accent' : 'text-navbar-link hover:text-navbar-link-hover duration-300'}>
                    About
                </NavLink>
            </div>
        </nav>
    );
}