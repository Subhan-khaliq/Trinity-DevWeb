import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Pagination from '../../components/ui/Pagination';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products?page=${page}&limit=4`);
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
            return;
        }
        fetchProducts(1);
    }, [user, navigate]);

    const handlePageChange = (newPage) => {
        fetchProducts(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Client-side filtering on the current page's products (Simple approach for 4 items)
    // Note: In a real app, filtering should also be server-side if paginated.
    // For now, I'll keep it simple as the user asked for 4 products per page.
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>;

    return (
        <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.04em', fontWeight: '800' }}>Discover Our Collection</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Find exactly what you're looking for among our premium selection.
                </p>
            </div>

            {/* Filter Bar */}
            <div style={{
                display: 'flex',
                gap: '1.5rem',
                marginBottom: '3.5rem',
                background: 'var(--surface-color)',
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input
                        type="text"
                        placeholder="Search products by name or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem 0.875rem 3rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.925rem',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                        }}
                    />
                </div>

                <div style={{ minWidth: '200px' }}>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            fontSize: '0.925rem',
                            fontWeight: '500',
                            color: 'var(--text-main)',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1.25rem'
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {(searchQuery || selectedCategory) && (
                    <Button
                        variant="ghost"
                        onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                        style={{ fontSize: '0.875rem', fontWeight: '600' }}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '2rem'
            }}>
                {filteredProducts.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface-color)', borderRadius: 'var(--radius)', border: '1px dashed var(--border-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.3 }}>🔍</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products match your search</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <Card key={product._id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0.75rem' }}>
                            <div style={{
                                height: '200px',
                                background: 'var(--bg-color)',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                border: '1px solid var(--border-color)'
                            }}>
                                {product.picture ? (
                                    <img src={product.picture} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem', transition: 'transform 0.5s ease' }} />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span style={{ fontSize: '0.75rem' }}>No Image</span>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 0.25rem 0.25rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                    {product.brand || 'Trinity Exclusive'}
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', minHeight: '2.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.25' }}>
                                    {product.name}
                                </h3>
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>${product.price}</span>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        style={{ flex: 1 }}
                                        onClick={() => addToCart(product)}
                                        disabled={product.availableQuantity < 1}
                                    >
                                        {product.availableQuantity > 0 ? 'Add' : 'Out of Stock'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Home;
