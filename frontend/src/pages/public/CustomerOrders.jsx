import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/invoices');
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (id) => {
        try {
            const { data } = await api.get(`/invoices/${id}`);
            setSelectedOrder(data);
        } catch (error) {
            console.error("Failed to fetch order details", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your orders...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>Order History</h2>

            {orders.length === 0 ? (
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
                        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No orders found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders yet. Start exploring our store!</p>
                    <Link to="/">
                        <Button variant="primary">Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <Card key={order._id} style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.5rem 2rem',
                                background: 'var(--bg-color)',
                                borderBottom: selectedOrder?._id === order._id ? '1px solid var(--border-color)' : 'none'
                            }}>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Order Number</div>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>#{order._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Date Placed</div>
                                        <div style={{ fontWeight: '500' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Amount</div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>${order.totalAmount.toFixed(2)}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2',
                                            color: order.paymentStatus === 'paid' ? '#166534' : '#991b1b',
                                            textTransform: 'uppercase'
                                        }}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
                                        <Button
                                            variant={selectedOrder?._id === order._id ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => selectedOrder?._id === order._id ? setSelectedOrder(null) : fetchOrderDetails(order._id)}
                                            style={{ minWidth: '100px', fontSize: '0.8rem' }}
                                        >
                                            {selectedOrder?._id === order._id ? 'Hide' : 'Details'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    let orderToPrint = order;
                                                    if (!order.items) {
                                                        const { data } = await api.get(`/invoices/${order._id}`);
                                                        orderToPrint = data;
                                                    }
                                                    const { generateReceipt } = await import('../../utils/receiptGenerator');
                                                    generateReceipt(orderToPrint);
                                                } catch (err) {
                                                    console.error("PDF generation failed", err);
                                                    alert("Could not generate PDF. Please try again.");
                                                }
                                            }}
                                            style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.8rem', padding: '0 8px' }}
                                        >
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            Receipt
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const btn = e.currentTarget;
                                                const originalContent = btn.innerHTML;
                                                btn.innerHTML = '...';
                                                btn.disabled = true;
                                                try {
                                                    const { data } = await api.post(`/invoices/${order._id}/email`);
                                                    btn.innerHTML = 'Sent!';
                                                    if (data.previewUrl) {
                                                        console.log("Email Preview URL:", data.previewUrl);
                                                        // Inform user about preview URL for test mode
                                                        if (window.confirm("Test email sent! Would you like to view the preview URL in a new tab?")) {
                                                            window.open(data.previewUrl, '_blank');
                                                        }
                                                    }
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalContent;
                                                        btn.disabled = false;
                                                    }, 3000);
                                                } catch (error) {
                                                    btn.innerHTML = 'Error';
                                                    btn.style.color = '#c53030';
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalContent;
                                                        btn.style.color = 'var(--primary-color)';
                                                        btn.disabled = false;
                                                    }, 3000);
                                                }
                                            }}
                                            style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.8rem', padding: '0 8px', minWidth: '60px' }}
                                        >
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                            Email
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder && selectedOrder._id === order._id && (
                                <div style={{ padding: '2rem', background: 'var(--surface-color)' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                        Order Items
                                    </h4>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {selectedOrder.items.map(item => (
                                            <div key={item._id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                background: 'var(--bg-color)',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        background: 'var(--surface-color)',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '1px solid var(--border-color)'
                                                    }}>
                                                        <svg width="20" height="20" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.925rem' }}>{item.productId?.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity} × ${item.priceAtPurchase.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>${item.subtotal.toFixed(2)}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        marginTop: '2rem',
                                        paddingTop: '1.5rem',
                                        borderTop: '2px dashed var(--border-color)',
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <div style={{ width: '250px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <span>Subtotal</span>
                                                <span>${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <span>Shipping</span>
                                                <span style={{ color: '#166534', fontWeight: '600' }}>Free</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                                <span style={{ fontWeight: '700' }}>Order Total</span>
                                                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-color)' }}>${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;
