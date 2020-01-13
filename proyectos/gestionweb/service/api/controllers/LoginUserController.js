module.exports = {
	index: function (req, res) {

    datastore : "sqserver";

    sails.log.debug("Entro");

	  var cUserName = req.param('username','');
		var cPassword = req.param('password','');

		sails.log.debug("Solicita Usuario:",cUserName);


    const config = {
      user: 'sa',
      //password: 'cf3485',
      //server: 'marcos', // You can use 'localhost\\instance' to connect to named instance
      server: 'gestionweb-test.ddns.net',
	  password: 'Cf',
      database: 'kleja',
      port: 1171,
      options: {
        encrypt: false // Use this if you're on Windows Azure
      }
    }

    //import dotenv from 'dotenv';

    /*
    const fs = require("fs");
    let data = fs.readFile( __dirname+'/conection.js');
    console.log(data);

    const config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      server: process.env.DB_HOST, // You can use 'localhost\\instance' to connect to named instance
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      options: {
        encrypt: process.env.DB_ENCRYPT // Use this if you're on Windows Azure
      }
    }
    sails.log.debug("sql host:",process.env.DB_HOST);
    */

    var sqlQ = "",sqlW = ""


    sqlQ     = sqlQ + "SELECT CsrUsuario.* From W_Usuario as CsrUsuario "

    sqlW = "CsrUsuario.activo=1 ";

    if(cUserName.trim().length>1){
      sqlW = sqlW + " AND CsrUsuario.name = '"+cUserName+"'";
    }
    if(cPassword.trim().length>1){
      sqlW = sqlW + " AND CsrUsuario.password = '"+cPassword+"'";
    }
    sqlQ = sqlQ + " WHERE ("+ sqlW + ")";



		const sql = require('mssql')
		sql.connect(config).then(pool => {
			// Query
			return pool.request().query(sqlQ)
		}).then(result => {
		    sql.close()
			res.writeHead(200, { "Content-Type": "application/json" });
			if(result){
			    //sails.log.debug("sql:",sqlQ);
				res.write(JSON.stringify(result.recordsets[0]));
				//res.write(result);
		    };
		    //console.dir(result)
			res.end();
		}).catch(err => {
			sails.log.debug("ERROR:","error en conexón",err.message);
		    sql.close()
			res.end();
		})


  }
};


