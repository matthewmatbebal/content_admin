import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileSettingsProps {
    onSave: (data: { username: string; email: string; contactInfo: string; aboutMe: string; avatarUrl: string; isDonationsEnabled: boolean }) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onSave }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newContactInfo, setNewContactInfo] = useState('');
    const [newAboutMe, setNewAboutMe] = useState('');
    const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [isDonationsEnabled, setIsDonationsEnabled] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isAvatarInputOpen, setIsAvatarInputOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            setNewUsername(profile.username);
            setNewEmail(profile.email);
            setNewContactInfo(profile.contactInfo);
            setNewAboutMe(profile.aboutMe);
            setNewAvatarUrl(profile.avatarUrl);
            setIsDonationsEnabled(profile.isDonationsEnabled);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setNewAvatarUrl(reader.result as string);
                setIsAvatarInputOpen(false); // Закрыть input после загрузки аватара
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleOpenAvatarInput = () => {
        setIsAvatarInputOpen(true);
    };

    const handleSave = () => {
        const profileData = {
            username: newUsername,
            email: newEmail,
            contactInfo: newContactInfo,
            aboutMe: newAboutMe,
            avatarUrl: newAvatarUrl,
            isDonationsEnabled: isDonationsEnabled,
        };
        localStorage.setItem('profile', JSON.stringify(profileData));
        onSave(profileData);
        setIsSaved(true);
    };

    const handleChangeInfo = () => {
        setIsSaved(false);
    };

    return (
        <div className="profile-settings">
            <h2>Edit Profile</h2>
            <div className="profile-settings-wrapper">
                <div className="profile-settings-inputs">
                    <div className="form-group">
                        <strong><label htmlFor="username">Username</label></strong>
                        <input
                            type="text"
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            disabled={isSaved}
                        />
                    </div>
                    <div className="form-group">
                        <strong><label htmlFor="email">Email</label></strong>
                        <input
                            type="email"
                            id="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            disabled={isSaved}
                        />
                    </div>
                    <div className="form-group">
                        <strong><label htmlFor="contactInfo">Contact Info</label></strong>
                        <input
                            type="text"
                            id="contactInfo"
                            value={newContactInfo}
                            onChange={(e) => setNewContactInfo(e.target.value)}
                            disabled={isSaved}
                        />
                    </div>
                </div>
                    
                <div className="form-group-avatar">
                    <label htmlFor="avatar">Profile Image</label>
                    {!isAvatarInputOpen ? (
                        <button onClick={handleOpenAvatarInput} disabled={isSaved}>
                            Change Image
                        </button>
                    ) : (
                        <input type="file" id="avatar" onChange={handleFileChange} disabled={isSaved} />
                    )}
                    {newAvatarUrl && <img src={newAvatarUrl} alt="Avatar" className="avatar-preview" />}
                </div>
            </div>

            <div className="about-me-settings">
                <strong><label htmlFor="aboutMe">About Me</label></strong>
                <textarea
                    id="aboutMe"
                    value={newAboutMe}
                    onChange={(e) => setNewAboutMe(e.target.value)}
                    disabled={isSaved}
                />
            </div>

            {/* <div className="form-group-donations">
                <label htmlFor="donations">Enable Donations</label>
                <input
                    type="checkbox"
                    id="donations"
                    checked={isDonationsEnabled}
                    onChange={(e) => setIsDonationsEnabled(e.target.checked)}
                    disabled={isSaved}
                />
            </div> */}

            <div className="profile-settings-buttons">
                {!isSaved ? (
                    <button onClick={handleSave}>Save</button>
                ) : (
                    <>
                        <button onClick={handleChangeInfo}>Change Profile Info</button>
                        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileSettings;
