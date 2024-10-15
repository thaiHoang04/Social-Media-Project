import React, {useState} from 'react';

const PostComment = ({isOpen, onClose, onSubmit, comments}) => {
    const [newComment, setNewComment] = useState('');

    // If the modal is not open, return null to prevent rendering
    if (!isOpen) return null;

    // Handle new comment submission
    const handleSubmit = () => {
        if (newComment.trim()) {
            onSubmit(newComment); // Call the provided onSubmit function
            setNewComment(''); // Clear the text area after submission
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg w-96">
                <div className='flex justify-between'>
                    <div>
                        <h3 className="text-lg font-bold">Comments</h3>
                    </div>

                    {/* Close Button */}
                    <div>
                        <button className="bg-gray-500 text-white py-1 px-3 rounded mr-2" onClick={onClose}>
                            X
                        </button>
                    </div>
                </div>
                {/* Display Comments */}
                <div className="px-4 py-2">
                    {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex border items-start mt-2">
                                <img
                                    src={comment.avatar}
                                    alt={`Avatar of ${comment.username}`}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold">{comment.username}</p>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                </div>

                <div className='flex justify-center items-center'>
                    {/* New Comment Input */}
                    <textarea
                        className="w-full h-12 p-2 rounded mb-2 bg-gray-300 text-black border-2 border-black"
                        placeholder="Write your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>

                    {/* Submit Button */}
                    <div className="rounded">
                        <button
                            className="bg-blue-500 text-white py-1 px-3 rounded"
                            onClick={handleSubmit}
                        >
                            Comment
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostComment;