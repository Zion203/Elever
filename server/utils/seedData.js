import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Seed the database with sample products and an admin user
 * Run with: node utils/seedData.js
 */

const sampleProducts = [
  {
    name: 'Golden Hoop Elegance',
    description: 'Classic gold-plated hoop earrings with a modern twist. Perfect for everyday elegance.',
    price: 45.99,
    category: 'earrings',
    images: ['/images/products/golden-hoop.jpg'],
    stock: 50,
    featured: true,
    ratings: { average: 4.8, count: 124 },
  },
  {
    name: 'Pearl Drop Sophistication',
    description: 'Delicate freshwater pearl earrings with sterling silver hooks. Timeless sophistication.',
    price: 68.99,
    category: 'earrings',
    images: ['/images/products/pearl-drop.jpg'],
    stock: 35,
    featured: true,
    ratings: { average: 4.9, count: 89 },
  },
  {
    name: 'Crystal Chandelier Drops',
    description: 'Stunning crystal chandelier earrings for special occasions. Catch the light beautifully.',
    price: 89.99,
    category: 'earrings',
    images: ['/images/products/crystal-chandelier.jpg'],
    stock: 25,
    featured: true,
    ratings: { average: 4.7, count: 67 },
  },
  {
    name: 'Minimalist Diamond Studs',
    description: 'Simple yet stunning cubic zirconia studs. Essential for any jewelry collection.',
    price: 35.99,
    category: 'earrings',
    images: ['/images/products/diamond-studs.jpg'],
    stock: 100,
    featured: true,
    ratings: { average: 4.9, count: 215 },
  },
  {
    name: 'Vintage Rose Gold Clips',
    description: 'Non-pierced rose gold ear clips with intricate floral design. Vintage charm meets modern style.',
    price: 42.99,
    category: 'clips',
    images: ['/images/products/rose-gold-clips.jpg'],
    stock: 40,
    featured: true,
    ratings: { average: 4.6, count: 78 },
  },
  {
    name: 'Statement Pearl Cuffs',
    description: 'Bold pearl ear cuffs that require no piercing. Make a statement without commitment.',
    price: 38.99,
    category: 'clips',
    images: ['/images/products/pearl-cuffs.jpg'],
    stock: 45,
    featured: false,
    ratings: { average: 4.5, count: 56 },
  },
  {
    name: 'Layered Gold Chain Necklace',
    description: 'Three-layer gold chain necklace with delicate pendants. Perfect for layering.',
    price: 75.99,
    category: 'necklaces',
    images: ['/images/products/layered-necklace.jpg'],
    stock: 30,
    featured: true,
    ratings: { average: 4.8, count: 143 },
  },
  {
    name: 'Dainty Heart Pendant',
    description: 'Sweet heart pendant on a fine chain. A meaningful gift for someone special.',
    price: 49.99,
    category: 'necklaces',
    images: ['/images/products/heart-pendant.jpg'],
    stock: 55,
    featured: false,
    ratings: { average: 4.7, count: 98 },
  },
  {
    name: 'Tennis Bracelet Classic',
    description: 'Sparkling cubic zirconia tennis bracelet. Timeless elegance for any occasion.',
    price: 95.99,
    category: 'bracelets',
    images: ['/images/products/tennis-bracelet.jpg'],
    stock: 20,
    featured: true,
    ratings: { average: 4.9, count: 167 },
  },
  {
    name: 'Boho Charm Bracelet',
    description: 'Colorful charm bracelet with mixed metals and stones. Express your unique style.',
    price: 55.99,
    category: 'bracelets',
    images: ['/images/products/boho-bracelet.jpg'],
    stock: 35,
    featured: false,
    ratings: { average: 4.4, count: 82 },
  },
  {
    name: 'Silk Hair Scrunchie Set',
    description: 'Set of 5 pure silk scrunchies in elegant neutral tones. Gentle on hair.',
    price: 28.99,
    category: 'accessories',
    images: ['/images/products/silk-scrunchies.jpg'],
    stock: 80,
    featured: false,
    ratings: { average: 4.6, count: 234 },
  },
  {
    name: 'Crystal Hair Pins',
    description: 'Set of 3 crystal-embellished hair pins. Add sparkle to any hairstyle.',
    price: 24.99,
    category: 'accessories',
    images: ['/images/products/crystal-pins.jpg'],
    stock: 65,
    featured: false,
    ratings: { average: 4.5, count: 112 },
  },
];

export const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

export const createAdminUser = async (googleId, email, name) => {
  try {
    let admin = await User.findOne({ email });
    
    if (admin) {
      admin.role = 'admin';
      await admin.save();
      console.log(`✅ Updated ${email} to admin role`);
    } else {
      admin = await User.create({
        googleId,
        email,
        name,
        role: 'admin',
      });
      console.log(`✅ Created admin user: ${email}`);
    }
    
    return admin;
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    throw error;
  }
};

export default { seedProducts, createAdminUser };
