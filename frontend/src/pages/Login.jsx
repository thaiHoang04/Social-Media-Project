import React, {useContext, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {UserContext} from "../App";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    // Function to update account information
    const updateAccountInfo = (e) => {
        const {name, value} = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Function to handle show password
    const handleOnClick = () => {
        setShowPassword(!showPassword);
    };

    // Function to handle login
    const login = async (e) => {
        e.preventDefault();

        try {
            // Send login request
            const response = await axios.post('http://localhost:5000/api/auth/login', {email, password});

            // Save the token to localStorage
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);

            // Redirect based on user role
            if (response.data.user.isAdmin) {
                console.log("Admin login successful");
                navigate('/admin'); // Redirect to admin dashboard
            } else {
                console.log("Regular user login successful");
                navigate('/homepage'); // Redirect to homepage for normal users
            }
        } catch (error) {
            console.log('Error occurred during login:', error);
            if (error.response && error.response.status === 403) {
                setError('Your account has been suspended. Please contact support.');
            } else if (error.response && error.response.status === 400) {
                setError('Invalid email or password.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <div className={'flex h-dvh columns-2'}>
                <div className={'relative'}>
                    <div className={'w-full h-full absolute text-4xl text-blue-950 font-bold m-4'}>
                        SmileBook
                    </div>
                    <div className={'w-full h-full absolute text-center place-content-center'}>
                        <div className={'text-blue-950 font-bold text-6xl text-center'}>
                            Welcome Page
                        </div>
                        <div className={'text-blue-950 font-bold text-center text-2xl mt-10'}>
                            Sign in to continue access our services
                        </div>
                    </div>
                    <img className={'w-full h-full'}
                         src="https://img.freepik.com/free-vector/blue-pink-halftone-background_53876-144365.jpg?t=st=1724341655~exp=1724345255~hmac=ace77f146c20e45804647f51d5e8a32e16a6a63847c890d4766d41ada9cc190f&w=1380"
                         alt={'img'}/>
                </div>
                <div className={'w-4/12 content-center bg-white'}>
                    <div className={'m-3'}>
                        <h2 className={'text-[28px] font-bold text-black mb-6 text-center'}>Log In</h2>
                        <form className={'flex flex-col'}>
                            <input
                                placeholder={'Email'}
                                className={'bg-gray-100 text-black border-0 rounded-md p-2 mb-4 focus:outline-none transition ease-in duration-150 placeholder-gray-300'}
                                name={'email'}
                                type='text'
                                onChange={updateAccountInfo}
                            />
                            <div className={'flex space-x-4'}>
                                <input
                                    placeholder={'Password'}
                                    className={'bg-gray-100 text-black border-0 rounded-md p-2 mb-4 w-11/12 focus:outline-none transition ease-in duration-150 placeholder-gray-300'}
                                    name={'password'}
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={updateAccountInfo}
                                />
                                <button type={'button'} className={'place-items-center'} onClick={handleOnClick}>
                                    {showPassword ? <FaEye className={'text-black text-2xl'}/> :
                                        <FaEyeSlash className={'text-black text-2xl'}/>}
                                </button>
                            </div>
                            <p className={'text-red-600 text-[12px]'}>{error}</p>
                            <button
                                className={'bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium py-2 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in duration-200'}
                                type="submit"
                                onClick={login}
                            >
                                Log In
                            </button>
                            <div className={'divider'}></div>
                            <button
                                className={'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium py-2 rounded-md hover:bg-emerald-600 hover:to-green-600 transition ease-in duration-200'}
                                type="button"
                            >
                                <Link to={'/signup'}>Create New Account</Link>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
