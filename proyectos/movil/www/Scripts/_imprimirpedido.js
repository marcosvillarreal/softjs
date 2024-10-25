var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

on_success_pedido = function (position) {

    var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
    var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
    var objGeolocation = [{ codigocliente: codigoCliente, pedidoid: pedidoId, latitud: position.coords.latitude, longitud: position.coords.longitude, velocidad: position.coords.speed }];
    preventamobile.dal().syncTracking(objGeolocation);

}

preventamobile.ui.imprimirPedido = function () {

    var render,
		renderRecibo,
        lineaSeleccionada,
		saveFile;
	
	var textt="";
	
    render = function () {

        var lineasPedido,
            articulo,
            html,pedido;
        
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        $('#ullistartped').empty();
        lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        
		var errorKilos = false;
		if (lineasPedido.length != 0) {
			$.each(lineasPedido, function (index, value) {
				console.log(value.sikilos , ' K=' , value.kilos)
				if ((value.sikilos == "S") && (value.kilos == 0)) {
					//alert('Hay productos pesables sin kilos cargados');
					errorKilos = true;
				}
			});
		};
		if (errorKilos){
			alert('Hay productos pesables sin kilos cargados');
			return 
		};
		
        // Si no hay articulos en el pedido lo mando directo a NUEVO
        //if (lineasPedido.length == 0) {
        //    //No mostramos nada
		//	alert('Pedido vacio');
		//	return
        //}
        //else {
			
            pedido = preventamobile.dal().obtenerPedido(pedidoId);
            //alert(JSON.stringify(pedido));
			pedido = preventamobile.dal().calcularTotal(pedido);
			/*if (pedido.impreso == 1){
				alert('Pedido ya impreso');
				//return 
			}else{*/
				
				
				var totalPedido;
				totalPedido = pedido.total;
				totalPedido = totalPedido.toString();
				//console.log(typeof totalPedido);
				//console.log('totalPedido ' + totalPedido)
								
				//console.log('chksum ' + totalPedido);
				pedido.chksum = '99' //totalPedido;
				//console.log('chksum ' + pedido.chksum);
				
				if( pedido.impreso == 0){
					pedido.impreso = 1;
					preventamobile.dal().guardarPedido(pedido);
				
					//alert(JSON.stringify(pedido));
				
				}
			//}
			
			
			var codigoCliente = pedido.codigoCliente;
			var cliente = preventamobile.dal().obtenerCliente(codigoCliente);
			
			//console.log(cliente);
			var html
			html = ""
			
			/*
			html = html + "<div id='divpedido' data-role='fieldcontain' class='ui-hidden-accessible'><label id='xxcodigopedido'>" + "0" + "</label>" + "</div>";

            $.each(lineasPedido, function (index, value) {
                articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
                var totalLinea = preventamobile.dal().calcularLineaTotal(value);
                html = html + "<li style='white-space:normal;' data-theme='a' ><a style='white-space:normal;'  href='#'  >" + articulo.numero + " " + articulo.nombre + "<span style='font-size:150%;' class='ui-li-count'>" + "<b>" + value.cantidad + "</b> = " +totalLinea+ "</span>" + "</a></li>";
            });
            html = html + "</ol></div>";
			*/
			/*
			html = html + "<table id='table_cabeza' class='display'><font></font>"
			html = html + "		<thead><font></font> "
			html = html + "			<tr><font></font>"
			html = html + "				<th>Fecha " + pedido.fecha + "</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "			<tr><font></font>"
			html = html + "				<th>Cliente</th><font></font>"
			//html = html + "				<th>"+ pedido.codigoCliente + ' ' + cliente.nombre +'..........................'+ "</th><font></font>"
			html = html + "				<th>"+ pedido.codigoCliente + ' ' + cliente.nombre + "</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "		</thead><font></font>"
			html = html + "</table><font></font>"
			*/
			html = html + "<h3> Fecha "+pedido.fecha
			
			var _tipoDePedido = pedido.tipoDePedido
			var _remito = pedido.remito
			
			if (_tipoDePedido == '5'){
				html = html + " CREDITO "
			}
			if (_remito == '1'){
				html = html + " ## "
			}
			if (_remito == '2'){
				html = html + " CF "
			}
			
			if (pedido.vales == '1'){
				html = html + " VALES "
			}
			
			html = html + "</h3>"
			html = html + "<h3> Cliente "+pedido.codigoCliente + "</h3>"
			html = html + "<h3>"+ cliente.nombre+"</h3>"
			
			if (lineasPedido.length != 0) {
				html = html + "<table id='table_cuerpo' class='display'><font></font>"
				html = html + "		<thead><font></font> "
				html = html + "			<tr><font></font>"
				//html = html + "				<th>Articulo</th><font></font>"
				html = html + "				<th>Cantidad [kilos]</th><font></font>"
				//html = html + "				<th>Kilos</th><font></font>"
				//html = html + "				<th>P.Unitario</th><font></font>"
				html = html + "				<th>Total</th><font></font>"
				html = html + "			</tr><font></font>"
				html = html + "		</thead><font></font>"
				html = html + "		<tbody><font></font>"
				
				var _ind = 1;
				$.each(lineasPedido, function (index, value) {
					articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
					var totalLinea = preventamobile.dal().calcularLineaTotal(value);
				   // html = html + "<li style='white-space:normal;' data-theme='a' ><a style='white-space:normal;'  href='#'  >" + articulo.numero + " " + articulo.nombre + "<span style='font-size:150%;' class='ui-li-count'>" + "<b>" + value.cantidad + "</b> = " +totalLinea+ "</span>" + "</a></li>";
					
					html = html + "			<tr><font></font>"
					html = html + '				<td ">' + _ind + ".</td><font></font>"
					html = html + "			</tr><font></font>"
					
					html = html + "			<tr><font></font>"
					html = html + '				<td style="font-weight:bold;">' + articulo.numero + " " + articulo.nombre + "</td><font></font>"
					//html = html + "				<td style="font-weight:bold;"> $' + totalLinea + "</td><font></font>"
					html = html + "			</tr><font></font>"
					
					//html = html + "			<tr><font></font>"
					//html = html + '				<td style="font-size:22px;">' + articulo.numero + " " + articulo.nombre + "</td><font></font>"
					//html = html + "			</tr><font></font>"
					
					html = html + "			<tr><font></font>"
					html = html + '				<td style="font-weight:bold;">' + value.cantidad
					if (value.kilos != 0 ){
						html = html + " [" + value.kilos + " Kg]"
					}
					html = html + " * "+ value.precio + "   (" + value.bonif1 + "%)</td><font></font>"
					html = html + '				<td style="font-weight:bold;"> $' + totalLinea + "</td><font></font>"
					html = html + "			</tr><font></font>"
					
					_ind++;
				});
				
				html = html + "		</tbody><font></font>"
				html = html + "</table><font></font>"
			
				html = html + "<table id='table_pie' class='display'><font></font>"
				html = html + "		<tbody><font></font> "
				//if (pedido.remito == '1'){
				//	html = html +0 "			<tr><font></font>"
				//	html = html + "				<td>SubTotal</th><font></font>"
				//	html = html + "				<td>"+ ( pedido.total )+"</th><font></font>"
				//	html = html + "			</tr><font></font>"
				//}else{
				//	
					html = html + "			<tr><font></font>"
					html = html + "				<td>SubTotal</th><font></font>"
					
					var nPerce	= parseInt((pedido.perceiibb));
					var nBonifT	= parseInt((pedido.bonifpedido));					
				
					html = html + "				<td>"+ (pedido.total - nPerce + nBonifT) +"</th><font></font>"
					html = html + "			</tr><font></font>"
					
				//	html = html + "			<tr><font></font>"
				//	html = html + "				<td>IVA</th><font></font>"
				//	html = html + "				<td>"+ (pedido.total - pedido.totalNeto - pedido.perceiibb - pedido.bonifpedido).toFixed(2) +"</th><font></font>"
				//	html = html + "			</tr><font></font>"
				//}
				html = html + "			<tr><font></font>"
				html = html + "				<td>Bonificaciones</th><font></font>"
				html = html + "				<td> -"+ pedido.bonifpedido +"</th><font></font>"
				html = html + "			</tr><font></font>"
				
				if (_remito == '0'){
					html = html + "			<tr><font></font>"
					html = html + "				<td>Percepcion</th><font></font>"			
					html = html + "				<td> "+ pedido.perceiibb +"</th><font></font>"
					html = html + "			</tr><font></font>"
				}
				html = html + "		</tbody><font></font>"
				html = html + "</table><font></font>"
				
				html = html + "<h2>Total: "+parseFloat(pedido.total).toFixed(2)+"</h2>"
			};
			html = html + "</br>"
			
			var nPagoEfectivo	= parseInt((pedido.pagoEfectivo));
			var nPagoCheque		= parseInt((pedido.pagoCheque));
			var nPagoTransferencia = parseInt((pedido.pagoTransferencia));
			
			if (isNaN(nPagoEfectivo)) { nPagoEfectivo = 0 };
			if (isNaN(nPagoCheque)) { nPagoCheque = 0 };
			if (isNaN(nPagoTransferencia)) { nPagoTransferencia = 0 };
		   
		   /*
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
			*/
			
			html = html + "</br></br>"
			html = html + "<br>..................</br>"
			html = html + "<br>     Firma        </br>"
			html = html + "</br></br>"
			html = html + "<br>.</br>"
            $("#imprimirPedidoContent").html(html).trigger('create');
			
			let options = {documentSize: 'A4',  type: 'share' ,fileName: "pedido_cliente_"+pedido.codigoCliente}
			
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
		//};
			
	};
	
	renderRecibo = function () {

        var lineasPedido,
            articulo,
            html,recibo;
        
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        $('#ullistartped').empty();
        //lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        
		
			
        recibo = preventamobile.dal().obtenerPedido(pedidoId);
           
				
				
		var totalRecibo;
		totalRecibo = 0;
		var nPagoEfectivo	= parseInt((recibo.pagoEfectivo));
		var nPagoCheque		= parseInt((recibo.pagoCheque));
		var nPagoTransferencia = parseInt((recibo.pagoTransferencia));
		
		if (isNaN(nPagoEfectivo)) { nPagoEfectivo = 0 };
		if (isNaN(nPagoCheque)) { nPagoCheque = 0 };
		if (isNaN(nPagoTransferencia)) { nPagoTransferencia = 0 };
		
		totalRecibo = nPagoEfectivo + nPagoCheque + nPagoTransferencia
	
		
		totalRecibo = totalRecibo.toString();
		
		recibo.chksum = '99'
				
		if( recibo.impreso == 0){
			recibo.impreso = 1;
			preventamobile.dal().guardarRecibo(recibo);
		
			//alert(JSON.stringify(pedido));
		
		}
				
		var codigoCliente = recibo.codigoCliente;
		var cliente = preventamobile.dal().obtenerCliente(codigoCliente);
			
			
		var html
		html = ""
		

		html = html + "<h3> Fecha "+recibo.fecha
		
		html = html + "</h3>"
		html = html + "<h3> Cliente "+recibo.codigoCliente + "</h3>"
		html = html + "<h3>"+ cliente.nombre+"</h3>"
			
		html = html + "</br>"
		
		console.log(recibo);
		
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
		$("#imprimirReciboContent").html(html).trigger('create');
		
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
			 textt='Pedido Generado por app'; /* initialize global variable with text to be written in file */
			 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystemSuccess, fail);

			 /* Esto verificará el permiso para lectura y escritura de almacenamiento, y si tiene permiso 
			  , se llamará al parámetro de envío de la función; de lo contrario, si no se otorga, se llamará al tercer parámetro, es decir, a la 
			 función de falla */
		 };
      };

      onFileSystemSuccess = function (fileSystem){
         fileSystem.root.getFile("Pedido.txt",{create: true, exclusive: 
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
		renderRecibo: renderRecibo,
		saveFile: saveFile
    };
    
};