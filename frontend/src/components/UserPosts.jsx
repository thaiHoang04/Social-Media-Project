import React, {useContext, useState} from "react";
import ReactionButton from './ReactionButton';
import CommentButton from './CommentButton';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ListPopup from "./ListPopUp";
import HistoryPopup from '../components/historyPopUp';
import {UserContext} from "../App";
import {Link} from "react-router-dom";
import {FaThumbsUp, FaHeart, FaLaughBeam, FaSadTear, FaAngry, FaEllipsisH} from 'react-icons/fa';
import '../styles/ReactionButtonStyle.css';

const UserPosts = ({posts, setPosts}) => {
    const [menuVisible, setMenuVisible] = useState(null); // Track visibility of menus
    const [editingPostId, setEditingPostId] = useState(null); // Track the post being edited
    const [editContent, setEditContent] = useState("");
    const [visibility, setVisibility] = useState("");

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    const {user} = useContext(UserContext)

    // Function to toggle the menu visibility
    const toggleMenu = (postId) => {
        setMenuVisible((prevState) => (prevState === postId ? null : postId));
    };

    // Function to handle editing a post
    const handleEdit = (postId, currentContent, currentVisibility) => {
        setEditingPostId(postId); // Set the post ID being edited
        setEditContent(currentContent); // Initialize with current post content
        setVisibility(currentVisibility || '');
    };

    // Function to cancel editing a post
    const handleCancelEdit = () => {
            setEditingPostId(null); // Reset the editing post ID
            setEditContent(''); // Clear the content of the editor
            setVisibility('');
        }
    ;

    // Function to handle visibility change
    const handleVisibilityChange = (postId, newVisibility) => {
        setVisibility(newVisibility);
    };

    // Function to fetch history data for a post
    const handleViewHistory = async (postId) => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem("token");

            // Fetch history data for the post
            const response = await fetch(`http://localhost:5000/api/history/posts/${postId}/history`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorText = await response.text(); // Read the response text for debugging
                console.error(`HTTP error! Status: ${response.status}. Response text: ${errorText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setHistoryData(data);
            setShowHistoryModal(true);
        } catch (error) {
            console.error("Error fetching history data:", error);
        }
    };

    // Function to handle deleting a post
    const handleDelete = async (post) => {

        try {
            // Get the token from local storage
            const token = localStorage.getItem("token");

            // Send a DELETE request to the server
            const response = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' // Add Content-Type header if needed
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to delete post: HTTP error! status: ${response.status}`);
            }

            // Remove the deleted post from the posts array
            setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
        } catch (error) {
            console.error(error);
        }
    };

    // Function to save the edited post
    const handleSaveEdit = async (postId) => {
        try {
            // Get the token from local storage
            const token = localStorage.getItem('token');

            // Prepare the updated data
            const updateData = {
                content: editContent,
                visibility: visibility,
            };

            // Send a PUT request to the server
            const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to save changes: HTTP error! status: ${response.status}`);
            }

            // Prepare the history data
            const historyData = {
                postId: postId,
                changes: `Edited content to "${editContent}" and visibility to "${visibility}"`,
            };

            // Send a POST request to save the edit history
            const historyResponse = await fetch('http://localhost:5000/api/history/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(historyData),
            });

            // Check if the response is successful
            if (!historyResponse.ok) {
                throw new Error(`Failed to save edit history: HTTP error! status: ${historyResponse.status}`);
            }

            // Update the post in the posts array
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? {...post, content: editContent, visibility: visibility} : post
                )
            );

            setEditingPostId(null);
        } catch (error) {
            console.error(error);
        }
    };

    //Create notification for the post's author when suer reaction on their post.
    const createNotification = async (postAuthorId) => {
        try {
            // Send a POST request to the server
            const response = await fetch(`http://localhost:5000/api/notifications/create/${postAuthorId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderID: `${user.id}`,
                    type: 'New Reaction Added',
                    message: `${user.username} react on your post`
                })
            });

            // Check if the response is successful
            if (response.ok) {
                console.log('Add reaction successfully');
            } else {
                throw new Error('Failed to add comment');
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Function to handle post reactions
    const onReaction = async (postId, reactionType, postAuthorId) => {
        try {
            // Send a PUT request to the server
            const response = await fetch(`http://localhost:5000/api/posts/reactions/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({type: reactionType}),
            });

            // Check if the response is successful
            if (!response.ok) {
                let queuedReactions = JSON.parse(localStorage.getItem('queuedReactions')) || [];
                queuedReactions.push({
                    url: `http://localhost:5000/api/posts/reactions/${postId}`,
                    method: 'PUT',
                    body: {type: reactionType},
                });
                localStorage.setItem('queuedReactions', JSON.stringify(queuedReactions));
            }

            // Update the post in the posts array
            const updatedPost = await response.json();
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post._id === postId ? updatedPost : post))
            );

            // Create notification for the post's author
            if (postAuthorId !== user.id) {
                await createNotification(postAuthorId)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-4 text-black">
            {posts.length > 0 ? (
                posts.map((post) => {
                    let type = ''; // Initialize type with an empty string
                    if (post.like.includes(user.id)) {
                        type = 'like';
                    } else if (post.love.includes(user.id)) {
                        type = 'love';
                    } else if (post.funny.includes(user.id)) {
                        type = 'funny';
                    } else if (post.sad.includes(user.id)) {
                        type = 'sad';
                    } else if (post.angry.includes(user.id)) {
                        type = 'angry';
                    }

                    const totalComments = post.comments?.length || 0;

                    const isEditing = editingPostId === post._id;

                    return (
                        <div key={post._id} className="mt-4 h-200 border rounded shadow-sm bg-white">
                            <div className='p-4'>
                                <div className='flex justify-between'>
                                    <div className='flex items-center'>
                                        <img
                                            src={post.author.avatar}
                                            alt={`Avatar of ${post.author?.username}`}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <Link className={'hover:underline text-black'}
                                                  to={`/friend/${post.author._id}`}
                                                  state={{friendProfile: post.author}}>{post.author?.username}</Link>
                                        </div>
                                    </div>
                                    {isEditing ? (
                                        <select
                                            value={visibility} // Use the state value for visibility
                                            onChange={(e) => handleVisibilityChange(post._id, e.target.value)}
                                            className="small-select"
                                        >
                                            <option value="Public">Public</option>
                                            <option value="Friends">Friends</option>
                                        </select>
                                    ) : (
                                        <div>
                                            <p>{post.visibility}</p>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <div
                                            onClick={() => toggleMenu(post._id)}
                                        ><FaEllipsisH/></div>

                                        {/* Menu Pop-Up */}
                                        {menuVisible === post._id && (
                                            <ListPopup
                                                post={post}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onViewHistory={handleViewHistory}
                                                closePopup={() => setMenuVisible(null)}
                                            />
                                        )}

                                        {/* HistoryPopup Component */}
                                        {showHistoryModal && (
                                            <HistoryPopup
                                                historyData={historyData}
                                                close={() => {
                                                    setShowHistoryModal(false);
                                                    setHistoryData([])
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div>
                                        <textarea
                                            value={editContent}
                                            defaultValue={post.content}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full rounded p-2 bg-white border-2 border-black mt-2"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() => handleSaveEdit(post._id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-gray-300 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="pt-2">{post.content}</p>
                                )}
                            </div>

                            {post.imageStatus && (
                                <img
                                    src={post.imageStatus}
                                    alt={post.content}
                                    className="w-full h-50 object-cover"
                                />
                            )}

                            <div className='flex justify-between px-4 py-2'>
                                <div className={'flex gap-5'}>
                                    <div className={'flex text-blue-500 gap-2 place-items-center'}>
                                        <FaThumbsUp/>{post.like.length}</div>
                                    <div className={'flex text-red-500 gap-2 place-items-center'}>
                                        <FaHeart/>{post.love.length}</div>
                                    <div className={'flex text-yellow-500 gap-2 place-items-center'}>
                                        <FaLaughBeam/>{post.funny.length}</div>
                                    <div className={'flex text-blue-300 gap-2 place-items-center'}>
                                        <FaSadTear/>{post.sad.length}</div>
                                    <div className={'flex text-red-700 gap-2 place-items-center'}>
                                        <FaAngry/>{post.angry.length}</div>
                                </div>
                                {totalComments > 0 && (
                                    <div className='text-gray-500'>
                                        {totalComments >= 2
                                            ? `${totalComments} comments`
                                            : `${totalComments} comment`}
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-between px-16'>
                                <ReactionButton
                                    type={type} // Specify the type for the ReactionButton
                                    onReaction={(reactionType) => onReaction(post._id, reactionType, post.author._id)}
                                />
                                {/* <CommentButton comments={post.comments} /> */}
                                <CommentButton
                                    post={post} // Pass the post ID to CommentButton
                                    onNewComment={(newComments) => {
                                        // Update the post's comments with the new comments array
                                        setPosts((prevPosts) =>
                                            prevPosts.map((p) =>
                                                p._id === post._id ? {...p, comments: newComments} : p
                                            )
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className='text-center'>No posts yet. Be the first to post something!</p>
            )}
        </div>
    );
}
export default UserPosts;


