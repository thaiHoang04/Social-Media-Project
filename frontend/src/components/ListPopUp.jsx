import React, {useRef, useEffect, useContext} from 'react';
import {UserContext} from "../App";

const ListPopup = ({post, onEdit, onViewHistory, onDelete, closePopup}) => {
    const popupRef = useRef(null);
    const {user} = useContext(UserContext)

    // Close the popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup(); // Close the popup when clicking outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closePopup]);

    return (
        <div
            ref={popupRef}
            className="absolute right-0 mt-2 w-52 bg-white border border-gray-300 rounded shadow-lg"
        >
            {
                user.id === post.author._id &&
                <button
                    onClick={() => {
                        onEdit(post._id, post.content, post.visibility);
                        closePopup(); // Close the popup after action
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                    Edit Post
                </button>
            }
            <button
                onClick={() => {
                    onViewHistory(post._id);
                    closePopup(); // Close the popup after action
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
                View Edit History
            </button>
            {
                (user.id === post.author._id) && <button
                    onClick={() => {
                        onDelete(post);
                        closePopup(); // Close the popup after action
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                    Delete Post
                </button>
            }
        </div>
    );
};

export default ListPopup;
