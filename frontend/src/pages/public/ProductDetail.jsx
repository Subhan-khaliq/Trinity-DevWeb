import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading details...</div>;
    if (!product) return <div style={{ padding: '4rem', textAlign: 'center' }}>Product not found.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
                ← Back to Shop
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={product.picture} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.brand}</span>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>{product.name}</h1>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {product.isGlutenFree && <span style={{ background: '#f0fff4', color: '#2f855a', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Gluten-Free</span>}
                            {product.isVegan && <span style={{ background: '#f0fff4', color: '#2f855a', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Vegan</span>}
                            {product.isVegetarian && <span style={{ background: '#f0fff4', color: '#2f855a', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Vegetarian</span>}
                        </div>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>${product.price}</div>

                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Description & Ingredients</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            {product.ingredients || 'No ingredients information available.'}
                        </p>
                    </div>

                    {product.nutritionalInformation && Object.keys(product.nutritionalInformation).length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nutritional Facts</h3>
                            <Card style={{ padding: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {Object.entries(product.nutritionalInformation).map(([key, value]) => (
                                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '0.5rem 0' }}>
                                            <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{key.replace(/_/g, ' ')}</span>
                                            <span style={{ fontWeight: '600' }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    <div style={{ marginTop: 'auto' }}>
                        <Button variant="primary" size="lg" style={{ width: '100%' }} disabled={product.availableQuantity < 1}>
                            {product.availableQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
