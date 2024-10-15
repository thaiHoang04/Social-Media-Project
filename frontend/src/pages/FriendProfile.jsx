import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import UserPosts from "../components/UserPosts";
import React, {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {UserContext} from "../App";
import {UnFriendButton} from "../components/UnFriendButton";
import {AddFriendButton} from "../components/AddFriendButton";

export default function FriendProfile() {
    const location = useLocation();
    const {user, posts} = useContext(UserContext);
    const {friendProfile} = location.state;
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [isFriend, setIsFriend] = useState(false);
    let button;

    const navigate = useNavigate()

    // Fetch friend's information and check if this friend's profile is a friend's information of the current user
    useEffect(() => {
        fetchFriendsInfo();
        checkIsFriend();
    }, [friendProfile]);

    // Function to check if this friend's profile is a friend's information of the current user
    const checkIsFriend = () => {
        if (user.friends.includes(friendProfile._id)) {
            setIsFriend(true);
        } else {
            setIsFriend(false);
        }
    }

    // Function to unfriend
    const handleUnFriend = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/friends/unfriend/${friendProfile._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: user.id})
            });
            if (response.ok) {
                console.log('Unfriend successfully');
                user.friends = user.friends.filter((friendId) => friendId !== friendProfile._id);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/userprofile')
            } else {
                throw new Error('Failed to unfriend');
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Get all the friend info.
    const fetchFriendsInfo = async () => {
        try {
            const friendsData = await Promise.all(
                friendProfile.friends.map(async (friendId) => {
                    const response = await fetch(`http://localhost:5000/api/friends/${friendId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json()
                        return data.friend;
                    } else {
                        throw new Error('Failed to fetch friend information');
                    }
                })
            );
            setFriendsInfo(friendsData);
        } catch (error) {
            console.error(error);
        }
    };

    if (user.id !== friendProfile._id) {
        button = isFriend ? <UnFriendButton handleUnFriend={handleUnFriend}/> :
            <AddFriendButton friendID={friendProfile._id} userID={user.id}/>
    } else {
        navigate('/userprofile')
    }

    return (
        <>
            <div>
                <NavBar/>
                <div className={'bg-white border-b-2 border-gray-300 border-opacity-50'}>
                    {/*Avatar*/}
                    <div>
                        <img className=" absolute rounded-full bg-red-500 ml-5 mt-44 w-40 h-40"
                             src="https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg"
                             alt={'img'}
                        />
                    </div>
                    {/*Cover picture*/}
                    <div>
                        <img className="object-cover w-full h-56 place-items-end justify-end"
                             src="https://png.pngtree.com/thumb_back/fh260/background/20230615/pngtree-landscape-landscape-photo-image_2902263.jpg"
                             alt={'img'}/>
                    </div>
                    <div className={'flex justify-between w-full h-32'}>
                        <div
                            className={'inline-block ml-48 pt-7 font-bold text-black text-4xl'}>{friendProfile.username}</div>
                        <div className={'max-h-24 m-5'}>
                            {button}
                        </div>
                    </div>
                </div>
                <div className={'h-fit bg-gray-100'}>
                    <div className={'flex w-full columns-2xs'}>
                        {/*Information and friend*/}
                        <div className={'w-1/2'}>
                            <div className="w-full max-w-md bg-gray-50 rounded-xl shadow-md py-8 px-8 mt-8 ml-8 mr-8">
                                <h2 className={'text-[28px] font-bold text-black mb-6 text-center'}>Information</h2>
                                <div>
                                    <div className={'flex justify-between mt-4'}>
                                        <div className={'text-black font-bold'}>Name:</div>
                                        <div className={'text-black'}>{friendProfile.username}</div>
                                    </div>
                                    <div className={'flex justify-between mt-4'}>
                                        <div className={'text-black font-bold'}>Email:</div>
                                        <div className={'text-black'}>{friendProfile.email}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full max-w-md bg-gray-50 rounded-xl shadow-md py-8 px-8 mt-8 ml-8 mr-8">
                                <h2 className={'text-[28px] font-bold text-black mb-6 text-center'}>Friend</h2>
                                <div className={'grid grid-cols-3 gap-2'}>
                                    {friendsInfo.map((friend) => (
                                        <>
                                            <UserCard key={friend.id} friend={friend}/>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={'w-full ml-3'}>
                            <div className={'grid grid-cols-1 w-11/12 m-8 rounded-xl'}>
                                <UserPosts
                                    posts={isFriend ? posts.filter(post => post.author._id === friendProfile._id && post.groupId === 'None') : posts.filter(post => post.author._id === friendProfile._id && post.visibility === 'Public' && post.groupId === 'None')}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}