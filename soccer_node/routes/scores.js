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
	var playedTeams = [];
	var data = [];
	db.query('SELECT lteam_id, rteam_id FROM `soccer_matches` WHERE date <= now()', [], function(err, rows, fields){
		if(err) {
			res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
			console.log('Unable to get data. Error is :' + err.message);										
		}else{
			var itemsProcessed = 0;
			if(rows.length >= 1){
				rows.forEach(function(one){
					playedTeams.push(one.lteam_id);
					playedTeams.push(one.rteam_id);
					itemsProcessed++;
					if(itemsProcessed === rows.length) {
						console.log(playedTeams);
						var uniqueTeams = playedTeams.filter(function(elem, index, self) {
							return index == self.indexOf(elem);
						});
						console.log('uniqueteam ' + uniqueTeams.length);
						var itemsProcessed2 = 0;
						uniqueTeams.forEach(function(teamId){
							db.query('SELECT COUNT(id) as played FROM `soccer_scores` WHERE won_team_id = ? OR loss_team_id = ?', [ teamId, teamId ], function(err2, rows2, fields2){
								if(err2) {
									itemsProcessed2++;
									if(itemsProcessed2 === uniqueTeams.length) {
										res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
										console.log('Unable to get data. Error is :' + err2.message);
									}										
								}else{
									if(rows2.length >= 1){
										var played = rows2[0].played;
										db.query('SELECT t.name, COUNT(s.id) as loss FROM `soccer_scores` s INNER JOIN soccer_teams t ON s.loss_team_id = t.id WHERE s.loss_team_id = ?', [ teamId ], function(err4, rows4, fields4){
										if(err4) {
											itemsProcessed2++;
											if(itemsProcessed2 === uniqueTeams.length) {
												res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
												console.log('Unable to get data. Error is :' + err4.message);
											}										
										}else{
											if(rows4.length >= 1){
												var loss = rows4[0].loss;
												var team_name = rows4[0].name;
												db.query('SELECT SUM(won_team_id = ?) AS won, SUM(loss_team_id = ?) AS loss, SUM(isdraw = 1) as draw, SUM(goals) as goals, SUM(xgoals) as xgoals FROM soccer_scores WHERE won_team_id = ?', [ teamId, teamId, teamId ], function(err3, rows3, fields3){
													if(err3) {
														itemsProcessed2++;
														if(itemsProcessed2 === uniqueTeams.length) {
															res.status(200).json({status:false, message: "Unable to select data from Database", data : null});
															console.log('Unable to get data. Error is :' + err2.message);
														}										
													}else{
														if(rows3.length >= 1){
															var won = rows3[0].won;
															var draw = rows3[0].draw;
															var goals = rows3[0].goals;
															var xgoals = rows3[0].xgoals;
															var goaldiff = goals - xgoals;
															var points = won * 3 + draw * 1;
															var teamscore = {
																'teamid' : teamId,
																'teamname' : team_name,
																'played' : played,
																'won': won,
																'draw': draw, 
																'loss': loss, 
																'goals': goals, 
																'xgoals': xgoals, 
																'goaldiff': goaldiff, 
																'points' : points
															};
															data.push(teamscore);
														}
														itemsProcessed2++;
														console.log(itemsProcessed2);
														if(itemsProcessed2 === uniqueTeams.length) {
															console.log(data);
															//callback(data);
															res.status(200).json({status:true, message: "", data : data});
														}
													}
												});
											}
										}
										});
									}
								}
							});
							//SELECT SUM(won_team_id = 4) AS won, SUM(loss_team_id = 4) AS loss, SUM(isdraw = 1) as draw, SUM(goals) as goals, SUM(xgoals) as xgoals FROM soccer_scores WHERE won_team_id = 4
						});
					}
				});
				
			}else{
				res.status(200).json({status:false, message: "No played match found", data : null});
			}
		}
	});
});

router.post('/', function(req, res){
	if( req.body.match_id  && req.body.goals && req.body.xgoals){
		var match_id = parseInt(req.body.match_id);
		//var won_team_id = parseInt(req.body.won_team_id);
		//var loss_team_id = parseInt(req.body.loss_team_id);
		//var isdraw = req.body.isdraw;    // 1- means match is draw 0- is not draw
		var goals = parseInt(req.body.goals);
		var xgoals = parseInt(req.body.xgoals);
		
		if( isInt(match_id) && isInt(goals) && isInt(xgoals) ){
			db.query('SELECT lteam_id, rteam_id FROM `soccer_matches` WHERE id = ?', [ match_id ], function(err2, rows2, fields){
				if(err2) { 
					res.status(200).json({status:false, message: "Unable to get data  ", data : null});
					console.log('Unable to get data. Error is :' + err2.message);										
				}else{
					if(rows2.length >=1 ){
						var lteam = rows2[0].lteam_id;
						var rteam = rows2[0].rteam_id;
						
						if(goals > xgoals){
							var won_team_id = lteam;
							var loss_team_id = rteam;
							var isdraw = 0;
						}else if( goals < xgoals ){
							var won_team_id = rteam;
							var loss_team_id = lteam;
							var isdraw = 0;
						}else{
							var won_team_id = lteam;
							var loss_team_id = rteam;
							var isdraw = 1;
						}
						 
						db.query('INSERT INTO `soccer_scores` (`id`, `match_id`, `won_team_id`, `loss_team_id`, `isdraw`, `goals`, `xgoals`) VALUES (NULL, ?, ?, ?, ?, ?, ?)', [ match_id, won_team_id, loss_team_id, isdraw, goals, xgoals ], function(err, result){
							if(err) { 
								res.status(200).json({status:false, message: "Unable to insert data into Database", data : null});
								console.log('Unable to Inert data into table. Error is :' + err.message);										
							}else{
								res.status(200).json({status:true, message: "Score is added successfully", data : null});
							}
						});
					}else{
						res.status(200).json({status:false, message: "No match found ", data : null});
					}
				}
			});
		}else{
			res.status(200).json({status:false, message: "Invalid data sent", data : null});
		}
	}else{
		res.status(200).json({status:false, message: "Please send required data", data : null});
	}
});



module.exports = router;