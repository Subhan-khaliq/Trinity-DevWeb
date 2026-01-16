import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
// import invoiceItemRoutes from "./routes/invoiceItem.routes.js"; // Removed as items are handled in invoice
import reportRoutes from "./routes/report.routes.js";
import authRoutes from './routes/auth.routes.js';
import { swaggerUi, specs } from './config/swagger.js';

const app = express();

app.use(helmet());
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

export default app;
