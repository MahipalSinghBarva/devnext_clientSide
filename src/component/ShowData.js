import React, { useState } from 'react';
import axios from 'axios';

const ShowData = () => {
    const [name, setName] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/data?username=${name}`);
            setData(response.data);
            setError(''); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('No data found for this username.');
            setData(null); 
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (name.trim()) {
            fetchData();
        } else {
            setError('Please enter a valid name.');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <form onSubmit={handleSearch}>
                <input
                    placeholder="Enter your name"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Search
                </button>
            </form>

            {error && (
                <div className="mt-4 text-red-500">
                    {error}
                </div>
            )}

            {data && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Results for {data.username}  :</h2>
                    <div className="mb-4">
                        <p><strong>Score:</strong> {data.score}</p>
                        <p><strong>Date:</strong> {new Date(data.date).toLocaleString()}</p>
                    </div>
                    <ul className="space-y-4">
                        {data.feedback.map((item, index) => (
                            <li key={index} className={`p-4 rounded-lg shadow-sm ${item.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                                <p><strong>Question:</strong> <span dangerouslySetInnerHTML={{ __html: item.question }} /></p>
                                <p><strong>Your Answer:</strong> {item.selected}</p>
                                <p className={item.correct ? 'text-green-700' : 'text-red-700'}>
                                    {item.correct ? 'Correct' : 'Incorrect'}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ShowData;
