import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../App';
import '../styles/CreateGroupPage.css';

const NewGroupForm = () => {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('Public');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newGroup = {
            name: groupName,
            description,
            visibility,
            adminId: user.id,
            isApproved: false,
            status: 'Pending',
        };

        try {
            await fetch('http://localhost:5000/api/groups/creategroup',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newGroup)
            });
            await createNotification();
            setSuccessMessage('Group created successfully!');
            setError(null);
            setGroupName('');
            setDescription('');
            setVisibility('Public');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating group');
            setSuccessMessage(null);
        }
    };

    //Create notification for the post's author when suer reaction on their post.
    const createNotification = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/create/66d8107195bef057ee17b514`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    senderID: `${user.id}`,
                    type: 'New Group Creation Request Added',
                    message: `${user.username} sent the create group request`
                })
            });
            if (response.ok) {
                console.log('Add group successfully');
            } else {
                throw new Error('Failed to add comment');
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="createGroupContainer">
            <h1 className='headerH1'>Create New Group</h1>
            <div className='headerLine'>
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groupName">Group Name</label>
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="visibility">Visibility</label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <div className='buttonContainer'>
                    <button className='returnButton' onClick={() => navigate('/homepage')}>Go Back to Homepage</button>
                    <button type="submit" className='submitButton'>Create Group</button>
                </div>
            </form>
        </div>
    );
};

export default NewGroupForm;