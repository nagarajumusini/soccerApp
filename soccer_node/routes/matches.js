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
	db.query('SELECT id, lteam_id as lid, rteam_id as rid, (SELECT name FROM soccer_teams WHERE id = lid ) as lname, (SELECT name FROM soccer_teams WHERE id = rid) as rname, date FROM `soccer_matches`', [], function(err, rows, fields){
		if(err) { 
			res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
			console.log('Unable to get data. Error is :' + err.message);										
		}else{
			if(rows.length >= 1){
				res.status(200).json({ status:true, message: '', data: rows});
			}else{
				res.status(200).json({ status:false, message: 'No matches found', data: null});
			}
		}
	});
});

router.post('/', function(req, res){
	if( req.body.lteam_id && req.body.rteam_id && req.body.date){
		
		var lteam_id = parseInt(req.body.lteam_id);
		var rteam_id = parseInt(req.body.rteam_id);
		var date = req.body.date;
		if( isInt(lteam_id) &&  isInt(rteam_id) ){
			if( lteam_id == rteam_id ){
				// same team can not play as opponent
				res.status(200).json({status:false, message: "Please Make match between 2 different teams.", data : null});
			}else{
				db.query('INSERT INTO `soccer_matches` (`id`, `lteam_id`, `rteam_id`, `date`) VALUES (NULL, ?, ?, ?)', [ lteam_id, rteam_id, date], function(err, result){
					if(err) { 
						res.status(200).json({status:false, message: "Unable to insert data into Database", data : null});
						console.log('Unable to Inert data into table. Error is :' + err.message);										
					}else{
						res.status(200).json({status:true, message: "Match is added successfully", data : null});
					}
				});
			}
		}else{
			res.status(200).json({status:false, message: "Invalid data sent", data : null});
		}
	}else{
		res.status(200).json({status:false, message: "Please send required data", data : null});
	}
});



module.exports = router;