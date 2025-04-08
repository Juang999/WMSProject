var express = require('express');
var router = express.Router();
const {config} = require('../config/environment');
const {important} = require('../helper/Logging');

/* GET home page. */
router.get('/', async function(req, res, next) {
  await important(`${req.ip} trying to access root route`);
  res.redirect(config.parsed.URL_REDIRECT)
});

module.exports = router;
