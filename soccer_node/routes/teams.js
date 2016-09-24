var express = require('express');
var http = require('http');
var connection = require('../config/mysql');
var _ = require('underscore');
var router = express.Router();
var db = connection();

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}


router.get('/', function(req, res) {
	db.query('SELECT * FROM `soccer_teams`', [], function(err, rows, fields){
		if(err) { 
			res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
			console.log('Unable to get data. Error is :' + err.message);										
		}else{
			if(rows.length >= 1){
				res.status(200).json({status:false, message: "", data : rows});
			}else{
				res.status(200).json({status:false, message: "No data found", data : null});
			}
		}
	});
});

router.post('/', function(req, res){
	if( req.body.name ){
		var teamName = req.body.name;
		db.query('SELECT `name` FROM `soccer_teams` WHERE `name` LIKE ?', [ teamName], function(err, rows, fields){
			if(err) { 
				res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
				console.log('Unable to get data. Error is :' + err.message);										
			}else{
				if(rows.length >= 1){
					res.status(200).json({status:false, message: "Team name is already there, please try different name.", data : null});
				}else{
					db.query('INSERT INTO `soccer_teams` (`id`, `name`) VALUES (NULL, ?)', [ teamName ], function(err, result){
						if(err) { 
							res.status(200).json({status:false, message: "Unable to insert data into Database", data : null});
							console.log('Unable to Inert data into table. Error is :' + err.message);										
						}else{
							res.status(200).json({status:true, message: "Team is added successfully", data : null});
						}
					});
				}
			}
		});

	}else{
		res.status(200).json({status:false, message: "Please send required data", data : null});
	}
});



module.exports = router;