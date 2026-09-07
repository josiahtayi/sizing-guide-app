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

// Cache for product images to reduce API calls
// Images cached for 1 hour (3600000 ms)
const imageCache = {};
const CACHE_DURATION = 3600000; // 1 hour
const imageCacheTime = {};

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const handle in imageCacheTime) {
    if (now - imageCacheTime[handle] > CACHE_DURATION) {
      delete imageCache[handle];
      delete imageCacheTime[handle];
      console.log(`Cleared cache for ${handle}`);
    }
  }
}, CACHE_DURATION);


// Function to fetch product image from Shopify
async function getProductImage(handle) {
  // Check cache first
  if (imageCache[handle]) {
    console.log(`[CACHE HIT] ${handle}`);
    return imageCache[handle];
  }

  try {
    const url = `https://${SHOPIFY_STORE}/products/${handle}.json`;
    console.log(`[FETCH] Fetching ${url}`);
    
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Shopify-Sizing-Guide-App/1.0'
      }
    });
    
    console.log(`[SUCCESS] Got response for ${handle}`);
    
    if (response.data && response.data.product) {
      const images = response.data.product.images;
      console.log(`[IMAGES] Found ${images.length} images for ${handle}`);
      
      if (images && images.length > 0) {
        let imageUrl = images[0].src;
        console.log(`[URL] Original: ${imageUrl}`);
        
        // Ensure HTTPS
        if (!imageUrl.startsWith('http')) {
          imageUrl = 'https:' + imageUrl;
        }
        console.log(`[URL] Final: ${imageUrl}`);
        
        // Cache it with timestamp
        imageCache[handle] = imageUrl;
        imageCacheTime[handle] = Date.now();
        return imageUrl;
      } else {
        console.log(`[ERROR] No images found for ${handle}`);
      }
    } else {
      console.log(`[ERROR] Invalid response structure for ${handle}`);
    }
  } catch (error) {
    console.log(`[FETCH ERROR] ${handle}: ${error.message}`);
  }
  
  console.log(`[FALLBACK] Returning empty string for ${handle}`);
  return '';
}

// API endpoint to get products with images
app.get('/api/products', async (req, res) => {
  try {
    const products = [];

    // Fetch all products with their images in parallel
    const productPromises = Object.entries(productsData).map(async ([handle, data]) => {
      const imageUrl = await getProductImage(handle);
      
      return {
        handle,
        name: data.name,
        description: data.description,
        compression: data.compression,
        type: data.type,
        sizes: data.sizes,
        imageUrl: imageUrl,
        productUrl: `https://${SHOPIFY_STORE}/products/${handle}`
      };
    });

    const allProducts = await Promise.all(productPromises);
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Manual cache clear endpoint (for admin use)
app.post('/api/cache/clear', (req, res) => {
  Object.keys(imageCache).forEach(key => delete imageCache[key]);
  Object.keys(imageCacheTime).forEach(key => delete imageCacheTime[key]);
  console.log('Image cache cleared');
  res.json({ status: 'Cache cleared successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  const cachedHandles = Object.keys(imageCache);
  res.json({ 
    status: 'ok',
    totalProducts: Object.keys(productsData).length,
    cachedImages: cachedHandles.length,
    cachedProducts: cachedHandles,
    store: SHOPIFY_STORE
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Sizing guide app running on http://localhost:${PORT}`);
});