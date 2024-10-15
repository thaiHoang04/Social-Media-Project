import {UserContext} from "../App";
import {useContext} from "react";

export default function FriendRequestCard({friendRequest, notifications, setNotifications}) {
    const {user, setUser} = useContext(UserContext);

    // Update the notifications
    const updateNotifications = (updatedFriendRequest) => {
        const index = notifications.findIndex(notification => notification._id === friendRequest._id);
        notifications[index] = updatedFriendRequest;
        setNotifications([...notifications]);
    }

    // Handle accepting a friend request
    const onAccept = async () => {
        try {
            // Call the API to accept the friend request
            const response = await fetch(`http://localhost:5000/api/notifications/friend/accept/${user.id}/${friendRequest.senderID._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

            // If the response is ok, update the notifications and the user's friends
            if (response.ok) {
                const data = await response.json();
                updateNotifications(data);
                const userTemp = {...user};
                userTemp.friends = [...user.friends, friendRequest.senderID._id];
                setUser(userTemp);
                console.log('Friend request accepted');
            } else {
                throw new Error('Failed to accept friend request');
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Handle rejecting a friend request
    const onReject = async () => {
        try {
            // Call the API to reject the friend request
            const response = await fetch(`http://localhost:5000/api/notifications/friend/reject/${user.id}/${friendRequest.senderID._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

            // If the response is ok, update the notifications
            if (response.ok) {
                const data = await response.json();
                updateNotifications(data);
                console.log('Friend request rejected.');
            } else {
                throw new Error('Failed to accept friend request');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={'flex-auto rounded-md w-450 bg-gray-300 mt-2 mb-2'}>
            <div className={'flex-auto justify-center items-center m-2 w-450'}>
                <div className={'flex items-center'}>
                    <img className={'h-9 w-9 rounded-lg  mt-2'} src={`${friendRequest.senderID.avatar}`} alt={'img'}/>
                    <span
                        className={'mt-2 ml-4'}>{`${friendRequest.senderID.username} sent you a friend request.`}</span>
                </div>
                <div className={'block-flex mt-2'}>
                    <div className={'flex'}>
                        <button className={'grow bg-green-500 text-white rounded-md p-2 hover:bg-green-900 mb-2'}
                                onClick={onAccept}>Accept
                        </button>
                        <button className={'grow bg-red-500 text-white rounded-md p-2 hover:bg-red-700 ml-2 mb-2'}
                                onClick={onReject}>Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}