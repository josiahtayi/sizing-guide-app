require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web/frontend')));

// Shopify API credentials (from environment variables)
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'estasbel.com.au';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Map of product handles to their data
const productsData = {
  "malia-core-support-and-sculpting-faja-shapewear": {
    name: "Malia",
    description: "Core support and sculpting",
    compression: "High",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "ana-postpartum-and-sculpting-faja-shapewear-strong": {
    name: "Ana",
    description: "Postpartum and sculpting",
    compression: "Strong",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "josefina-sculpting-faja-shapewear": {
    name: "Josefina",
    description: "Sculpting shapewear",
    compression: "Medium",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "camilla-ultra-moulding-hourglass-faja-shapewear": {
    name: "Camilla",
    description: "Ultra moulding hourglass",
    compression: "High",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "blanca-invisible-butt-lifter-shorts-lift-compression": {
    name: "Blanca",
    description: "Butt lifter shorts",
    compression: "Medium",
    type: "Shorts",
    sizes: {
      "XS": { waist: [60, 64], hips: [85, 89] },
      "S": { waist: [65, 69], hips: [90, 94] },
      "M": { waist: [70, 74], hips: [95, 99] },
      "L": { waist: [75, 79], hips: [100, 104] },
      "XL": { waist: [80, 84], hips: [105, 109] },
      "2XL": { waist: [85, 89], hips: [110, 114] },
      "3XL": { waist: [90, 95], hips: [115, 119] }
    }
  },
  "high-waist-bicycle-short": {
    name: "Bicycle Short",
    description: "High-waist shorts",
    compression: "Medium",
    type: "Shorts",
    sizes: {
      "S": { waist: [68, 73], hips: [95, 100] },
      "M": { waist: [74, 79], hips: [101, 106] },
      "L": { waist: [80, 85], hips: [107, 112] },
      "XL": { waist: [86, 91], hips: [113, 118] },
      "2XL": { waist: [92, 100], hips: [119, 124] },
      "3XL": { waist: [101, 110], hips: [125, 130] }
    }
  },
  "valentina-sculpting-faja-shapewear": {
    name: "Valentina",
    description: "Sculpting shapewear",
    compression: "Medium",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "high-waist-full-length-legging": {
    name: "Full Length Legging",
    description: "Full length leggings",
    compression: "Medium",
    type: "Leggings",
    sizes: {
      "S": { waist: [68, 73], hips: [95, 100] },
      "M": { waist: [74, 79], hips: [101, 106] },
      "L": { waist: [80, 85], hips: [107, 112] },
      "XL": { waist: [86, 91], hips: [113, 118] },
      "2XL": { waist: [92, 100], hips: [119, 124] },
      "3XL": { waist: [101, 110], hips: [125, 130] }
    }
  },
  "premium-full-length-tights": {
    name: "Premium Tights",
    description: "Premium full length tights",
    compression: "Medium",
    type: "Tights",
    sizes: {
      "S": { waist: [68, 73], hips: [95, 100] },
      "M": { waist: [74, 79], hips: [101, 106] },
      "L": { waist: [80, 85], hips: [107, 112] },
      "XL": { waist: [86, 91], hips: [113, 118] },
      "2XL": { waist: [92, 100], hips: [119, 124] },
      "3XL": { waist: [101, 110], hips: [125, 130] }
    }
  },
  "evelyn-strapless-sculpting-hourglass-faja-shapewear": {
    name: "Evelyn",
    description: "Strapless sculpting hourglass",
    compression: "High",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "christina-ultra-moulding-hourglass-faja-shapewear": {
    name: "Christina",
    description: "Ultra moulding hourglass",
    compression: "High",
    type: "Faja",
    sizes: {
      "S": { waist: [65, 70], hips: [85, 89] },
      "M": { waist: [71, 76], hips: [90, 94] },
      "L": { waist: [77, 82], hips: [95, 99] },
      "XL": { waist: [83, 88], hips: [100, 105] },
      "2XL": { waist: [89, 94], hips: [106, 112] },
      "3XL": { waist: [95, 100], hips: [113, 119] }
    }
  },
  "carmen-strapless-core-support-and-sculpting-faja-shapewear": {
    name: "Carmen",
    description: "Strapless core support",
    compression: "High",
    type: "Faja",
    sizes: {}
  }
};

// API endpoint to get products with images
app.get('/api/products', async (req, res) => {
  try {
    const products = [];

    for (const [handle, data] of Object.entries(productsData)) {
      let imageUrl = '';

      // Try to fetch product image from Shopify public API
      try {
        const response = await axios.get(`https://${SHOPIFY_STORE}/products/${handle}.json`);
        if (response.data.product && response.data.product.images.length > 0) {
          imageUrl = response.data.product.images[0].src;
          if (!imageUrl.startsWith('http')) {
            imageUrl = 'https:' + imageUrl;
          }
        }
      } catch (error) {
        console.log(`Could not fetch image for ${handle}`);
      }

      products.push({
        handle,
        name: data.name,
        description: data.description,
        compression: data.compression,
        type: data.type,
        sizes: data.sizes,
        imageUrl: imageUrl,
        productUrl: `/products/${handle}`
      });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Sizing guide app running on http://localhost:${PORT}`);
});