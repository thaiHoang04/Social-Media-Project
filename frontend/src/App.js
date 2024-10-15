import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';
import Group from './pages/Group';
import FriendProfile from './pages/FriendProfile';
import AboutUsPage from './pages/AboutUsPage';
import MembersPage from './pages/MembersPage';
import {createContext, useEffect, useState} from "react";
import {NotFoundPage} from "./pages/NotFoundPage";
import CreateGroupPage from './pages/CreateGroupPage';

export const UserContext = createContext(undefined);

function App() {
    // Fetch user from local storage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {};
    });

    // Fetch all posts from the local storage
    const [posts, setPosts] = useState(() => {
        const savedPosts = localStorage.getItem('posts');
        return savedPosts ? JSON.parse(savedPosts) : {};
    })

    // Fetch all posts from the database
    const fetchAllPosts = async () => {
        try {
            // Fetch all posts from the database
            const response = await fetch('http://localhost:5000/api/posts/get', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })

            // If the response is ok, set the posts to the data
            if (response.ok) {
                const data = await response.json()
                setPosts(data)
                localStorage.setItem('posts', JSON.stringify(posts));
            }

        } catch (error) {
            console.error('Error creating post:', error);
        }
    }

    // Fetch all posts and user from the local storage
    useEffect(() => {
        fetchAllPosts();
        localStorage.setItem('user', JSON.stringify(user));
    }, [user, posts]);

    return (
        <UserContext.Provider value={{user, setUser, posts, setPosts}}>
            <Router>
                <Routes>
                    <Route path="/homepage" element={<HomePage/>}/>
                    <Route path="/admin" element={<AdminDashboard/>}/>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/userprofile" element={<UserProfile/>}/>
                    <Route path="/friend/:friendID" element={<FriendProfile/>}/>
                    <Route path="/group/:groupID" element={<Group/>}/>
                    <Route path="/members/:groupID" element={<MembersPage/>}/>
                    <Route path="/aboutus/:groupID" element={<AboutUsPage/>}/>
                    <Route path="/creategroup" element={<CreateGroupPage/>}/>
                    <Route path={'*'} element={<NotFoundPage/>}/>
                </Routes>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
