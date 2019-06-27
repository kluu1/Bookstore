const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).exec();
    req.product = product;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Product not found' });
  }
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    // validate all fields are present
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const product = new Product(fields);

    if (files.photo) {
      // restrict photo size to less than 1mb
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      res.json(result);
    });
  });
};

exports.removeProduct = async (req, res) => {
  const { product } = req;
  try {
    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    // validate all fields are present
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let { product } = req;
    product = _.extend(product, fields);

    if (files.photo) {
      // restrict photo size to less than 1mb
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(result);
    });
  });
};

/**
 * SELL / ARRIVAL
 * by sell: /products?sortBy=sold&orderBy=desc&limit=4
 * by arrival: /products?sortBy=createdAt&orderBy=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.getAllProducts = async (req, res) => {
  const orderBy = req.query.orderBy ? req.query.orderBy : 'asc';
  const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;

  try {
    const products = await Product.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, orderBy]])
      .limit(limit)
      .exec();
    res.send(products);
  } catch (err) {
    return res.status(400).json({ error: 'Products not found' });
  }
};
