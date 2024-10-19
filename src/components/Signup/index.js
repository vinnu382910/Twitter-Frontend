import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './index.css'

const Signup = () => {

    const navigate = useNavigate();
    const [signupInfo, setSignupInfo] = useState({
        username: '',
        email: '',
        password: '',
        gender: '',
    });

    const onChangeInputVal = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { username, email, password, gender } = signupInfo;
        if (!username || !email || !password || !gender) {
            handleError('Username, email, password, and gender are required!');
            return;
        }
        try {
            const url = "http://localhost:8080/auth/signup";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const results = await response.json();
            const { message, success, error } = results;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const errMsg = error?.details[0].message;
                handleError(errMsg);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className='signup-container'>
            <div className='container'>
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input
                            onChange={onChangeInputVal}
                            type='text'
                            name='username'
                            autoFocus
                            placeholder='Enter your username...'
                            value={signupInfo.username}
                        />
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={onChangeInputVal}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={signupInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={onChangeInputVal}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={signupInfo.password}
                        />
                    </div>
                    <div>
                        <label htmlFor='gender'>Gender</label>
                        <select name='gender' value={signupInfo.gender} onChange={onChangeInputVal}>
                            <option value=''>Select your gender</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>
                    <button type='submit'>Signup</button>
                    <p>Already have an account? 
                        <span className='login'><Link to="/login"> Login</Link></span>
                    </p>
                </form>
                <ToastContainer />
            </div>
        </div>
    )
}

export default Signup;
