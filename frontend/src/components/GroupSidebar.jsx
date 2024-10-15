import React from 'react';
import {Link} from "react-router-dom";
import '../styles/GroupSideBar.css';

const GroupSidebar = ({groups = []}) => {
    return (
        <div className="p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Groups</h3>
            {groups.map((group, index) => (
                <div className="mb-2" key={index}>
                    <Link to={`/Group/${group._id}`} className="text-blue-500 hover:text-blue-700">
                        {group.name}
                    </Link>
                </div>
            ))}
            <button className='createGroupButton'>
                <Link to="/creategroup">Want to create new Group?</Link>
            </button>
        </div>
    );
};

export default GroupSidebar;
