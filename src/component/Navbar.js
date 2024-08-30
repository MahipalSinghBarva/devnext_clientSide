import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="w-full bg-white border-b shadow-sm items-center">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center">
                    <Link to="/">
                        <span className="font-bold text-pink-500 text-3xl hover:underline">Quiz App</span>
                    </Link>
                    <Link to="/data">
                        <button className='text-sm border bg-blue-700 rounded-lg text-white w-28 h-12 hover:bg-blue-300 hover:text-black'>
                            Show Data
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
