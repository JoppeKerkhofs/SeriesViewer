// this is the code for the navigation bar
import React, { useState } from 'react';

// import the components
import Home from './Home';
import Watch from './Watch';
import Settings from './Settings';

function Nav() {
    const [activePage, setActivePage] = useState('home');

    const handlePageChange = (page: string) => {
        setActivePage(page);
    };

  return (
    <div className='h-full'>
        <nav className="bg-background text-onBackground p-4">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                    <span className="text-white font-bold text-xl">Series Viewer</span>
                </div>
                <div className="hidden md:block">
                    <div className="ml-4 flex items-center space-x-4">
                    <button onClick={() => handlePageChange('home')} className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${activePage === 'home' ? 'bg-primary-1 text-onPrimary-1' : ''}`}>Home</button>
                    <button onClick={() => handlePageChange('watch')} className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${activePage === 'watch' ? 'bg-primary-1 text-onPrimary-1' : ''}`}>Watch</button>
                    <button onClick={() => handlePageChange('settings')} className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${activePage === 'settings' ? 'bg-primary-1 text-onPrimary-1' : ''}`}>Settings</button>
                    </div>
                </div>
            </div>
        </div>
        </nav>
        <div className="m-4">
            {activePage === 'home' && <Home />}
            {activePage === 'watch' && <Watch />}
            {activePage === 'settings' && <Settings />}
        </div>
    </div>
  );
};

export default Nav;