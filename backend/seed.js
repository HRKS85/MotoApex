// backend/seeder.js

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleProducts = [
  // HELMETS
  {
    name: "Apex Carbon Fiber Full-Face Helmet",
    description: "Ultra-lightweight aerodynamic shell engineered for track days and high-speed touring.",
    price: 34999, originalPrice: 39999, discountPercentage: 12, category: "Helmets",
    images: [
      "https://m.media-amazon.com/images/I/61FYlYtnZCL._SY450_.jpg",
      "https://m.media-amazon.com/images/I/615gz4wonML._SY450_.jpg",
      "https://m.media-amazon.com/images/I/31PZxkxDr+L._SS40_.jpg"
    ],
    stock: 12, specs: { material: "Carbon Fiber", certification: "ECE 22.06 & DOT", sizes: ["M", "L", "XL"] },
    averageRating: 4.8, isFeaturedDeal: true
  },
  {
    name: "Thunder Dual-Visor Touring Helmet",
    description: "Integrated sun shield, pinlock-ready visor, and multi-channel ventilation.",
    price: 11999, originalPrice: 14999, discountPercentage: 20, category: "Helmets",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc"],
    stock: 25, specs: { material: "Polycarbonate", certification: "ECE 22.05", sizes: ["S", "M", "L"] },
    averageRating: 4.5, isFeaturedDeal: false
  },
  {
    name: "Viper Modular Flip-Up Helmet",
    description: "One-hand flip mechanism, Bluetooth intercom cutout, and noise-damping chin curtain.",
    price: 16499, originalPrice: 18999, discountPercentage: 13, category: "Helmets",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc"],
    stock: 18, specs: { material: "ABS Composite", certification: "DOT", sizes: ["M", "L", "XL"] },
    averageRating: 4.4, isFeaturedDeal: false
  },
  {
    name: "Raid MX Enduro Dirt Helmet",
    description: "Extended roost peak, emergency quick-release cheek pads, and high-flow air intake.",
    price: 9999, originalPrice: 11999, discountPercentage: 16, category: "Helmets",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc"],
    stock: 15, specs: { material: "Thermo-resin", certification: "ECE 22.06", sizes: ["S", "M", "L", "XL"] },
    averageRating: 4.7, isFeaturedDeal: false
  },
  {
    name: "Classic Retro Open-Face Cruiser Helmet",
    description: "Vintage stitch trim with chrome accents and magnetic peak attachment.",
    price: 6999, originalPrice: 8499, discountPercentage: 17, category: "Helmets",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc"],
    stock: 30, specs: { material: "Fiberglass", certification: "DOT", sizes: ["M", "L"] },
    averageRating: 4.3, isFeaturedDeal: false
  },

  // JACKETS
  {
    name: "Titan Armored All-Weather Mesh Jacket",
    description: "Heavy-duty 600D cordura, CE Level 2 shoulder and elbow protectors, and removable thermal liner.",
    price: 14499, originalPrice: 17999, discountPercentage: 19, category: "Jackets",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
    stock: 20, specs: { material: "600D Cordura Mesh", certification: "CE Level 2", sizes: ["S", "M", "L", "XL"] },
    averageRating: 4.9, isFeaturedDeal: true
  },
  {
    name: "Rebel Distressed Cowhide Leather Jacket",
    description: "Genuine 1.2mm top-grain leather with hidden armor pockets and accordion stretch panels.",
    price: 22999, originalPrice: 26999, discountPercentage: 15, category: "Jackets",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
    stock: 10, specs: { material: "Cowhide Leather", certification: "CE Level 1", sizes: ["M", "L", "XL"] },
    averageRating: 4.7, isFeaturedDeal: false
  },
  {
    name: "Trans-Continental ADV Touring Jacket",
    description: "Waterproof Hydratex membrane, camel-pack hydration pocket, and 360-degree reflective piping.",
    price: 28999, originalPrice: 32999, discountPercentage: 12, category: "Jackets",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
    stock: 8, specs: { material: "Gore-Tex Cordura", certification: "CE Level 2", sizes: ["M", "L", "XL", "XXL"] },
    averageRating: 4.9, isFeaturedDeal: false
  },
  {
    name: "Urban Stealth Kevlar Riding Hoodie",
    description: "Casual looks backed with full DuPont Kevlar lining and ultra-slim D3O armor inserts.",
    price: 8999, originalPrice: 10499, discountPercentage: 14, category: "Jackets",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
    stock: 22, specs: { material: "Cotton Fleece + Kevlar", certification: "CE Level 1", sizes: ["S", "M", "L"] },
    averageRating: 4.6, isFeaturedDeal: false
  },
  {
    name: "Monsoon Waterproof Storm Over-Jacket",
    description: "10,000mm hydrostatic head waterproof rating with welded seams and adjustable cuffs.",
    price: 3499, originalPrice: 4299, discountPercentage: 18, category: "Jackets",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
    stock: 40, specs: { material: "Ripstop Nylon", certification: "Hi-Viz EN 471", sizes: ["M", "L", "XL"] },
    averageRating: 4.2, isFeaturedDeal: false
  },

  // GLOVES
  {
    name: "Gauntlet Track Pro Racing Gloves",
    description: "Full-grain goat leather, carbon knuckle sliders, and bridge between pinky and ring finger.",
    price: 7999, originalPrice: 9499, discountPercentage: 16, category: "Gloves",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
    stock: 35, specs: { material: "Goatskin & Carbon", certification: "KP Level 1", sizes: ["M", "L", "XL"] },
    averageRating: 4.8, isFeaturedDeal: true
  },
  {
    name: "Air-Flow Summer Mesh Riding Gloves",
    description: "Breathable 3D mesh chassis with TPU knuckle guards and touchscreen-compatible index tips.",
    price: 2499, originalPrice: 2999, discountPercentage: 17, category: "Gloves",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
    stock: 50, specs: { material: "Air-Mesh & Clarino", certification: "Basic", sizes: ["S", "M", "L", "XL"] },
    averageRating: 4.4, isFeaturedDeal: false
  },
  {
    name: "Sub-Zero Thermal Heated Gloves",
    description: "Integrated battery-operated heating elements with 3 temperature modes and Thinsulate lining.",
    price: 11999, originalPrice: 13999, discountPercentage: 14, category: "Gloves",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
    stock: 12, specs: { material: "Leather + 3M Thinsulate", certification: "CE Certified", sizes: ["M", "L"] },
    averageRating: 4.7, isFeaturedDeal: false
  },
  {
    name: "Outlaw Leather Short-Cuff Gloves",
    description: "Classic perforated leather styling with hidden molded knuckles and brass stud accents.",
    price: 3899, originalPrice: 4499, discountPercentage: 13, category: "Gloves",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
    stock: 28, specs: { material: "Full-Grain Cowhide", certification: "Basic", sizes: ["S", "M", "L"] },
    averageRating: 4.5, isFeaturedDeal: false
  },
  {
    name: "Storm-Shield Gore-Tex Waterproof Gloves",
    description: "100% waterproof Gore-Tex breathable membrane with visor wiper blade on left thumb.",
    price: 6499, originalPrice: 7499, discountPercentage: 13, category: "Gloves",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363"],
    stock: 20, specs: { material: "Gore-Tex Textile", certification: "KP Level 1", sizes: ["M", "L", "XL"] },
    averageRating: 4.6, isFeaturedDeal: false
  }
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log("Database seeded with sample products successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();