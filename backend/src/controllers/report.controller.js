import Invoice from '../models/Invoice.js';
import InvoiceItem from '../models/InvoiceItem.js';
import Product from '../models/Product.js';
import Report from '../models/Report.js';
import User from '../models/User.js';

export const generateReport = async (req, res) => {
    try {
        // Basic KPIs
        const totalSales = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const countInvoices = await Invoice.countDocuments();
        const countProducts = await Product.countDocuments();

        // 7-Day Sales Trend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailySales = await Invoice.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top Selling Products (by quantity)
        const topProducts = await InvoiceItem.aggregate([
            { $group: { _id: "$productId", value: { $sum: "$quantity" } } },
            { $sort: { value: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $project: { name: "$product.name", value: 1, _id: 0 } }
        ]);

        // Revenue Breakdown by Category
        const categoryRevenue = await InvoiceItem.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product.category",
                    value: { $sum: "$subtotal" }
                }
            },
            { $project: { name: { $ifNull: ["$_id", "Uncategorized"] }, value: 1, _id: 0 } }
        ]);

        // Low Stock Products (availableQuantity < 20)
        const lowStockProducts = await Product.find({ availableQuantity: { $lt: 20 } })
            .select('name availableQuantity')
            .sort({ availableQuantity: 1 })
            .limit(10);

        const lowStockData = lowStockProducts.map(p => ({
            name: p.name,
            value: p.availableQuantity
        }));

        // Payment Method Distribution
        const paymentMethodDistribution = await Invoice.aggregate([
            { $group: { _id: "$paymentMethod", value: { $sum: 1 } } },
            { $project: { name: { $ifNull: ["$_id", "Unknown"] }, value: 1, _id: 0 } }
        ]);

        // User Growth (Last 7 Days)
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const reportData = {
            totalRevenue: totalSales[0]?.total || 0,
            totalOrders: countInvoices,
            totalProducts: countProducts,
            dailySales: dailySales,
            topProducts: topProducts,
            categoryRevenue: categoryRevenue,
            lowStockProducts: lowStockData,
            paymentMethodDistribution: paymentMethodDistribution,
            userGrowth: userGrowth,
            generatedAt: new Date()
        };

        // Save report
        const report = await Report.create({
            type: 'custom',
            data: reportData,
            generatedBy: req.user.id
        });

        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.json({ message: "Report deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalSales = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const countInvoices = await Invoice.countDocuments();
        const countProducts = await Product.countDocuments();
        const countUsers = await User.countDocuments({ role: 'customer' });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailySales = await Invoice.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const recentOrders = await Invoice.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'firstName lastName email');

        res.json({
            totalRevenue: totalSales[0]?.total || 0,
            totalOrders: countInvoices,
            totalProducts: countProducts,
            totalCustomers: countUsers,
            dailySales,
            recentOrders
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
