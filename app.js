const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// import routes
const userRoutes = require('./routes/user');

// setup express app
const app = express();
app.use(bodyParser.json());
app.use(expressValidator());

// connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('connected to database..'));

// middlewares

app.use(morgan('dev'));
app.use(cookieParser());

// routes middleware
app.use('/api', userRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`server is listening on ${port}`));
