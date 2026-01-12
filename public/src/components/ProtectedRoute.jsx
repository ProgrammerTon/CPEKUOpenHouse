import React from 'react';
import { Navigate } from 'react-router-dom'; // ห้ามลืมบรรทัดนี้

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('adminToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;