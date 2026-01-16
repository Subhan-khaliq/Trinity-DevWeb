import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Cart = () => {
    const { totalAmount, clearCart, cartItems, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const items = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity
            }));

            await api.post('/invoices', {
                items,
                paymentMethod: 'card' // Changed from credit_card to match backend enum
            });

            alert(`Order placed successfully! Total: $${totalAmount.toFixed(2)} `);
            clearCart();
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Checkout failed');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--bg-color)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--text-muted)'
                }}>
                    <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
                </p>
                <Link to="/">
                    <Button variant="primary" style={{ padding: '0.75rem 2.5rem' }}>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Shopping Cart
                <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '2px 10px', borderRadius: '20px' }}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
                {/* Cart Items List */}
                <div style={{ display: 'grid', gap: '1.25rem', gridColumn: 'span 2' }}>
                    {cartItems.map(item => (
                        <Card key={item._id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.25rem' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'var(--bg-color)',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden'
                            }}>
                                {item.picture ? (
                                    <img src={item.picture} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
                                ) : (
                                    <svg width="24" height="24" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: '700' }}>${item.price.toFixed(2)}</div>
                            </div>

                            {/* Quantity Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', borderRadius: 'var(--radius)', padding: '4px' }}>
                                <button
                                    style={{ border: 'none', background: 'var(--surface-color)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: 'var(--shadow-sm)' }}
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                >
                                    −
                                </button>
                                <span style={{ width: '32px', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>{item.quantity}</span>
                                <button
                                    style={{ border: 'none', background: 'var(--surface-color)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: 'var(--shadow-sm)' }}
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.25rem' }}>${(item.price * item.quantity).toFixed(2)}</div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    style={{ border: 'none', background: 'transparent', padding: '0', color: '#f43f5e', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Remove
                                </button>
                            </div>
                        </Card>
                    ))}

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Summary */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <Card style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Order Summary</h3>

                        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>${totalAmount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <span>Estimate for</span>
                                <span>United States</span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>Total</span>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>${totalAmount.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Includes VAT if applicable</div>
                                </div>
                            </div>
                        </div>

                        <Button variant="primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} onClick={handleCheckout}>
                            Checkout Now
                        </Button>

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', opacity: 0.5 }}>
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="2" fill="#1434CB" /><path d="M16 10L20 6H12L16 10Z" fill="white" /></svg>
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="2" fill="#EB001B" /><circle cx="12" cy="10" r="6" fill="#F79E1B" fillOpacity="0.8" /></svg>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart;
