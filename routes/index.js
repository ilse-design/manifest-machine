var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Democratic manifest' });
});


//exports.index = function(req, res){
//res.render('index', { title: 'Democratic Manifest' });};

module.exports = router;
