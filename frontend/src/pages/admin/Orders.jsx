import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Order Management</h2>

            {orders.length === 0 ? (
                <Card>No orders found.</Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                        <Card key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6)}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {new Date(order.createdAt).toLocaleDateString()} • {order.userId?.firstName || 'Unknown User'} ({order.userId?.email})
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${order.totalAmount.toFixed(2)}</div>
                                <div style={{
                                    color: order.paymentStatus === 'paid' ? 'green' : 'orange',
                                    fontSize: '0.875rem',
                                    textTransform: 'capitalize'
                                }}>
                                    {order.paymentStatus}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
