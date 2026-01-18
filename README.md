# Trinity Store - Part Two

A modern, full-stack E-commerce platform built with the MERN stack, featuring advanced analytics, OpenFoodFacts integration, and robust security measures.

## 🚀 Key Features

- **Admin Dashboard**: Real-time analytics hub with KPI cards, sales trends, and recent order tracking.
- **Product Synchronization**: Sync products via barcode using the OpenFoodFacts API for automatic data enrichment.
- **Advanced Product Catalog**: Detailed nutritional information, dietary filters (Gluten-Free, Vegan, Vegetarian), and sorting.
- **Secure Authentication**: Stateless JWT-based authentication with Role-Based Access Control (RBAC).
- **Comprehensive Reporting**: Generate and manage detailed sales and inventory reports.
- **API Documentation**: Interactive Swagger/OpenAPI 3 documentation.

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Recharts, Lucide-React, Vanilla CSS.
- **Backend**: Node.js, Express 5, Mongoose.
- **Database**: MongoDB.
- **Security**: JWT, Helmet, Custom NoSQL Sanitization.
- **Testing**: Mocha, Chai, Supertest, C8 (Coverage).

## 📥 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your variables:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing & Coverage

- **Run Backend Tests**: `cd backend && npm test`
- **View Coverage**: Access `http://localhost:5001/coverage` in your browser.

## 📖 Documentation

For a deep-dive into the system architecture and data flows, please refer to:
- [Technical Architecture (Markdown)](docs/ARCHITECTURE.md)
- [Printable Architecture (HTML)](docs/ARCHITECTURE.html)

## 📄 License

This project is licensed under the MIT License.
