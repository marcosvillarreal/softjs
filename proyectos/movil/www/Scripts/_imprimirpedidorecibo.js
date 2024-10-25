var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

on_success_pedido = function (position) {

    var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
    var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
    var objGeolocation = [{ codigocliente: codigoCliente, pedidoid: pedidoId, latitud: position.coords.latitude, longitud: position.coords.longitude, velocidad: position.coords.speed }];
    preventamobile.dal().syncTracking(objGeolocation);

}

preventamobile.ui.imprimirPedidoRecibo = function () {

    var render,
        lineaSeleccionada,
		saveFile;
	
	var textt="";
	
    render = function () {

        var lineasPedido,
            articulo,
            html,recibo;
        
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        $('#ullistartped').empty();
        lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        
		alert('recibo')		;
			
        recibo = preventamobile.dal().obtenerPedido(pedidoId);
           
				
				
		var totalRecibo;
		var nPagoEfectivo	= parseInt((pedido.pagoEfectivo));
		var nPagoCheque		= parseInt((pedido.pagoCheque));
		var nPagoTransferencia = parseInt((pedido.pagoTransferencia));
		
		totalRecibo = nPagoEfectivo + nPagoCheque + nPagoTransferencia;
		totalRecibo = totalRecibo.toString();
				
		var codigoCliente = recibo.codigoCliente;
		var cliente = preventamobile.dal().obtenerCliente(codigoCliente);
			
			
		var html
		html = ""
		

		html = html + "<h3> Fecha "+recibo.fecha
		
		html = html + "</h3>"
		html = html + "<h3> Cliente "+recibo.codigoCliente + "</h3>"
		html = html + "<h3>"+ cliente.nombre+"</h3>"
			
		html = html + "</br>"
			
		
		
		if(nPagoEfectivo + nPagoCheque + nPagoTransferencia > 0){
			html = html + "<table id='table_pagos' class='display'><font></font>"
			html = html + "		<thead><font></font> "
			html = html + "			<tr><font></font>"
			html = html + "				<th>Recibio del Cliente</th><font></font>"
			html = html + "				<th>Total</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "		</thead><font></font>"
			html = html + "		<tbody><font></font>"
			if(nPagoEfectivo > 0){
				html = html + "			<tr><font></font>"				
				html = html + "				<td> EFECTIVO</td><font></font>"				
				html = html + "				<td>" + nPagoEfectivo + "</td><font></font>"
				html = html + "			</tr><font></font>"
			}
			if(nPagoCheque > 0){
				html = html + "			<tr><font></font>"				
				html = html + "				<td> CHEQUE</td><font></font>"				
				html = html + "				<td>" + nPagoCheque + "</td><font></font>"
				html = html + "			</tr><font></font>"
			}
			if(nPagoTransferencia > 0){
				html = html + "			<tr><font></font>"				
				html = html + "				<td> TRANSF.</td><font></font>"				
				html = html + "				<td>" + nPagoTransferencia + "</td><font></font>"
				html = html + "			</tr><font></font>"
			}
			html = html + "		</tbody><font></font>"
			html = html + "</table><font></font>"
			html = html + "</br></br>"
		}
		html = html + "</br></br>"
		html = html + "<br>..................</br>"
		html = html + "<br>     Firma        </br>"
		html = html + "</br></br>"
		html = html + "<br>.</br>"
		
		console.log(html)
		$("#imprimirPedidoReciboContent").html(html).trigger('create');
		
		let options = {documentSize: 'A4',  type: 'share' ,fileName: "recibo_cliente_"+recibo.codigoCliente}
		
		//alert(typeof cordova);
		if (typeof cordova != 'undefined'){
			pdf.fromData( html , options)
				.then((stats)=> console.log('status', stats) )   
				.catch((err)=>console.err(err))
			/*
			var directorio = "file:///storage/emulated/0";
			var nombreArchivo = "CabePedido.txt";

			window.resolveLocalFileSystemURL(directorio, function(dir) {
				dir.getFile(nombreArchivo, {create:true}, function(fileEntry) {
					// el archivo ha sido creado satisfactoriamente.
					// Usa fileEntry para leer el contenido o borrar el archivo
				});
			});
			*/
		}
		
			
	};
	
	
	
    lineaSeleccionada = function (idArticulo, lineaId) {
        preventamobile.ui.listaPedidos().establecerIdLineaSeleccionada(lineaId);
        preventamobile.ui.listaPedidos().establecerIdArticuloSeleccionado(idArticulo);

        var articulo = preventamobile.dal().obtenerArticulo(idArticulo.trim());
        if (articulo.variedades.length > 0) {
            $.mobile.changePage('#editaLineaVariedadesPage');
        } else {
            $.mobile.changePage('#editaLineaPedidoPage');
        }
        ;

    };
	
	
     saveFile = function (){
		 if (typeof cordova != 'undefined'){
			 textt='Recibo Generado por app'; /* initialize global variable with text to be written in file */
			 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystemSuccess, fail);

			 /* Esto verificará el permiso para lectura y escritura de almacenamiento, y si tiene permiso 
			  , se llamará al parámetro de envío de la función; de lo contrario, si no se otorga, se llamará al tercer parámetro, es decir, a la 
			 función de falla */
		 };
      };

      onFileSystemSuccess = function (fileSystem){
         fileSystem.root.getFile("Recibo.txt",{create: true, exclusive: 
		false},gotFileEntry,fail);
         /* Esto creará un archivo con el nombre Demo.txt en el almacenamiento interno. y de manera similar, al 
         crearlo con éxito, llamará a la función del segundo parámetro, es decir, gotFileEntry */ 
      };

      gotFileEntry = function (fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
       
		  /* Esto obtendrá un objeto de archivo con la llamada de ruta createWriter en el que el primer parámetro se 
       usa para escribir contenido en el archivo y el segundo parámetro de falla al crear el escritor */ 
      };

      gotFileWriter = function (writer){
         writer.write(textt); /*  pasando parámetro del texto que es global y se inicializa en la primera función llamada */
          writer.onwriteend = function(evt) {
            alert("Pedido almacenado en el dispositivo");
          }; /* Esta función se llamará una vez que el archivo esté escrito con texto y guardado */ 
       };

     fail = function (error)     {
       alert("Error","There was some problem\nError:"+error.code,"Ok");
     };
	 
	
    return {
        render: render,
		saveFile: saveFile
    };
    
};