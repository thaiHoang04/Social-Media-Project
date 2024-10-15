import {useNavigate} from "react-router-dom";

export default function UserCard({ friend }) {
    const navigate = useNavigate()

    // Function to handle clicking on a user card
    const handleClick = () => {
        navigate(`/friend/${friend._id}`, {state: {friendProfile: friend}});
    }

    return (
        <div key={friend._id} className={'flex flex-col justify-center items-center hover:bg-gray-300 max-h-170 max-w-24'} onClick={() => handleClick()}>
            {/*Avatar*/}
            <div>
                <img className={'h-170 w-24 rounded-lg'} src={`${friend.avatar}`} alt={'img'}/>
            </div>
            {/*User Name*/}
            <div className={'text-black font-bold'}>
                {friend.username}
            </div>
        </div>
    )
}