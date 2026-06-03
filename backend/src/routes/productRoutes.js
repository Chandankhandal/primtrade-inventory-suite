const express = require('express');
const router = express.Router();
const { createProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getProduct);

router.post('/', protect, admin, createProduct);

router.put('/:id', protect, admin, updateProduct);

router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;