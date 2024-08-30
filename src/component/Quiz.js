import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
    const [categories] = useState([
        { id: 9, name: 'General Knowledge' },
        { id: 17, name: 'Science & Nature' },
        { id: 23, name: 'History' },
        { id: 18, name: 'Computers' },
    ]);

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showScore, setShowScore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const [feedback, setFeedback] = useState([]);
    const [token, setToken] = useState(null);
    const [name, setName] = useState('');


    useEffect(() => {
        const fetchSessionToken = async () => {
            try {
                const response = await axios.get('https://opentdb.com/api_token.php?command=request');
                setToken(response.data.token);
            } catch (error) {
                console.error('Error fetching session token:', error);
            }
        };

        fetchSessionToken();
    }, []);

    const fetchQuestions = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`https://devnext-serverside.onrender.com/api/quiz?category=${selectedCategory}&token=${token}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
            if (error.response && error.response.data.response_code === 4) {
                handleTokenReset();
            }
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [token, selectedCategory]);

    const handleTokenReset = async () => {
        try {
            await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
            fetchQuestions();
        } catch (error) {
            console.error('Error resetting token:', error);
        }
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);

        if (answer === questions[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
            setFeedback(prev => [...prev, { question: questions[currentQuestionIndex].question, selected: answer, correct: true }]);
        } else {
            setFeedback(prev => [...prev, { question: questions[currentQuestionIndex].question, selected: answer, correct: false }]);
        }

        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedAnswer('');
        } else {
            setShowScore(true);
        }
    };

    const handleSubmitScore = async () => {
        try {
            const response = await axios.post('https://devnext-serverside.onrender.com/api/saveScore', {
                username: name,
                score: score,
                feedback: feedback,
            });
            console.log('Score and answers saved:', response.data);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    useEffect(() => {
        if (showScore) {
            handleSubmitScore();
            alert("Score and answers saved successfully");
        }
    }, [showScore]);

    const handleNewQesutionQuiz = async () => {
        setQuestions([]);
        setScore(0);
        setSelectedAnswer('');
        setCurrentQuestionIndex(0);
        setShowScore(false);
        setFeedback([]);
        await fetchQuestions();
    };

    return (
        <div className="app max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <input
                    placeholder="Enter your name"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4"
                />
            </div>

            <div className="mb-8">
                <label className="block mb-2 text-lg font-medium">Select Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {showScore ? (
                <div className="text-center">
                    <div className="mb-6 text-2xl font-semibold text-green-600">
                        You scored {score} out of {questions.length}
                    </div>
                    <ul className="mb-8 text-left space-y-4">
                        {feedback.map((item, index) => (
                            <li key={index} className={`p-4 rounded-lg shadow-sm ${item.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                                <strong>Question:</strong> <span dangerouslySetInnerHTML={{ __html: item.question }} />
                                <br />
                                <strong>Your Answer:</strong> <span className={item.correct ? 'text-green-700' : 'text-red-700'}>{item.selected}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleNewQesutionQuiz} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg md:w-96 hover:bg-blue-600">
                        Start New Quiz
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <div className="mb-4 text-xl font-semibold text-gray-700">
                            <span>Question {currentQuestionIndex + 1}:</span>/{questions.length}
                        </div>
                        <div
                            className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                            dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex]?.question }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {questions[currentQuestionIndex]?.incorrect_answers.map((answer, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(answer)}
                                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-left"
                                dangerouslySetInnerHTML={{ __html: answer }}
                            />
                        ))}
                        <button
                            onClick={() => handleAnswerClick(questions[currentQuestionIndex]?.correct_answer)}
                            className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md text-left"
                            dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex]?.correct_answer }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Quiz;
