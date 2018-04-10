"use strict"
const express = require('express');
const router = express.Router();

module.exports = function() {
  router.get('/helloworld', (req, res) => {
    res.send('hello world')
  });
  return router;
}
