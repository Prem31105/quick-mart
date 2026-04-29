import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Hub from './models/Hub.js';
import Notification from './models/Notification.js';
import Order from './models/Order.js';

const hubs = [
  { name: 'Mumbai Central Hub', city: 'Mumbai', state: 'Maharashtra', address: 'Andheri East, Mumbai', pincode: '400069' },
  { name: 'Delhi NCR Hub', city: 'Delhi', state: 'Delhi', address: 'Okhla Phase 2, New Delhi', pincode: '110020' },
  { name: 'Bangalore Tech Hub', city: 'Bangalore', state: 'Karnataka', address: 'Electronic City, Bangalore', pincode: '560100' },
  { name: 'Kolkata East Hub', city: 'Kolkata', state: 'West Bengal', address: 'Salt Lake, Kolkata', pincode: '700091' },
  { name: 'Chennai South Hub', city: 'Chennai', state: 'Tamil Nadu', address: 'Guindy, Chennai', pincode: '600032' },
];

const cities = hubs.map(h => h.city);

const productData = [
  { name: 'Quantum X Pro Smartphone', price: 74999, category: 'Mobile', brand: 'Quantum', rating: 4.9, image: '/images/phone.png' },
  { name: 'EcoWash 8kg Front Load', price: 32499, category: 'Washing Machine', brand: 'EcoSmart', rating: 4.7, image: '/images/washing_machine.png' },
  { name: 'Vision 65" 8K OLED TV', price: 145000, category: 'Television', brand: 'VisionTech', rating: 4.8, image: '/images/tv.png' },
  { name: 'AeroBreeze 1.5 Ton Split AC', price: 41999, category: 'Air Conditioner', brand: 'Aero', rating: 4.6, image: '/images/ac.png' },
  { name: 'FrostGuard 500L Multi-Door', price: 65999, category: 'Refrigerator', brand: 'FrostGuard', rating: 4.8, image: '/images/fridge.png' },
  { name: 'ZenBook Ultra 14"', price: 89999, category: 'Laptop', brand: 'Zen', rating: 4.9, image: '/images/laptop.png' },
  { name: 'SlatePro 11" Tablet', price: 54999, category: 'Tablet', brand: 'Slate', rating: 4.7, image: '/images/tablet.png' },
  { name: 'SonicPulse Smart Speaker', price: 12999, category: 'Audio', brand: 'Sonic', rating: 4.5, image: '/images/speaker.png' },
  { name: 'ChefMaster Digital Microwave', price: 14500, category: 'Kitchen', brand: 'ChefMaster', rating: 4.6, image: '/images/microwave.png' },
  { name: 'AuraSonic Pro Wireless', price: 14999, category: 'Audio', brand: 'Aura', rating: 4.8, image: '/images/headphones.png' },
  { name: 'Galaxy Z Flip Smartphone', price: 84999, category: 'Mobile', brand: 'Samsung', rating: 4.7, image: '/images/phone.png' },
  { name: 'Bravia 55" 4K Smart TV', price: 65000, category: 'Television', brand: 'Sony', rating: 4.6, image: '/images/tv.png' },
  { name: 'MacBook Air M2', price: 114900, category: 'Laptop', brand: 'Apple', rating: 4.9, image: '/images/laptop.png' },
  { name: 'QuietComfort Earbuds', price: 22900, category: 'Audio', brand: 'Bose', rating: 4.8, image: '/images/headphones.png' },
  { name: 'InstaChill 1 Ton AC', price: 28999, category: 'Air Conditioner', brand: 'Voltas', rating: 4.4, image: '/images/ac.png' },
];

const randomQty = () => Math.floor(Math.random() * 180) + 20;

export const seedDatabase = async () => {
  try {
    // Clear existing
    await User.deleteMany();
    await Product.deleteMany();
    await Hub.deleteMany();
    await Notification.deleteMany();
    await Order.deleteMany();

    // Seed users
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);

    const users = await User.create([
      { name: 'Admin Sarah', email: 'admin@quickmart.in', password: adminPass, role: 'admin', phone: '9876543210' },
      { name: 'Rahul Verma', email: 'rahul@email.com', password: userPass, role: 'user', phone: '9123456789' },
    ]);

    const rahulId = users[1]._id;

    // Seed sample orders for tracking demonstration
    const sampleOrders = [
      {
        orderId: 'QM-1001',
        user: rahulId,
        customerName: 'Rahul Verma',
        items: [{ name: 'Quantum X Pro Smartphone', price: 74999, quantity: 1, image: '/images/phone.png' }],
        status: 'shipped',
        statusHistory: [
          { status: 'placed', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Order placed' },
          { status: 'packaging', timestamp: new Date(Date.now() - 86400000), note: 'Packed at Mumbai Hub' },
          { status: 'shipped', timestamp: new Date(), note: 'In Transit to Bangalore Hub' }
        ],
        totalAmount: 74999,
        paymentMethod: 'razorpay'
      },
      {
        orderId: 'QM-1002',
        user: rahulId,
        customerName: 'Rahul Verma',
        items: [{ name: 'SlatePro 11" Tablet', price: 54999, quantity: 1, image: '/images/tablet.png' }],
        status: 'packaging',
        statusHistory: [
          { status: 'placed', timestamp: new Date(Date.now() - 43200000), note: 'Order received' },
          { status: 'packaging', timestamp: new Date(), note: 'Under quality check at Delhi Hub' }
        ],
        totalAmount: 54999,
        paymentMethod: 'razorpay'
      },
      {
        orderId: 'MS-2055',
        user: rahulId,
        customerName: 'Priya Sharma',
        items: [{ name: 'Vision 65" 8K OLED TV', price: 145000, quantity: 1, image: '/images/tv.png' }],
        status: 'delivered',
        statusHistory: [
          { status: 'placed', timestamp: new Date(Date.now() - 86400000 * 5), note: 'Order placed' },
          { status: 'shipped', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Dispatched from Kolkata Hub' },
          { status: 'delivered', timestamp: new Date(Date.now() - 86400000), note: 'Handed over to customer' }
        ],
        totalAmount: 145000,
        paymentMethod: 'razorpay'
      },
      {
        orderId: 'QM-1003',
        user: rahulId,
        customerName: 'Amit Kumar',
        items: [{ name: 'AuraSonic Pro Wireless', price: 14999, quantity: 2, image: '/images/headphones.png' }],
        status: 'out_for_delivery',
        statusHistory: [
          { status: 'placed', timestamp: new Date(Date.now() - 86400000), note: 'Order confirmed' },
          { status: 'shipped', timestamp: new Date(Date.now() - 21600000), note: 'Arrived at Chennai Hub' },
          { status: 'out_for_delivery', timestamp: new Date(), note: 'Out for delivery with Arjun' }
        ],
        totalAmount: 29998,
        paymentMethod: 'cod'
      },
      {
        orderId: 'QM-1004',
        user: rahulId,
        customerName: 'Sneha Kapur',
        items: [{ name: 'ZenBook Ultra 14"', price: 89999, quantity: 1, image: '/images/laptop.png' }],
        status: 'confirmed',
        statusHistory: [
          { status: 'placed', timestamp: new Date(Date.now() - 3600000), note: 'Waiting for payment' },
          { status: 'confirmed', timestamp: new Date(), note: 'Payment successful, order confirmed' }
        ],
        totalAmount: 89999,
        paymentMethod: 'razorpay'
      }
    ];

    await Order.create(sampleOrders);

    // Seed hubs
    await Hub.create(hubs);

    // Seed products with city-wise stock
    const productsWithStock = productData.map(p => ({
      ...p,
      stock: cities.map(city => ({
        hub: `${city} Hub`,
        city,
        quantity: randomQty(),
      })),
    }));

    await Product.create(productsWithStock);

    // Seed a welcome notification
    await Notification.create({
      type: 'system',
      title: 'Welcome to Quick Mart Admin',
      message: 'Your dashboard is ready. All systems operational with 5 hubs and 15 products loaded.',
      isRead: false,
    });

    console.log('✅ Database seeded: 2 users, 5 hubs, 15 products');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};
