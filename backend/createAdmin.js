import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@trinity.com';
        const adminPassword = 'admin123'; // Change this in production!

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');

            // Update role just in case
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user role to admin');
            }

            process.exit(0);
        }

        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });

        await adminUser.save();
        console.log(`Admin user created successfully! Email: ${adminEmail}, Password: ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
