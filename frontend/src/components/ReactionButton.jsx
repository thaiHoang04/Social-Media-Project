import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FaThumbsUp, FaHeart, FaLaughBeam, FaSadTear, FaAngry} from 'react-icons/fa';
import '../styles/ReactionButtonStyle.css';

const reactionStyles = {
    like: {text: "Like", color: "text-blue-500", icon: <FaThumbsUp/>},
    love: {text: "Love", color: "text-red-500", icon: <FaHeart/>},
    funny: {text: "Funny", color: "text-yellow-500", icon: <FaLaughBeam/>},
    sad: {text: "Sad", color: "text-blue-300", icon: <FaSadTear/>},
    angry: {text: "Angry", color: "text-red-700", icon: <FaAngry/>}
};

const ReactionButton = ({type, onReaction}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState(null);

    // Set the selected reaction based on the initial type
    useEffect(() => {
        setSelectedReaction(type);
    }, [type]);

    // Handle the reaction button click
    const handleReactionClick = (reactionType) => {
        if (selectedReaction === reactionType) {
            // Deselect the current reaction
            setSelectedReaction(null);
            // setCount(0); // Reset count when deselected
            onReaction(null);
        } else {
            setSelectedReaction(reactionType);
            // setCount(1); // Always set count to 1 for the selected reaction
            onReaction(reactionType);
        }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Determine the text, color, and icon based on the current selection
    const {text, color, icon} = reactionStyles[selectedReaction] || {
        text: "Like",
        color: "text-gray-500",
        icon: <FaThumbsUp/>
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="reaction-button-container"
        >
            <button
                onClick={() => handleReactionClick(selectedReaction || 'like')} // Default to 'like' if no reaction is selected
                className={`reaction-button ${color} ${selectedReaction ? 'active' : ''}`}
            >
                <span className="reaction-button-icon">{icon}</span>
                <span className="ml-1">{text}</span>
            </button>

            {isHovered && (
                <div className="reaction-popup-menu">
                    {Object.entries(reactionStyles).map(([key, {icon, color}]) => (
                        <button
                            key={key}
                            onClick={() => handleReactionClick(key)}
                            className={`reaction-popup-item ${color} ${selectedReaction === key ? 'active' : ''}`}
                        >
                            <span className="reaction-button-icon">{icon}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

ReactionButton.propTypes = {
    onReaction: PropTypes.func.isRequired,
};

export default ReactionButton;