// require
const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
require('dotenv').config();
const port = process.env.PORT || 3000;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use('/api', routes);
app.use('/uploads', express.static('uploads')); //serve avatar path from Users database

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.error || err.message || 'Internal server error'
  return res.status(status).json({
    status: status,
    error: error 
  })
})

// routes
app.listen(port, () => {
  console.log(`Port running on localhost:${port}`);
});


