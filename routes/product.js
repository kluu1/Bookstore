const express = require('express');
const router = express.Router();

const {
  createProduct,
  productById,
  getProduct,
  removeProduct,
  updateProduct,
  getAllProducts,
  getRelated,
  getCategories,
  getBySearch,
  photo
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', getProduct);
router.post('/product/createProduct/:userId', requireSignin, isAuth, isAdmin, createProduct);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, removeProduct);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct);
router.get('/products', getAllProducts);
router.get('/products/related/:productId', getRelated);
router.get('/products/categories', getCategories);
router.post('/products/by/search', getBySearch);
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
