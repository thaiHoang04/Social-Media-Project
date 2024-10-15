import React from 'react';
import '../styles/AboutUsBox.css';

const AboutUsBox = ({group}) => {
    return (
        <div className="AboutUsBox">
            <h1 className='titleAboutUs'>
                <p> About Us</p>
            </h1>
            <div className="groupDescription">
                <p>{group.description}</p>
            </div>
        </div>
    );
};

export default AboutUsBox;