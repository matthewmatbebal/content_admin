import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import DashboardPage from './DashboardPage';
import ContentManagementPage from './ContentManagePage';
import ProfileSettings from './ProfileSettings';

const App: React.FC = () => {
    const handleSaveProfile = () => {
        // Логика для обработки сохраненных данных профиля
    };

    return (
        <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
            <Router basename='/content_admin/'>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/content-management" element={<ContentManagementPage />} />
                    <Route path="/profile-settings" element={<ProfileSettings onSave={handleSaveProfile} />} />
                </Routes>
            </Router>
        </TonConnectUIProvider>
    );
};

export default App;
