const axios = require('axios');
const mysql = require('mysql2/promise');

// Connect to the MySQL database
const db = mysql.createPool({
  host: '127.0.0.1',       // Hostname
  port: 3306,              // MySQL default port
  user: 'root',            // Username
  password: 'parola123',   // Password
  database: 'store2',      // Your database name
});

async function populateDatabase() {
  try {
    // Step 1: Fetch Categories from FakeStore API
    const categoriesResponse = await axios.get('https://fakestoreapi.com/products/categories');
    const categories = categoriesResponse.data;

    console.log('Inserting Categories...');
    const categoryMap = {}; // Map to store category names and their IDs
    for (const category of categories) {
      const [result] = await db.query('INSERT INTO Category (name, description) VALUES (?, ?)', [
        category,
        `Description for ${category}`, // Add a generic description
      ]);
      categoryMap[category] = result.insertId; // Map category name to its auto-generated ID
    }

    console.log('Inserted Categories:', categoryMap);

    // Step 2: Fetch Products from FakeStore API
    const productsResponse = await axios.get('https://fakestoreapi.com/products');
    const products = productsResponse.data.slice(0, 25); // Limit to 25 products

    console.log('Inserting Products...');
    for (const product of products) {
      const categoryId = categoryMap[product.category]; // Get the corresponding category ID

      if (!categoryId) {
        console.error(`Category "${product.category}" not found in database!`);
        continue;
      }

      await db.query(
        'INSERT INTO Product (title, price, image, categoryId) VALUES (?, ?, ?, ?)',
        [product.title, product.price, product.image, categoryId]
      );
    }

    console.log('25 Products successfully inserted.');
  } catch (error) {
    console.error('Error populating database:', error.message);
  } finally {
    db.end();
  }
}

populateDatabase();
