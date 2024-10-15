import NavBar from '../components/NavBar';
import GroupHeaderBox from '../components/GroupHeaderBox';
import MembersBox from '../components/MembersBox.jsx';
import {useParams} from 'react-router-dom';
import React, {useEffect, useState, useContext} from 'react';
import RequestListBox from '../components/RequestListBox.jsx';
import {UserContext} from "../App";


const MembersPage = () => {
    const {user} = useContext(UserContext);
    const {groupID} = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch group and admin information
    useEffect(() => {
        fetchGroup();
        fetchAdmin();
    }, [user, groupID]);

    // Function to fetch group information
    const fetchGroup = async () => {
        try {
            // Fetch group information
            const response = await fetch(`http://localhost:5000/api/groups/get/${groupID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            // Check if group is not found
            if (!response.ok) {
                throw new Error('Group not found');
            }

            // Parse response
            const data = await response.json();
            setGroup(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to fetch admin information
    const fetchAdmin = async () => {
        try {
            // Fetch admin information
            const response = await fetch(`http://localhost:5000/api/groups/admin/${groupID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            // Check if admin is not found
            if (!response.ok) {
                throw new Error('Admin not found');
            }

            // Parse response
            const {adminId} = await response.json();
            setIsAdmin(user.id === adminId);
        } catch (error) {
            console.error('Error fetching admin:', error.message);
        }
    };

    return (
        <div style={{background: '#B9D9DC'}}>
            <NavBar/>
            <GroupHeaderBox group={group}/>
            <div className="grid grid-cols-12 gap-4 p-4">
                <div className="col-span-3"></div>
                <div className="col-span-6">
                    <div className="mb-4"></div>
                    <MembersBox group={group}/>
                    {isAdmin && <RequestListBox group={group}/>}
                </div>
                <div className="col-span-3"></div>
            </div>
        </div>
    );
};

export default MembersPage;