import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        brand: '',
        category: '',
        availableQuantity: '',
        picture: '',
        barcode: '',
        ingredients: '',
        isGlutenFree: false,
        isVegan: false,
        isVegetarian: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.get(`/products/${id}`);
                    setFormData({
                        name: data.name || '',
                        price: data.price || '',
                        brand: data.brand || '',
                        category: data.category || '',
                        availableQuantity: data.availableQuantity || 0,
                        picture: data.picture || '',
                        barcode: data.barcode || '',
                        ingredients: data.ingredients || '',
                        isGlutenFree: data.isGlutenFree || false,
                        isVegan: data.isVegan || false,
                        isVegetarian: data.isVegetarian || false
                    });
                } catch (err) {
                    setError('Failed to fetch product details details');
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/products/${id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                <Button variant="ghost" onClick={() => navigate('/admin/products')}>Cancel</Button>
            </div>

            <Card>
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                        <Input label="Quantity" name="availableQuantity" type="number" value={formData.availableQuantity} onChange={handleChange} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
                        <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                            <input type="checkbox" name="isGlutenFree" checked={formData.isGlutenFree} onChange={handleChange} />
                            Gluten-Free
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                            <input type="checkbox" name="isVegan" checked={formData.isVegan} onChange={handleChange} />
                            Vegan
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                            <input type="checkbox" name="isVegetarian" checked={formData.isVegetarian} onChange={handleChange} />
                            Vegetarian
                        </label>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Ingredients</label>
                        <textarea
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-main)' }}
                        />
                    </div>

                    <Input label="Picture URL" name="picture" value={formData.picture} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                        <Input label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} />
                        <div style={{ paddingTop: '1.85rem' }}>
                            <Button
                                type="button"
                                variant="outline"
                                style={{ width: '120px' }}
                                onClick={async () => {
                                    if (!formData.barcode) return alert('Please enter a barcode first');
                                    setLoading(true);
                                    try {
                                        const { data } = await api.post('/products/sync', {
                                            barcode: formData.barcode,
                                            shouldSave: false
                                        });
                                        setFormData(prev => ({
                                            ...prev,
                                            name: data.name || prev.name,
                                            brand: data.brand || prev.brand,
                                            category: data.category || prev.category,
                                            picture: data.picture || prev.picture,
                                            ingredients: data.ingredients || prev.ingredients,
                                            isGlutenFree: data.isGlutenFree || prev.isGlutenFree,
                                            isVegan: data.isVegan || prev.isVegan,
                                            isVegetarian: data.isVegetarian || prev.isVegetarian
                                        }));
                                    } catch (error) {
                                        alert(error.response?.data?.message || 'Failed to fetch details');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                            >
                                Fetch Details
                            </Button>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ProductForm;
