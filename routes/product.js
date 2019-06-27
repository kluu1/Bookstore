const express = require('express');
const router = express.Router();

const {
  createProduct,
  productById,
  getProduct,
  removeProduct,
  updateProduct,
  getAllProducts
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', getProduct);

router.post(
  '/product/createProduct/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  createProduct
);

router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  removeProduct
);

router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  updateProduct
);

router.get('/products', getAllProducts);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
