import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.css';

const Profile = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5001/api/users/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(prev => ({ ...prev, ...res.data }));
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to fetch profile' });
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password && user.password !== user.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5001/api/users/profile/me', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setUser(prev => ({ ...prev, ...res.data, password: '', confirmPassword: '' }));
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2>User Profile</h2>
            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="firstName">First Name</label>
                        <input id="firstName" name="firstName" value={user.firstName} onChange={handleChange} required />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="lastName">Last Name</label>
                        <input id="lastName" name="lastName" value={user.lastName} onChange={handleChange} required />
                    </div>
                </div>
                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={user.email} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input id="phoneNumber" name="phoneNumber" value={user.phoneNumber || ''} onChange={handleChange} />
                </div>

                <hr className={styles.divider} />
                <h3>Change Password</h3>
                <p className={styles.hint}>Leave blank to keep current password</p>

                <div className={styles.field}>
                    <label htmlFor="password">New Password</label>
                    <input id="password" name="password" type="password" value={user.password} onChange={handleChange} />
                </div>
                <div className={styles.field}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={user.confirmPassword} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? 'Saving...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
