import React, {useContext, useState} from 'react';
import PostComment from './PostComments';
import {UserContext} from "../App";

const CommentButton = ({post, onNewComment}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {user} = useContext(UserContext);

    // Open the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Create a notification
    const createNotification = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/create/${post.author._id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderID: `${user.id}`,
                    type: 'New Comment Added',
                    message: `${user.username} commented on your post`
                })
            });
            if (response.ok) {
                console.log('Add comment successfully');
            } else {
                throw new Error('Failed to add comment');
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Handle submitting a comment
    const handleSubmitComment = async (newComment) => {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        try {
            // Call the API to post a comment
            const response = await fetch(`http://localhost:5000/api/posts/${post._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({content: newComment}), // Send the new comment as a JSON object
            });

            // If the response is ok, update the comments in the parent component
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const updatedPost = await response.json();
            onNewComment(updatedPost.comments); // Update the comments in the parent component
            setIsModalOpen(false);
            if (post.author._id !== user.id) {
                await createNotification();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
        // handleCloseModal();
    };

    return (
        <>
            <button className="ml-1" onClick={handleOpenModal}>
                {/* {isModalOpen && <PostComment onSubmit={handleSubmitComment} />} */}
                Comment
            </button>
            <PostComment
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitComment}
                comments={post.comments}
            />
        </>
    );
};

export default CommentButton;
