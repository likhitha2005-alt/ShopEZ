import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { users, products } from './data.js';

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users individually so the pre-save password hashing hook runs
    const createdUsers = [];
    for (const u of users) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));

    // Insert individually so the pre-save slug hook runs for each
    for (const p of sampleProducts) {
      await Product.create(p);
    }

    console.log('Sample data imported successfully!');
    console.log(`  Users created: ${createdUsers.length}`);
    console.log(`  Products created: ${sampleProducts.length}`);
    console.log('');
    console.log('Login credentials:');
    console.log('  Admin -> email: admin@shopez.com / password: admin123');
    console.log('  User  -> email: john@example.com / password: password123');
    process.exit();
  } catch (error) {
   console.error("FULL ERROR:");
console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('All data destroyed successfully!');
    process.exit();
  } catch (error) {
  console.error("FULL ERROR:");
  console.error(error);
  process.exit(1);
}
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
