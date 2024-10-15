import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import '../styles/MembersBox.css';
import {useParams} from 'react-router-dom';
import {UserContext} from "../App";

const MembersBox = () => {
    const {user} = useContext(UserContext);
    const {groupID} = useParams();
    const [members, setMembers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);

    // Fetch group members and admin on component mount
    useEffect(() => {
        fetchGroup();
        fetchAdmin();
    }, [user, groupID]);

    const fetchGroup = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/groups/${groupID}/members`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Group not found');
            }
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchAdmin = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/groups/admin/${groupID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Admin not found');
            }
            const {adminId} = await response.json();
            setIsAdmin(user.id === adminId);
        } catch (error) {
            console.error('Error fetching admin:', error.message);
        }
    };


    const handleRemoveMember = async (memberId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupID}/members/${memberId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
            window.location.reload();
        } catch (error) {
            console.error('Error removing member:', error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="containerBox">
            <div className="membersBox">
                <h1>Members:</h1>
                <div className="scrollableBox">
                    {members.map((member) => (
                        <div key={member._id} className="memberContainer">
                            <p>{member.username}</p>
                            {isAdmin && (
                                <button
                                    className="removeButton1"
                                    onClick={() => handleRemoveMember(member._id)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MembersBox;