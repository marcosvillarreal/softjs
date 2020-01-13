module.exports = {
	index: function (req, res) {

	    var strcodbarra = String(req.param('intcodbarra','9999999999999'));
		var strnombre   = String(req.param('strnombre',''));

		sails.log.debug("Solicita Código:",strcodbarra);
		sails.log.debug("Solicita Nombre:",strnombre);

		if (strnombre.trim().length<3){strnombre=''}
			else {
				var palabras = strnombre.split(" ");
		}

		// const config = {
			// user: 'sa',
			// password: 'cf',
			// server: 'santarossa.ddns.net', // You can use 'localhost\\instance' to connect to named instance
			// database: 'datos',
			// port: 1170,
			// options: {
				// encrypt: false // Use this if you're on Windows Azure
			// }
		// }

		const config = {
			user: 'sa',
			password: 'cf3485',
			server: 'marcos', // You can use 'localhost\\instance' to connect to named instance
			database: 'datos',
			port: 1170,
			options: {
				encrypt: false // Use this if you're on Windows Azure
			}
		}

		var sqlQ = ""
		sqlQ     = sqlQ + "select a.numero,isnull(cau.numero,a.numero) as unifica,isnull(prod.id,a.id) as idunifica "
		sqlQ     = sqlQ + ",a.nombre as nombre "
		sqlQ     = sqlQ + ",cast(round((case when isnull(p.canbase,0) = 1 then a.prevtaf1 * (1 - p.bonifica/100) else a.prevtaf1 end),3) as numeric(11,3)) as prevtaf1 "
		sqlQ     = sqlQ + ",cast(round((case when isnull(p2.canbase,0) = 1 then a.prevtaf1 * (1 - p2.bonifica/100) else a.prevtaf1 end),3) as numeric(11,3)) as prevtafd "
		sqlQ     = sqlQ + ",a.prevtaf3 "
		sqlQ     = sqlQ + ",isnull(p.bonifica,0) as bonifica "
		sqlQ     = sqlQ + ",isnull(p2.bonifica,0) as bonificad "
		sqlQ     = sqlQ + ",round(a.prevtaf1,2) as presindes "
		sqlQ     = sqlQ + ",isnull(s.nombre,'') as nomvariedad "
		sqlQ     = sqlQ + ",isnull(e.iddeposito,0) as iddeposito "
		sqlQ     = sqlQ + ",isnull(e.existe,0) as existedisp,a.codbarra13,s.codigo "
		sqlQ     = sqlQ + "from producto a left join subproducto s on s.idarticulo=a.id "
		sqlQ     = sqlQ + "left join existenc e on (e.idsubarti=isnull(s.id,0) and e.idarticulo=a.id) "
		sqlQ     = sqlQ + "left join cuerunifica cuu on a.id=cuu.idproducto "
		sqlQ     = sqlQ + "left join cabeunifica cau on cau.id=cuu.idcabeunifica "
		sqlQ     = sqlQ + "left join producto prod on cau.numero=prod.numero "
		sqlQ     = sqlQ + "left join (select ca.idprodgenera, ca.id as idcabepromo, cu.bonifica , cu.fechasta ,cu.candesde as canbase from cabepromopub as ca "
		sqlQ     = sqlQ + "inner join cuerpromopub as cu on ca.id = cu.idcabepromo and cu.candesde=1) as p on isnull(prod.id,a.id) = p.idprodgenera "
		sqlQ     = sqlQ + "left join (select ca.idprodgenera, ca.id as idcabepromo, cu.bonifica , cu.fechasta ,cu.candesde as canbase from cabepromo as ca "
		sqlQ     = sqlQ + "inner join cuerpromo as cu on ca.id = cu.idcabepromo and cu.candesde=1) as p2 on isnull(prod.id,a.id) = p2.idprodgenera "


		if(strnombre.trim().length>1&&strnombre!=null){
		    strCondicion = "(";
			strSep       = "";
			for (var i = 0; i < palabras.length; i+=1) {
				strCondicion = strCondicion + strSep +"a.nombre like'%"+ palabras[i]+"%'";
				strSep       = " and ";
			}
		    strCondicion = strCondicion + ")";
			//sails.log.debug("sql:",strCondicion)
		    sqlQ = sqlQ + "where (a.espromocion=0 and a.idestado=1 and "+strCondicion+") order by a.nombre";
	    } else {
			if(strcodbarra.trim().length<7){
			   sqlQ = sqlQ + " where (a.espromocion=0 and a.idestado=1 and ( a.numero="+strcodbarra+" or a.codalfa='"+strcodbarra+"'))";
			} else {
				sqlQ = sqlQ + "where (a.espromocion=0 and a.idestado=1 and (a.codbarra13 like '%"+strcodbarra+"%' or s.codigo like '%"+strcodbarra+"%' or a.codalfa like '%"+strcodbarra+"%' or a.numero like '%"+strcodbarra+"%'))";
			}
		}


		//sails.log.debug("sql:",sqlQ);

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
			sails.log.debug("ERROR:","error en conexón");
		    sql.close()
			res.end();
		})


    }
};


