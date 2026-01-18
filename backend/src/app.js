import express from "express";
import cors from "cors";
import helmet from "helmet";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
// import invoiceItemRoutes from "./routes/invoiceItem.routes.js"; // Removed as items are handled in invoice
import reportRoutes from "./routes/report.routes.js";
import authRoutes from './routes/auth.routes.js';
import { swaggerUi, specs } from './config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  hsts: false, // Disable HSTS to avoid HTTPS issues on IP access
}));
app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE MUST BE HERE
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
// app.use("/api/invoice-items", invoiceItemRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);

// Coverage Reports Dashboard
app.get('/coverage', (req, res) => {
  res.sendFile(path.join(__dirname, './public/coverage.html'));
});

// Static assets for reports
const backendCoveragePath = path.resolve(__dirname, '../coverage');
const frontendCoveragePath = process.env.DOCKER_ENV === 'true'
  ? path.resolve(__dirname, '../frontend-coverage')
  : path.resolve(__dirname, '../../frontend/coverage/lcov-report');

app.get('/coverage/debug', (req, res) => {
  res.json({
    dockerEnv: process.env.DOCKER_ENV,
    backendPath: backendCoveragePath,
    frontendPath: frontendCoveragePath,
    backendExists: fs.existsSync(backendCoveragePath),
    frontendExists: fs.existsSync(frontendCoveragePath),
    cwd: process.cwd(),
    __dirname: __dirname
  });
});

console.log('--- Coverage Diagnostics ---');
console.log(`DOCKER_ENV: ${process.env.DOCKER_ENV}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Backend Path: ${backendCoveragePath}`);
console.log(`Frontend Path: ${frontendCoveragePath}`);
console.log('---------------------------');

app.use('/coverage/backend-report', express.static(backendCoveragePath));
app.use('/coverage/frontend-report', express.static(frontendCoveragePath));

export default app;
