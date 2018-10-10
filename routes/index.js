var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET TEST
router.get('/getTest', function(req, res, next){

	let jsonData = {
		name: 'Tung Dinh',
		Location: 'TMA',
		Status: 'Working'
	};

	res.json({user: jsonData});
});

module.exports = router;
