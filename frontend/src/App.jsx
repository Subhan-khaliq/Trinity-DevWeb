import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Cart from './pages/public/Cart';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Orders from './pages/admin/Orders';
import Reports from './pages/admin/Reports';
import CustomerOrders from './pages/public/CustomerOrders';
import Customers from './pages/admin/Customers';
import Profile from './pages/public/Profile';
import ProductDetail from './pages/public/ProductDetail';
import GuidedTour from './components/GuidedTour';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

function App() {
  const [runTour, setRunTour] = React.useState(false);

  React.useEffect(() => {
    const hasTakenTour = localStorage.getItem('hasTakenTour');
    if (!hasTakenTour) {
      setRunTour(true);
    }
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <GuidedTour run={runTour} setRun={setRunTour} />
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute adminOnly>
                      <Products />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute adminOnly>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute adminOnly>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/new"
                  element={
                    <ProtectedRoute adminOnly>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/:id"
                  element={
                    <ProtectedRoute adminOnly>
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <ProtectedRoute adminOnly>
                      <Customers />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
