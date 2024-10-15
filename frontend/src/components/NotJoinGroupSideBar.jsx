import React from 'react';
import {Link} from "react-router-dom";

const NotJoinGroupSideBar = ({groups = []}) => {
    return (
        <div className="p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Recommended Groups</h3>
            {groups.map((group, index) => (
                <div className="mb-2" key={index}>
                    <Link to={`/Group/${group._id}`} className="text-blue-500 hover:text-blue-700">
                        {group.name}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NotJoinGroupSideBar;
