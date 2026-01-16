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
        barcode: ''
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
                        barcode: data.barcode || ''
                    });
                } catch (err) {
                    setError('Failed to fetch product details details');
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                    <Input label="Picture URL" name="picture" value={formData.picture} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    <Input label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} />

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
