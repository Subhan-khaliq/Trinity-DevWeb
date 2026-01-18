import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

const Layout = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                borderBottom: '1px solid var(--border-color)',
                padding: '1.25rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--surface-color)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
                <div id="tour-logo" style={{ fontWeight: '700', fontSize: '1.5rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Trinity Store
                    </Link>
                </div>
                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {(!user || user.role !== 'admin') && (
                        <>
                            <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Home</Link>
                            <Link to="/orders" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>My Orders</Link>
                            <Link id="tour-cart" to="/cart" style={{ color: 'var(--text-muted)', position: 'relative', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>
                                Cart
                                {totalItems > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-14px',
                                        background: 'var(--secondary-color)',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        fontWeight: '700',
                                        padding: '2px 6px',
                                        borderRadius: '999px',
                                        border: '2px solid white'
                                    }}>
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <div style={{ display: 'flex', gap: '1.25rem', paddingRight: '1rem', borderRight: '1px solid var(--border-color)' }}>
                                    <Link id="tour-dashboard" to="/admin" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Dashboard</Link>
                                    <Link to="/admin/products" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Products</Link>
                                    <Link to="/admin/orders" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Orders</Link>
                                    <Link to="/admin/customers" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Customers</Link>
                                    <Link to="/admin/reports" style={{ color: 'var(--text-muted)', fontWeight: '500' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Reports</Link>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link id="tour-profile" to="/profile" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }} onMouseOver={e => e.target.style.color = 'var(--primary-color)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>Profile</Link>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>Hi, {user.firstName}</span>
                                <Button variant="outline" onClick={logout} size="sm" style={{ padding: '0.4rem 0.8rem' }}>Logout</Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary">Sign Up</Button>
                            </Link>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        )}
                    </Button>
                </nav>
            </header>
            <main style={{ flex: '1 0 auto', padding: '3rem 2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <Outlet />
            </main>
            <footer style={{
                borderTop: '1px solid var(--border-color)',
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--surface-color)',
                flexShrink: 0
            }}>
                <p style={{ opacity: 0.8 }}>© 2026 Trinity Store. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
