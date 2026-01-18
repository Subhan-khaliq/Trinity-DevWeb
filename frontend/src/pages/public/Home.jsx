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
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        isGlutenFree: false,
        isVegan: false,
        isVegetarian: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            let url = `/products?page=${page}&limit=12&category=${selectedCategory}&sort=${sortBy === 'newest' ? '' : sortBy}`;
            if (filters.isGlutenFree) url += '&isGlutenFree=true';
            if (filters.isVegan) url += '&isVegan=true';
            if (filters.isVegetarian) url += '&isVegetarian=true';

            const { data } = await api.get(url);
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
    }, [user, navigate, selectedCategory, sortBy, filters]);

    const handlePageChange = (newPage) => {
        fetchProducts(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (name) => {
        setFilters(prev => ({ ...prev, [name]: !prev[name] }));
        setCurrentPage(1);
    };

    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks', 'Beverages', 'Pantry']; // Example categories or fetch dynamically

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && products.length === 0) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
            {/* Sidebar Filters */}
            <aside style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '16px', height: 'fit-content', position: 'sticky', top: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Filters</h3>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Search</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>Dietary</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['isGlutenFree', 'isVegan', 'isVegetarian'].map(f => (
                            <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input
                                    type="checkbox"
                                    checked={filters[f]}
                                    onChange={() => handleFilterChange(f)}
                                />
                                {f.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        ))}
                    </div>
                </div>

                <Button variant="outline" size="sm" style={{ width: '100%' }} onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSortBy('newest');
                    setFilters({ isGlutenFree: false, isVegan: false, isVegetarian: false });
                }}>
                    Reset All
                </Button>
            </aside>

            {/* Product Grid */}
            <main>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', paddingBottom: '0.5rem' }}>
                        <Button
                            variant={selectedCategory === '' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedCategory('')}
                        >All</Button>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                            >{cat}</Button>
                        ))}
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products match your criteria</h3>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <Card key={product._id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0.75rem', transition: 'transform 0.2s ease', cursor: 'pointer' }} onClick={(e) => {
                                if (e.target.tagName !== 'BUTTON') navigate(`/product/${product._id}`);
                            }}>
                                <div style={{
                                    height: '200px',
                                    background: 'var(--bg-color)',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <img src={product.picture} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                        {product.brand}
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', minHeight: '2.5rem' }}>{product.name}</h3>

                                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                                        {product.isGlutenFree && <span title="Gluten-Free" style={{ fontSize: '1rem' }}>🌾❌</span>}
                                        {product.isVegan && <span title="Vegan" style={{ fontSize: '1rem' }}>🌱</span>}
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>${product.price}</span>
                                        {product.availableQuantity > 0 ? (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            >Add</Button>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: '6px' }}>Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </main>
        </div>
    );
};

export default Home;
