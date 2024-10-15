import React from 'react';
import UserCard from "./UserCard";

const FriendSidebar = ({friends, userNotFriends}) => {
    return (
        <>
            <div className="w-full max-w-md bg-gray-50 rounded-xl shadow-md py-8 px-8">
                <h2 className={'text-[28px] font-bold text-black mb-6 text-center'}>Friend</h2>
                <div className={'grid grid-cols-3 gap-2'}>
                    {friends.map((friend) => (
                        <>
                            <UserCard key={friend._id} friend={friend}/>
                        </>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-md bg-gray-50 rounded-xl shadow-md py-8 px-8 mt-4">
                <h2 className={'text-[28px] font-bold text-black mb-6 text-center'}>Recommendation Friends</h2>
                <div className={'grid grid-cols-3 gap-2'}>
                    {userNotFriends.map((friend) => (
                        <>
                            <UserCard key={friend._id} friend={friend}/>
                        </>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FriendSidebar;
