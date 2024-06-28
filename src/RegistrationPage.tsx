import React, { useState } from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const wallet = useTonWallet();

    const checkWalletInDatabase = async (walletAddress: string) => {
        // Здесь сделать запрос к  серверу  для проверки кошелька в базе данных
        // const response = await fetch(`/api/check-wallet?address=${walletAddress}`);
        // const data = await response.json();
        // return data.exists;
        return false; // Предположим, что кошелька нет в базе
    };

    const handleRegister = async () => {
        // Проверка заполнения полей имени и email
        if (!username || !email) {
            setError('Please enter your username and email.');
            return;
        }

        // Проверка подключения кошелька
        if (!wallet) {
            setError('Please connect your wallet.');
            return;
        }

        try {
            const walletExists = await checkWalletInDatabase(wallet.address);

            if (walletExists) {
                // Кошелек уже существует в базе, переход на Dashboard
                navigate('/dashboard');
            } else {
                // Кошелька нет в базе, спрашиваем пользователя
                const createAccount = window.confirm('Wallet not found in database. Do you want to create an account?');

                if (createAccount) {
                    // Переход на страницу Dashboard для создания аккаунта
                    navigate('/dashboard');
                } else {
                    // Возврат на страницу Login
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Failed to register. Please try again.');
        }
    };

    const handleBackToLogin = () => {
        navigate('/'); // Переход на страницу Login
    };

    return (
        <div className="registration-form">
            <h2>Register as content creator</h2>
            <div className="form-inputs">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="register-buttons-wrapper">
                <TonConnectButton className="my-connect-button" />
                <div className="navigate-buttons-wrapper">
                    <button className='registration' onClick={handleRegister}>Register</button>
                    <button className='back-to-login' onClick={handleBackToLogin}>Back to Login</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default RegistrationPage;
