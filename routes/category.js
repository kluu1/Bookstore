const express = require('express');
const router = express.Router();

const {
  createCategory,
  categoryById,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../controllers/category');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/categories', getAllCategories);
router.get('/category/:categoryId', getCategory);

router.post(
  '/category/createCategory/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  createCategory
);

router.put(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  updateCategory
);

router.delete(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  deleteCategory
);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
