import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

// Load environment variables
dotenv.config();

// Sample product data for an elegant jewelry store
const products = [
  // Earrings
  {
    name: 'Golden Teardrop Earrings',
    description: 'Elegant 18k gold-plated teardrop earrings with intricate filigree work. Perfect for special occasions and adding a touch of sophistication to any outfit.',
    price: 89.99,
    category: 'earrings',
    images: ['/images/products/earrings-1.jpg'],
    stock: 25,
    featured: true,
    ratings: { average: 4.8, count: 124 }
  },
  {
    name: 'Pearl Drop Chandeliers',
    description: 'Stunning chandelier earrings featuring genuine freshwater pearls and delicate gold-tone chains. A timeless piece that exudes elegance.',
    price: 129.99,
    category: 'earrings',
    images: ['/images/products/earrings-2.jpg'],
    stock: 18,
    featured: true,
    ratings: { average: 4.9, count: 89 }
  },
  {
    name: 'Crystal Stud Collection',
    description: 'Set of three stunning crystal stud earrings in varying sizes. Swarovski-inspired crystals that catch the light beautifully.',
    price: 49.99,
    category: 'earrings',
    images: ['/images/products/earrings-3.jpg'],
    stock: 50,
    featured: false,
    ratings: { average: 4.6, count: 203 }
  },
  {
    name: 'Rose Gold Hoops',
    description: 'Modern minimalist rose gold hoop earrings. Lightweight and comfortable for everyday wear with a subtle shimmer.',
    price: 59.99,
    category: 'earrings',
    images: ['/images/products/earrings-4.jpg'],
    stock: 35,
    featured: true,
    ratings: { average: 4.7, count: 156 }
  },
  {
    name: 'Vintage Emerald Drops',
    description: 'Art deco inspired drop earrings featuring emerald green gemstones surrounded by cubic zirconia in antique gold setting.',
    price: 149.99,
    category: 'earrings',
    images: ['/images/products/earrings-5.jpg'],
    stock: 12,
    featured: false,
    ratings: { average: 4.9, count: 67 }
  },

  // Necklaces
  {
    name: 'Delicate Gold Chain',
    description: 'Minimalist 16-inch gold-plated chain necklace. Perfect for layering or wearing alone for a subtle, elegant look.',
    price: 39.99,
    category: 'necklaces',
    images: ['/images/products/necklace-1.jpg'],
    stock: 60,
    featured: true,
    ratings: { average: 4.5, count: 312 }
  },
  {
    name: 'Pearl Pendant Necklace',
    description: 'Classic single freshwater pearl pendant on a sterling silver chain. Adjustable length from 16 to 18 inches.',
    price: 79.99,
    category: 'necklaces',
    images: ['/images/products/necklace-2.jpg'],
    stock: 28,
    featured: true,
    ratings: { average: 4.8, count: 178 }
  },
  {
    name: 'Layered Crystal Choker',
    description: 'Trendy multi-layered choker necklace with crystal accents. Adjustable clasp for perfect fit.',
    price: 69.99,
    category: 'necklaces',
    images: ['/images/products/necklace-3.jpg'],
    stock: 22,
    featured: false,
    ratings: { average: 4.4, count: 95 }
  },
  {
    name: 'Heart Locket Pendant',
    description: 'Romantic heart-shaped locket in rose gold finish. Opens to hold two small photos. Comes with 18-inch chain.',
    price: 99.99,
    category: 'necklaces',
    images: ['/images/products/necklace-4.jpg'],
    stock: 15,
    featured: false,
    ratings: { average: 4.7, count: 134 }
  },

  // Bracelets
  {
    name: 'Tennis Bracelet Classic',
    description: 'Stunning cubic zirconia tennis bracelet in rhodium plating. Features secure box clasp with safety latch.',
    price: 119.99,
    category: 'bracelets',
    images: ['/images/products/bracelet-1.jpg'],
    stock: 20,
    featured: true,
    ratings: { average: 4.9, count: 245 }
  },
  {
    name: 'Gold Charm Bracelet',
    description: 'Delicate gold-plated chain bracelet with five interchangeable charms. Perfect gift for any occasion.',
    price: 89.99,
    category: 'bracelets',
    images: ['/images/products/bracelet-2.jpg'],
    stock: 30,
    featured: true,
    ratings: { average: 4.6, count: 167 }
  },
  {
    name: 'Beaded Pearl Bracelet',
    description: 'Elegant freshwater pearl bracelet with gold-filled spacer beads. Stretchy for easy wear.',
    price: 59.99,
    category: 'bracelets',
    images: ['/images/products/bracelet-3.jpg'],
    stock: 40,
    featured: false,
    ratings: { average: 4.5, count: 112 }
  },
  {
    name: 'Minimalist Cuff',
    description: 'Sleek modern cuff bracelet in polished silver. Adjustable to fit most wrist sizes.',
    price: 45.99,
    category: 'bracelets',
    images: ['/images/products/bracelet-4.jpg'],
    stock: 25,
    featured: false,
    ratings: { average: 4.3, count: 89 }
  },

  // Clips
  {
    name: 'Pearl Hair Clips Set',
    description: 'Set of 4 elegant pearl-adorned hair clips in gold finish. Various sizes for versatile styling.',
    price: 34.99,
    category: 'clips',
    images: ['/images/products/clips-1.jpg'],
    stock: 45,
    featured: true,
    ratings: { average: 4.7, count: 234 }
  },
  {
    name: 'Crystal Butterfly Clip',
    description: 'Stunning butterfly-shaped hair clip encrusted with sparkling crystals. Perfect for special occasions.',
    price: 29.99,
    category: 'clips',
    images: ['/images/products/clips-2.jpg'],
    stock: 35,
    featured: false,
    ratings: { average: 4.6, count: 178 }
  },
  {
    name: 'Vintage Gold Barrettes',
    description: 'Set of 3 vintage-inspired gold barrettes with intricate leaf designs. Strong grip for all hair types.',
    price: 39.99,
    category: 'clips',
    images: ['/images/products/clips-3.jpg'],
    stock: 28,
    featured: false,
    ratings: { average: 4.5, count: 145 }
  },

  // Accessories
  {
    name: 'Silk Scrunchie Collection',
    description: 'Set of 5 luxurious silk scrunchies in neutral tones. Gentle on hair, preventing breakage and creasing.',
    price: 24.99,
    category: 'accessories',
    images: ['/images/products/accessory-1.jpg'],
    stock: 55,
    featured: true,
    ratings: { average: 4.8, count: 456 }
  },
  {
    name: 'Jewelry Travel Case',
    description: 'Compact leather jewelry organizer with velvet interior. Perfect for keeping your jewelry safe while traveling.',
    price: 49.99,
    category: 'accessories',
    images: ['/images/products/accessory-2.jpg'],
    stock: 20,
    featured: false,
    ratings: { average: 4.9, count: 123 }
  },
  {
    name: 'Gold Ring Set',
    description: 'Set of 5 stackable gold-plated rings in various designs. Mix and match for your perfect look.',
    price: 44.99,
    category: 'accessories',
    images: ['/images/products/accessory-3.jpg'],
    stock: 38,
    featured: true,
    ratings: { average: 4.6, count: 289 }
  },
  {
    name: 'Velvet Jewelry Box',
    description: 'Elegant velvet-lined jewelry box with multiple compartments. Features ring rolls and necklace hooks.',
    price: 79.99,
    category: 'accessories',
    images: ['/images/products/accessory-4.jpg'],
    stock: 15,
    featured: false,
    ratings: { average: 4.7, count: 98 }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully added ${insertedProducts.length} products to the database!`);

    // Summary
    console.log('\n--- Database Seed Summary ---');
    const categories = ['earrings', 'necklaces', 'bracelets', 'clips', 'accessories'];
    for (const cat of categories) {
      const count = insertedProducts.filter(p => p.category === cat).length;
      console.log(`${cat}: ${count} products`);
    }
    console.log(`Featured products: ${insertedProducts.filter(p => p.featured).length}`);
    console.log('-----------------------------\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
