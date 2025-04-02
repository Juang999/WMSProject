var express = require('express');
var router = express.Router();
const {config} = require('../config/environment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect(config.parsed.URL_REDIRECT)
});

module.exports = router;
