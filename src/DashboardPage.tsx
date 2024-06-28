import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonWallet } from '@tonconnect/ui-react';

interface ProfileData {
    username: string;
    email: string;
    contactInfo: string;
    aboutMe: string;
    avatarUrl: string;
    isDonationsEnabled: boolean;
}

interface Content {
    id: number;
    title: string;
    url: string;
    description: string;
    thumbnail: string;
    visible: boolean;
    totalEarned: number; // Добавлено поле для хранения суммы TON, задонатированных на контент
    contentPayUrl: string; // Новое поле для хранения ссылки contentPay
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [profile, setProfile] = useState<ProfileData>({
        username: '',
        email: '',
        contactInfo: '',
        aboutMe: '',
        avatarUrl: '',
        isDonationsEnabled: false,
    });
    const [contents, setContents] = useState<Content[]>([]);
    const [totalDonations, setTotalDonations] = useState<number>(0);

    useEffect(() => {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }

        const storedContents = localStorage.getItem('contents');
        if (storedContents) {
            setContents(JSON.parse(storedContents));
        }

        setTotalDonations(98.582675);

        const storedContentDonations = localStorage.getItem('contentDonations');
        if (storedContentDonations) {
            const contentDonations = JSON.parse(storedContentDonations);
            setContents((prevContents) =>
                prevContents.map((content) => ({
                    ...content,
                    totalEarned: contentDonations[content.id] || 0,
                }))
            );
        }
    }, []);

    const toggleDonationsEnabled = () => {
        setProfile((prevProfile) => {
            const updatedProfile = { ...prevProfile, isDonationsEnabled: !prevProfile.isDonationsEnabled };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
            return updatedProfile;
        });
    };

    if (!wallet) {
        return (
            <div>
                <h2>Dashboard</h2>
                <p>Please connect your wallet to view the dashboard.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <h2>Dashboard</h2>
            <div className="profile-info">
                <div className="avatar">
                    {profile.avatarUrl && <img src={profile.avatarUrl} alt="Avatar" />}
                </div>
                <div className="details">
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Contact Info:</strong> {profile.contactInfo}</p>
                </div>
            </div>
            {profile.aboutMe.length > 0 && (
                <div className="about-me-overview">
                    <h3>About Me</h3>
                    <div className="statistics">
                        <p>{profile.aboutMe}</p>
                    </div>
                </div>
            )}
            <div className="statistics-overview">
                <h3>Statistics Overview</h3>
                <div className="statistics">
                    <p><strong>Total Content Uploaded:</strong> {contents.length}</p>
                    <p><strong>Total Donations:</strong> {totalDonations} TON</p>
                    <p><strong>Last upload:</strong> {/* Add logic to fetch and display this */}</p>
                </div>
            </div>
            <div className="donation-toggle">
                <label>
                    <strong>Availability of profile for donations</strong>
                    <button
                        className='availible-donation-button'
                        onClick={toggleDonationsEnabled}
                        style={{
                            backgroundColor: profile.isDonationsEnabled ? 'green' : 'gray',
                            color: 'white',
                        }}
                    >
                        {profile.isDonationsEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                </label>
            </div>
            <div className="dashboard-buttons">
                <button onClick={() => navigate('/content-management')}>Manage Content</button>
                <button onClick={() => navigate('/profile-settings')}>Profile Settings</button>
                <button onClick={() => navigate('/')}>Logout</button>
            </div>
            {contents.length > 0 && (
                <div className="content-list">
                    <h3>Your Content</h3>
                    {contents.map((content) => (
                        <div key={content.id} className="content-card">
                            <h3>{content.title}</h3>
                            <p>{content.description}</p>
                            <a href={content.url}><strong className='url'>Content URL:</strong> {content.url}</a>
                            <div className="contentpay-url">
                                <a href={content.contentPayUrl}>  <strong className='url'> ContentPay URL:</strong> {content.contentPayUrl}</a>
                            </div>
                            {content.thumbnail && <img className='content-card-img' src={content.thumbnail} alt={content.title} />}
                            <p><strong>Total earned: </strong><span className='total-earned'>{content.totalEarned} TON</span> </p>
                            <div className="content-actions">
                                <label>
                                    Available for donation
                                    <input
                                        type="checkbox"
                                        checked={content.visible}
                                        readOnly
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
