const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id).exec();
    req.category = category;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Category does not exist' });
  }
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const data = await category.save();
    res.json({ data });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

exports.updateCategory = async (req, res) => {
  const { category } = req;
  try {
    category.name = req.body.name;
    const data = await category.save();
    res.json(data);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

exports.deleteCategory = async (req, res) => {
  const { category } = req;
  try {
    await category.remove();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const data = await Category.find().exec();
    res.json(data);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};
