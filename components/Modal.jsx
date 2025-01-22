import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all">
                <div className="p-1">
                    {children}
                </div>
                <div className="p-2 px-3 border-t border-gray-200 flex justify-end">
                    {/* <button 
                        onClick={onClose} 
                        className="px-8 py-2  hover:bg-red-600 text-red-600 border border-red-600 rounded hover:text-white duration-100"
                    >
                        Close
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default Modal;
