
const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middlewares/authMiddleware');
const Product = require('../models/Product');

// @route   GET api/product
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/product
// @desc    Create a new product
// @access  Private/Seller
router.post('/', protect, seller, async (req, res) => {
  const { name, description, price, quantity, category, image } = req.body;
  
  try {
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
      storeId: req.user._id,
      storeName: req.user.name,
      image: image || 'placeholder.jpg'
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/product/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/product/:id
// @desc    Update a product
// @access  Private/Seller
router.put('/:id', protect, seller, async (req, res) => {
  const { name, description, price, quantity, category, image } = req.body;
  
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is the product owner
    if (product.storeId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      quantity: quantity || product.quantity,
      category: category || product.category,
      image: image || product.image
    }, { new: true });
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/product/:id
// @desc    Delete a product
// @access  Private/Seller
router.delete('/:id', protect, seller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is the product owner
    if (product.storeId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
