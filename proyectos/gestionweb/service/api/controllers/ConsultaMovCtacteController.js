module.exports = {
	index: function (req, res) {

	  var cCtacte = String(req.param('codctacte','9999999999999'));
    var modulo = req.param('strmodulo','');
    var cFecha = req.param('fecha','19000101');

		sails.log.debug("Solicita Código Cliente:",cCtacte);
    sails.log.debug("Solicita Modulo:",modulo);
    sails.log.debug("Solicita Fecha:",cFecha);

		if (modulo.trim().length<3){modulo='Mov_SinRango'}

    if(cCtacte.trim().length<1){
      sails.log.debug("El cliente no es un valor valido")
      return
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

    /*
		const config = {
			user: 'sa',
			password: 'cf',
			server: 'IBM3200', // You can use 'localhost\\instance' to connect to named instance
			database: 'datos',
			port: 1170,
			options: {
				encrypt: false // Use this if you're on Windows Azure
			}
		}
    */


		const config = {
			user: 'sa',
			//password: 'cf3485',
			server: 'marcos', // You can use 'localhost\\instance' to connect to named instance
			database: 'kleja',
			password:'Cf',
			port: 1171,
			options: {
				encrypt: false // Use this if you're on Windows Azure
			}
		}
    var sqlQ = "",sqlW = ""

    //A partir del modulo cambiamos la queary
    if(modulo=="Mov_SinRango"){

      sqlQ     = sqlQ + "select * From (SELECT CsrCuerpo.ctacte as codigo "
      sqlQ     = sqlQ + ",CsrCuerpo.fecha as fechaorder"
      sqlQ     = sqlQ + ",convert(char(10),CsrCuerpo.fecha,105) as fechaemi"
      sqlQ     = sqlQ + ",convert(char(10),CsrCuerpo.vencimien,105) as fechavto "
      sqlQ     = sqlQ + ",(CsrCuerpo.importe * CsrCuerpo.signo) as importe "
      sqlQ     = sqlQ + ",(CsrCuerpo.saldo * CsrCuerpo.signo) as saldo "
      sqlQ     = sqlQ + ",cast(0 as numeric(11,2)) as debe ,cast(0 as numeric(11,2)) as haber ,cast(0 as numeric(11,2)) as saldoacu"
      sqlQ     = sqlQ + ",Csrcomprobante.cabrevia  + ' ' +LEFT(ISNULL(Csrmaopera.numcomp,' '),1)+' '+SUBSTRING(ISNULL(Csrmaopera.numcomp,SPACE(6)),2,4)+' '+RIGHT(ISNULL(Csrmaopera.numcomp,SPACE(8)),8) as comproba "
      sqlQ     = sqlQ + "FROM MovCtacte as CsrCuerpo "
      sqlQ     = sqlQ + "left join maopera as Csrmaopera on CsrCuerpo.idmaopera = Csrmaopera.id "
      sqlQ     = sqlQ + "left join Ctacte as CsrCtacte on CsrCuerpo.idctacte = CsrCtacte.id "
      sqlQ     = sqlQ + "left join comprobante as csrcomprobante on Csrmaopera.idcomproba = Csrcomprobante.id "



      sqlW = "where (convert(int,CsrCtacte.cnumero) IN ("+cCtacte+") AND  Csrmaopera.estado='0' and CsrMaopera.clasecomp<>'K' and ";

      //if(cCtacte.trim().length>1&&cCtacte!=null){
          //strCondicion = "(";
          //strSep       = "";
          //for (var i = 0; i < palabras.length; i+=1) {
          //  strCondicion = strCondicion + strSep +"a.nombre like'%"+ palabras[i]+"%'";
          //  strSep       = " and ";
          //}
          //strCondicion = strCondicion + ")";
          //sails.log.debug("sql:",strCondicion)
          //sqlQ = sqlQ + "where (a.espromocion=0 and a.idestado=1 and "+strCondicion+") order by a.nombre";
      //} else {
        if(cFecha=='19000101'){
          sails.log.debug("Queary Consolidado");

          sqlQ = sqlQ + sqlW + " CsrCuerpo.saldo<>0 )) as M ";
        } else {
          sails.log.debug("Queary Resumen");

          sqlQ = sqlQ + sqlW + " CsrCuerpo.fecha>= '" + cFecha + "')) as M ";
        }
      //}

      sqlQ     = sqlQ + "ORDER BY M.codigo,M.fechaorder"

      //sails.log.debug("sql:",sqlQ);
    }else{
      if(modulo="Cons_Ctacte"){
        sails.log.debug("Queary Cliente");

        sqlQ     = sqlQ + "SELECT CsrCtacte.cnumero as codigo "
        sqlQ     = sqlQ + ",csrCtacte.cnombre as nombre ,csrCtacte.cdireccion as direccion "
        sqlQ     = sqlQ + "From Ctacte as CsrCtacte "

        sqlQ = sqlQ + " where (convert(int,CsrCtacte.cnumero) IN ("+cCtacte+") AND CsrCtacte.estadocta = 0)";

      }
    }



    sails.log.debug("consultando....");

		const sql = require('mssql')
		sql.connect(config).then(pool => {
			// Query
			return pool.request().query(sqlQ)
		}).then(result => {
		    sql.close()
			res.writeHead(200, { "Content-Type": "application/json" });
			if(result){
        if(modulo=="Mov_SinRango"){
          var item,saldoAcu
          saldoAcu = 0
          item = result.recordsets[0]
          sails.log.debug('Lista ',item);
          for (i  in item){
            saldoAcu = Math.round(saldoAcu + item[i].importe,2)
            if(item[i].importe>0){
              item[i].debe = item[i].importe
            }else{
              item[i].haber = item[i].importe
            }
            item[i].saldoacu = saldoAcu

            sails.log.debug('Movimiento ',item[i]);
          }
        }

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


