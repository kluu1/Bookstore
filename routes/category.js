const express = require('express');
const router = express.Router();

const {
  create,
  categoryById,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', getCategory);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
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
router.get('/categories', getAllCategories);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
