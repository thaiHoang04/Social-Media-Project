import React from 'react';
import '../styles/HistoryPopupStyle.css'; // Optional: Include a CSS file for styling

const HistoryPopup = ({ historyData, close }) => {
    return (
        <div className="history-popup-overlay">
            <div className="history-popup-content">
                <       div className="inline-flex justify-between items-center w-full">
                    <h2 className='flex-grow text-center font-bold'>Edit History</h2>
                    <button onClick={close} className="close-button">X</button>
                </div>

                <div className="history-list">
                    {historyData.length > 0 ? (
                        historyData.map((entry, index) => (
                            <div key={index} className="history-entry">
                                <p><strong>Changes:</strong> {entry.changes}</p>
                            </div>
                        ))
                    ) : (
                        <p>No history available for this post.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPopup;