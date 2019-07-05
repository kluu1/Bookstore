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

    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price || !category || !quantity || !shipping) {
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

    if (!name || !description || !price || !category || !quantity || !shipping) {
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

/**
 * find the products based on req product category
 * other products with the same category, will be returned
 */
exports.getRelated = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
  try {
    const products = await Product.find({
      _id: { $ne: req.product },
      category: req.product.category
    })
      .limit(limit)
      .populate('category', '_id name')
      .exec();
    res.send(products);
  } catch (err) {
    return res.status(400).json({ error: 'Products not found' });
  }
};

/**
 * return categories based on products
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', {});
    res.json(categories);
  } catch (err) {
    return res.status(400).json({ error: 'Categories not found' });
  }
};

/**
 * get products by search
 */
exports.getBySearch = async (req, res) => {
  const order = req.body.order ? req.body.order : 'desc';
  const sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  const limit = req.body.limit ? parseInt(req.body.limit, 10) : 100;
  const skip = parseInt(req.body.skip, 10);
  const findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    const products = await Product.find(findArgs)
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();
    res.json({ size: products.length, products });
  } catch (err) {
    return res.status(400).json({ error: 'Products not found' });
  }
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
