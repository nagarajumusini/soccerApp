var mysql      = require('mysql');
var db = null;
db = function(){
	var db_local = {
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'soccer_db'
	};
	var connection;

	function handleDisconnect() {
	  connection = mysql.createConnection(db_local); 
	  connection.connect(function(err) {             // The server is either down
		if(err) {                                     // or restarting (takes a while sometimes).
		  console.error('Error when connecting to db:', err);
		  connection.end();
		  setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
		}else{ 			                             
			console.log('MySql Connected successfully');
		}
	  });                                   
	  connection.on('error', function(err) {
		console.error('Error when connecting to db', err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
		connection.end();
		  handleDisconnect();                         // lost due to either server restart, or a
		} else {                                  
		  //throw err;   		 
		  connection.end();
		  handleDisconnect();
		}
	  });
	}

	handleDisconnect();
	return connection;
};
module.exports = db;