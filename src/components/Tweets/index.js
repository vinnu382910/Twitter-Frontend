import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils";
import './index.css';

const Tweets = () => {
    const navigate = useNavigate();
    const [tweets, setTweets] = useState([]); // State to store API results
    const [loggedInUser, setLogedInUser] = useState('');

    useEffect(() => {
        setLogedInUser(localStorage.getItem('loggedInUser'))
    }, [])
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout')
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const fetchTweets = async () => {
        try {
            const url = 'http://localhost:8080/tweets/?tweetId=';
            const headers = {
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            };
            const response = await fetch(url, headers);
            const result = await response.json();
            setTweets(result); // Storing the API results in state
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    return (
        <div className="home-container">
            <div className="header">
                <h1 className="home-title">Home Page</h1>
                <h2 className="welcome-message">Welcome</h2>
                <h2>Welcome {loggedInUser}</h2>
            </div>
            <div className="tweets-container">
                {tweets.length > 0 ? (
                    tweets.map((tweet) => (
                        <div key={tweet._id} className="tweet-card">
                            <p className="tweet-username"><strong>Username:</strong> {tweet.username || "Anonymous"}</p>
                            <p className="tweet-content"><strong>Tweet:</strong> {tweet.tweet}</p>
                            <div className="tweet-stats">
                                <p className="tweet-likes"><strong>Likes:</strong> {tweet.likes}</p>
                                <p className="tweet-retweets"><strong>Retweets:</strong> {tweet.retweets}</p>
                            </div>
                            <p className="tweet-date"><strong>Date Posted:</strong> {new Date(tweet.date_time).toLocaleString()}</p>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ))
                ) : (
                    <p className="no-tweets">No tweets available</p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Tweets;
