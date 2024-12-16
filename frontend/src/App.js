import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PulseAni from './components/PulseAni';
import Main from './components/MainPage/Main';
import Messages from './components/messages/Messages';
import Weather from './components/Weather';
import LoginPage from './components/loginpage/LoginPage';
import VoiceAsist from './components/AI voice/VoiceAsist'; 
import ItemList from './services/ItemList';
import ProtectedRoute from './ProtectedRoute';
import UserProfilePage from './components/User-data/UserProfilePage';
import DocumentGenerator from './components/DocGen/DocumentGenerator';

// Function to get the current user session
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

function App() {
    const isAuthenticated = !!getCurrentUser();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<PulseAni />} />
                <Route path="/main" element={<Main />} />
                <Route path="/messages" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Messages />
                    </ProtectedRoute>
                } />
                <Route path="/weather" element={<Weather />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/voice" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <VoiceAsist />
                    </ProtectedRoute>
                } />
                <Route path="/iteam" element={<ItemList />} />
                <Route path="/profile" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <UserProfilePage />
                    </ProtectedRoute>
                } />
                {/* Add the Document Generator route */}
                <Route path="/docgen" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <DocumentGenerator />
                    </ProtectedRoute>
                } />
                {/* Redirect to login if the user is not authenticated */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;

