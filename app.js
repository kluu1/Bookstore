const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// setup express app
const app = express();

// connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('connected to database..'));

// import routes
const userRoutes = require('./routes/user');

// routes middleware
app.use('/api', userRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`server is listening on ${port}`));
