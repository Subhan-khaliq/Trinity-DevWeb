import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="p-4">Loading products...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Product Management</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button variant="outline" onClick={async () => {
                        const barcode = prompt('Enter product barcode:');
                        if (barcode) {
                            setLoading(true);
                            try {
                                await api.post('/products/sync', { barcode });
                                fetchProducts();
                            } catch (error) {
                                alert(error.response?.data?.message || 'Failed to sync product');
                            } finally {
                                setLoading(false);
                            }
                        }
                    }}>Sync via Barcode</Button>
                    <Link to="/admin/products/new">
                        <Button variant="primary">Add Product</Button>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {products.map(product => (
                    <Card key={product._id} className="flex flex-col h-full">
                        <div style={{ height: '150px', background: '#f3f4f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', overflow: 'hidden' }}>
                            {product.picture ? (
                                <img src={product.picture} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ color: '#9ca3af' }}>No Image</span>
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', flexGrow: 1 }}>
                            ${product.price} • {product.brand || 'No Brand'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <Link to={`/admin/products/${product._id}`} style={{ flex: 1 }}>
                                <Button variant="outline" style={{ width: '100%' }}>Edit</Button>
                            </Link>
                            <Button variant="danger" onClick={() => handleDelete(product._id)}>Delete</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Products;
