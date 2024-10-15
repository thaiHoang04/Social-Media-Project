import React from "react";

export const UnFriendButton = ({ handleUnFriend}) => {
    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg m-3"
            onClick={() => handleUnFriend()}>
            Unfriend
        </button>
    )
}