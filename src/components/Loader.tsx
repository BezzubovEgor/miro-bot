import React from "react";

export const Loader: React.FC = () => (
    <p>
        <span className="skeleton-box" style={{ width: '70%' }}></span>
        <span className="skeleton-box" style={{ width: '85%' }}></span>
        <span className="skeleton-box" style={{ width: '80%' }}></span>
        <span className="skeleton-box" style={{ width: '60%' }}></span>
        <span className="skeleton-box" style={{ width: '75%' }}></span>
    </p>
);
