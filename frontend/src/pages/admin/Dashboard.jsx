import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import { ShoppingCart, Package, Users, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
        <div style={{
            padding: '1rem',
            backgroundColor: `${color}15`,
            borderRadius: '12px',
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{title}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{value}</div>
        </div>
    </Card>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-4">Loading analytics...</div>;
    if (!stats) return <div className="p-4">Failed to load dashboard data.</div>;

    return (
        <div className="p-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h2>
                <p style={{ color: 'var(--text-muted)' }}>Overview of your store's performance.</p>
            </div>

            {/* Stats Grid */}
            <div id="tour-stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    color="#4c51bf"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="#38a169"
                />
                <StatCard
                    title="Active Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="#3182ce"
                />
                <StatCard
                    title="Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="#d69e2e"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                {/* Sales Chart */}
                <Card style={{ padding: '1.5rem', height: '400px' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Revenue Trend (Last 7 Days)</h4>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={stats.dailySales}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis dataKey="_id" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--surface-color)',
                                    borderColor: 'var(--border-color)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#4c51bf"
                                strokeWidth={3}
                                name="Revenue ($)"
                                dot={{ r: 4, fill: '#4c51bf' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Recent Orders */}
                <Card style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Recent Orders</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Customer</th>
                                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status</th>
                                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total</th>
                                    <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <div style={{ fontWeight: '500' }}>{order.userId?.firstName} {order.userId?.lastName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.userId?.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: order.paymentStatus === 'paid' ? '#f0fff4' : '#fff5f5',
                                                color: order.paymentStatus === 'paid' ? '#2f855a' : '#c53030',
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</td>
                                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
