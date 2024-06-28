import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const wallet = useTonWallet();

    // const handleRegister = () => {
    //     navigate('/register');
    // };

    return (
        <div className='login-wrapper'>
            <h2>Login</h2>
            <div className="login-buttons-wrapper">
                <TonConnectButton className="my-connect-button" />
                {/* {!wallet && <button className='register-button' onClick={handleRegister}>Register</button>} */}
            </div>
            {!wallet && (
                <p className="connect-wallet-message">Please connect your wallet to log in or register.</p>
            )}
            {wallet && (
                <div>
                    <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
