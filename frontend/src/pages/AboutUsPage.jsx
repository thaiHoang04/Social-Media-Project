import NavBar from '../components/NavBar';
import GroupHeaderBox from '../components/GroupHeaderBox';
import AboutUsBox from '../components/AboutUsBox';
import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from 'react';

const AboutUsPage = () => {
    const {state} = useLocation();
    const [group, setGroup] = useState(null);

    // Get group from state
    useEffect(() => {
        setGroup(state.group)
    }, []);

    // Check whether group is loaded
    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{background: '#B9D9DC'}}>
            <NavBar/>
            <GroupHeaderBox group={group}/>
            <div className="grid grid-cols-12 gap-4 p-4">
                <div className="col-span-3"></div>
                <div className="col-span-6">
                    <div className="mb-4"></div>
                    <AboutUsBox group={group}/>
                </div>
                <div className="col-span-3"></div>
            </div>
        </div>
    );
};

export default AboutUsPage;