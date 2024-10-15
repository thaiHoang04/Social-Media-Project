import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import NavBar from '../components/NavBar';
import PostingArea from '../components/PostingArea';
import UserPosts from '../components/UserPosts';
import GroupHeaderBox from '../components/GroupHeaderBox';
import {useContext} from 'react';
import {UserContext} from '../App';
import GroupHeaderBoxForPrivate from '../components/GroupHeaderBoxForPrivate.jsx';
import "../styles/Group.css";


const Group = () => {
    const {user, posts, setPosts} = useContext(UserContext);
    const {groupID} = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const [sentRequest, setSentRequest] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch group information
    useEffect(() => {
        fetchGroup();
    }, [user, groupID]);

    // Function to fetch group information
    const fetchGroup = async () => {
        try {
            // Fetch group information
            const response = await fetch(`http://localhost:5000/api/groups/get/${groupID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Check if group is not found
            if (!response.ok) {
                throw new Error('Group not found');
            }
            // Parse response
            const data = await response.json();
            setGroup(data);

            // Check if user has sent request to join group
            if (data.requestList.includes(user.id)) {
                setSentRequest(true);
            }
            setError(null);

            // Check if user is a member of the group
            if (data.members.includes(user.id)) {
                setIsMember(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to handle request to join group
    const handleRequest = async () => {
        try {
            // Send request to join group
            await fetch(`http://localhost:5000/api/groups/${groupID}/requests/${user.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSentRequest(true);
            setSuccessMessage('Request to join the group has been sent!');
            setError(null);
            await createNotification();
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Error sending request. Please try again later.');
            } else {
                setError('Error sending request. Please try again later.');
            }
            setSuccessMessage(null);
        }
    };

    // Function to create notification
    const createNotification = async () => {
        try {
            // Create notification for the group admin
            const response = await fetch(`http://localhost:5000/api/notifications/create/${group.admin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    senderID: `${user.id}`,
                    type: 'New Join Group Request',
                    message: `${user.username} sent the join group request ${group.name}`
                })
            });

            // Check if notification is created successfully
            if (response.ok) {
                console.log('Add group request successfully');
            } else {
                throw new Error('Failed to add group request');
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div style={{background: '#B9D9DC'}}>
            <NavBar/>
            {group && (group.visibility === 'Public' || isMember) ? (
                <>
                    <GroupHeaderBox group={group}/>
                    <div className={'flex place-content-center'}>
                        {sentRequest && <p className="success">Request to join the group has been sent!</p>}
                        {
                            ((!sentRequest && !group.members.includes(user.id))) && <div>
                                <button className='returnButton' onClick={() => navigate('/homepage')}>Go Back to Homepage
                                </button>
                                &nbsp;
                                <button onClick={handleRequest} className="requestButton">
                                    Request to Join Group?
                                </button>
                            </div>
                        }
                    </div>
                    <div className="grid grid-cols-12 gap-4 p-4">
                        <div className="col-span-3"></div>
                        <div className="col-span-6 place-items-center">
                            {
                                group.members.includes(user.id) ?
                                    <>
                                        <PostingArea groupID={`${group._id}`}/>
                                        <UserPosts posts={posts.filter((post) => post.groupId === group._id)}
                                                   setPosts={setPosts}/>
                                    </>
                                    :
                                    <UserPosts posts={posts.filter((post) => post.groupId === group._id)}/>
                            }
                        </div>

                        <div className="col-span-3"></div>
                    </div>
                </>
            ) : group && !isMember ? (
                <>
                    <GroupHeaderBoxForPrivate group={group}/>
                    <div className="requestContainer1">
                        <div>
                            <h2>You cannot view this group.</h2>
                            <p>This group is private, and you are not a member.</p>
                            <div>
                                <div className={'flex place-content-center'}>
                                    {sentRequest && <p className="success">Request to join the group has been sent!</p>}
                                    {
                                        ((!sentRequest && !group.members.includes(user.id))) && <div>
                                            <button className='returnButton' onClick={() => navigate('/homepage')}>Go Back
                                                to Homepage
                                            </button>
                                            &nbsp;
                                            <button onClick={handleRequest} className="requestButton">
                                                Request to Join Group?
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                            {error && <p className="error">{error}</p>}
                            {successMessage && <p className="success">{successMessage}</p>}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Group;