import React, {useState, useEffect} from 'react';
import NavBar from "../components/NavBar"


function AdminDashboard() {
    // Set states
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isPendingGroupModalOpen, setIsPendingGroupModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [pendingGroups, setPendingGroups] = useState([]);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState(null);
    const [error, setError] = useState(null);

    // Open/Close modal functions
    const openUserModal = () => setIsUserModalOpen(true);
    const closeUserModal = () => setIsUserModalOpen(false);

    const openContentModal = () => setIsContentModalOpen(true);
    const closeContentModal = () => setIsContentModalOpen(false);

    const openGroupModal = () => setIsGroupModalOpen(true);
    const closeGroupModal = () => setIsGroupModalOpen(false);

    const openPendingGroupModal = () => setIsPendingGroupModalOpen(true);
    const closePendingGroupModal = () => setIsPendingGroupModalOpen(false);

    const openCommentModal = (postId) => {
        setPostId(postId);
        fetchComments(postId);
        setIsCommentModalOpen(true);
    };
    const closeCommentModal = () => setIsCommentModalOpen(false);

    // Fetch users, posts, groups, and pending groups
    useEffect(() => {
        if (isUserModalOpen) fetchUsers();
        if (isContentModalOpen) fetchPosts();
        if (isGroupModalOpen) fetchAllGroups();
        if (isPendingGroupModalOpen) fetchPendingGroups();
    }, [isUserModalOpen, isContentModalOpen, isGroupModalOpen, isPendingGroupModalOpen]);

    // Fetch user function
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError('Error fetching users: ' + error.message);
        }
    };

    // Suspend user function
    const toggleSuspension = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/suspend`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to suspend user');
            }

            // Update users state after suspending
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? {...user, isSuspended: true} : user
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    // Resume user function
    const resumeUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/resume`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to resume user');
            }

            // Update users state after resuming
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? {...user, isSuspended: false} : user
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };


    // Fetch posts functions
    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data);
        } catch (error) {
            setError(error.message);
        }
    };


    // Delete posts functions
    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Update the posts state after successfully deleting the post
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (error) {
            setError(error.message);
        }
    };


    // Fetch all group function
    const fetchAllGroups = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/groups', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch groups');
            const data = await response.json();
            setGroups(data);
        } catch (error) {
            setError('Error fetching groups: ' + error.message);
        }
    };

    // Fetch pending group function
    const fetchPendingGroups = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/groups/pending', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch pending groups');
            const data = await response.json();
            setPendingGroups(data);
        } catch (error) {
            setError('Error fetching pending groups: ' + error.message);
        }
    };


    // Approving group function
    const approveGroup = async (groupId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/groups/${groupId}/approve`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to approve group');
            alert('Group approved successfully');
            fetchPendingGroups();
        } catch (error) {
            setError(error.message);
        }
    };


    // Delete group function
    const deleteGroup = async (groupId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/groups/${groupId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete group');
            }

            // Update the state to remove the deleted group from the list
            setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
        } catch (error) {
            setError(error.message);
        }
    };


    // Notification function
    // const updateApproveNotification = async (groupAuthorId) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/api/notifications/admin/group/approve/${groupAuthorId}/${user.id}`, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //         if (response.ok) {
    //             console.log('Create group request approved successfully.');
    //         } else {
    //             throw new Error('Failed to approve create group request.');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }


    // Comment fetching function
    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Deleting comment function
    const deleteComment = async (postId, commentId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            // Update the comments state after successfully deleting the comment
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: post.comments.filter((comment) => comment._id !== commentId),
                        }
                        : post
                )
            );
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            setError('Error deleting comment: ' + error.message);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <NavBar/>
            <h1 className="text-3xl font-bold mt-8 mb-8 text-center">Admin Dashboard</h1>

            {/* Manage Users, Content, Groups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Suspend/Resume Users</h2>
                    <button onClick={openUserModal} className="bg-blue-600 text-white py-2 px-4 rounded">Open Users
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Manage Content</h2>
                    <button onClick={openContentModal} className="bg-blue-600 text-white py-2 px-4 rounded">Open
                        Content
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Pending Group Approvals</h2>
                    <button onClick={openPendingGroupModal} className="bg-blue-600 text-white py-2 px-4 rounded">Open
                        Group Approvals
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Delete Groups</h2>
                    <button onClick={openGroupModal} className="bg-blue-600 text-white py-2 px-4 rounded">Open Groups
                    </button>
                </div>
            </div>

            {/* User Management Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Suspend/Resume Users</h2>
                        {error && <p className="text-red-600">{error}</p>}
                        <ul>
                            {users.map(user => (
                                <li key={user._id} className="flex justify-between items-center mb-2">
                                    <span>{user.username} - {user.isSuspended ? 'Suspended' : 'Active'}</span>
                                    <button
                                        onClick={() => {
                                            if (user.isSuspended) {
                                                resumeUser(user._id);
                                            } else {
                                                toggleSuspension(user._id);
                                            }
                                        }}
                                        className={`text-sm ${user.isSuspended ? 'bg-green-600' : 'bg-red-600'} text-white py-1 px-2 rounded`}
                                    >
                                        {user.isSuspended ? 'Resume' : 'Suspend'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closeUserModal} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Posts Management Modal */}
            {isContentModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Manage Content</h2>
                        {error && <p className="text-red-600">{error}</p>}
                        <ul>
                            {posts.map(post => (
                                <li key={post._id} className="flex justify-between items-center mb-2">
                                    <span>{post.content}</span>
                                    <button
                                        onClick={() => deletePost(post._id)}
                                        className="text-sm bg-red-600 text-white py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            openCommentModal(post._id);
                                            setComments(post.comments)
                                        }}
                                        className="text-sm bg-blue-600 text-white py-1 px-2 rounded"
                                    >
                                        Manage Comments
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closeContentModal} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Group management and deletion */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Delete Groups</h2>
                        {error && <p className="text-red-600">{error}</p>}
                        <ul>
                            {groups.map(group => (
                                <li key={group._id} className="flex justify-between items-center mb-2">
                                    <span>{group.name}</span>
                                    <button
                                        onClick={() => deleteGroup(group._id)}
                                        className="text-sm bg-red-600 text-white py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closeGroupModal} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Pending Group Approvals */}
            {isPendingGroupModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Pending Group Approvals</h2>
                        {error && <p className="text-red-600">{error}</p>}
                        <ul>
                            {pendingGroups.map(group => (
                                <li key={group._id} className="flex justify-between items-center mb-2">
                                    <span>{group.name}</span>
                                    <button onClick={() => approveGroup(group._id)}
                                            className="bg-green-600 text-white py-1 px-2 rounded">Approve
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closePendingGroupModal}
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">Close
                        </button>
                    </div>
                </div>
            )}


            {/* Comment Management Modal */}
            {isCommentModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Manage Comments</h2>
                        {error && <p className="text-red-600">{error}</p>}
                        <ul>
                            {comments.map(comment => (
                                <li key={comment._id} className="flex justify-between items-center mb-2">
                                    <span>{comment.content}</span>
                                    <button
                                        onClick={() => deleteComment(postId, comment._id)}
                                        className="text-sm bg-red-600 text-white py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closeCommentModal} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
