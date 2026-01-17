import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const { data } = await api.get('/reports');
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            await api.post('/reports/generate');
            await fetchReports();
        } catch (error) {
            alert("Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
        try {
            await api.delete(`/reports/${id}`);
            setReports(reports.filter(r => r._id !== id));
        } catch (error) {
            alert("Failed to delete report");
        }
    };

    if (loading) return <div className="p-4">Loading reports...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Analytics Reports</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="http://localhost:5001/coverage" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary">Specs Coverage</Button>
                    </a>
                    <Button variant="primary" onClick={handleGenerate}>Generate Report</Button>
                </div>
            </div>

            {reports.length === 0 ? (
                <Card>No reports found. Generate one to get started.</Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {reports.map(report => (
                        <Card key={report._id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{report.type.toUpperCase()} Report</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        Generated on {new Date(report.createdAt).toLocaleString()}
                                    </div>
                                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5', minWidth: '150px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#2f855a', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Revenue</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#276749' }}>${report.data.totalRevenue.toFixed(2)}</div>
                                        </div>
                                        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px', border: '1px solid #bee3f8', minWidth: '150px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#2b6cb0', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Orders</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c5282' }}>{report.data.totalOrders}</div>
                                        </div>
                                        <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d8fd', minWidth: '150px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#6b46c1', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Products</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#553c9a' }}>{report.data.totalProducts}</div>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(report._id)}>Delete Report</Button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                                {/* Sales Trend */}
                                {report.data.dailySales && report.data.dailySales.length > 0 && (
                                    <div style={{ height: '350px', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>Revenue Trend (Last 7 Days)</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <LineChart data={report.data.dailySales}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="sales" stroke="#4c51bf" strokeWidth={2} name="Revenue ($)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Top Products */}
                                {report.data.topProducts && report.data.topProducts.length > 0 && (
                                    <div style={{ height: '350px', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>Top Selling Products (Qty)</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <BarChart data={report.data.topProducts} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#3182ce" radius={[0, 4, 4, 0]} name="Units Sold" barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Category Revenue */}
                                {report.data.categoryRevenue && report.data.categoryRevenue.length > 0 && (
                                    <div style={{ height: '350px', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>Revenue by Category</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <PieChart>
                                                <Pie
                                                    data={report.data.categoryRevenue}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {report.data.categoryRevenue.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Low Stock Alert */}
                                {report.data.lowStockProducts && report.data.lowStockProducts.length > 0 && (
                                    <div style={{ height: '350px', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#e53e3e' }}>Low Stock Inventory (Units Left)</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <BarChart data={report.data.lowStockProducts}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#fc8181" radius={[4, 4, 0, 0]} name="Stock Level" barSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Payment Methods */}
                                {report.data.paymentMethodDistribution && report.data.paymentMethodDistribution.length > 0 && (
                                    <div style={{ height: '350px', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>Payment Method Usage</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <PieChart>
                                                <Pie
                                                    data={report.data.paymentMethodDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name }) => `${name}`}
                                                >
                                                    {report.data.paymentMethodDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* User Growth */}
                                {report.data.userGrowth && report.data.userGrowth.length > 0 && (
                                    <div style={{ height: '350px', background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-main)' }}>New User Growth (Last 7 Days)</h4>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <LineChart data={report.data.userGrowth}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Line type="stepAfter" dataKey="count" stroke="#38a169" strokeWidth={3} name="New Users" dot={{ r: 5 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reports;
