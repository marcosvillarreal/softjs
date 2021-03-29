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
        lineaSeleccionada;

    render = function () {

        var lineasPedido,
            articulo,
            html,pedido;
        
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        $('#ullistartped').empty();
        lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        
        // Si no hay articulos en el pedido lo mando directo a NUEVO
        if (lineasPedido.length == 0) {
            //No mostramos nada
			alert('Pedido vacio');
			return
        }
        else {
			
            pedido = preventamobile.dal().obtenerPedido(pedidoId);
            //alert(pedido.impreso);
			if (pedido.impreso == 1){
				alert('Pedido ya impreso');
				//return 
			}else{
				pedido.impreso = 1;
				pedidoId = preventamobile.dal().guardarPedido(pedido);
			}
			pedido = preventamobile.dal().calcularTotal(pedido);
			
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
			html = html + "<table id='table_cabeza' class='display'><font></font>"
			html = html + "		<thead><font></font> "
			html = html + "			<tr><font></font>"
			html = html + "				<th>Cliente</th><font></font>"
			html = html + "				<th>"+ pedido.codigoCliente +"</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "		</thead><font></font>"
			html = html + "</table><font></font>"
			
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
			
			$.each(lineasPedido, function (index, value) {
                articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
                var totalLinea = preventamobile.dal().calcularLineaTotal(value);
               // html = html + "<li style='white-space:normal;' data-theme='a' ><a style='white-space:normal;'  href='#'  >" + articulo.numero + " " + articulo.nombre + "<span style='font-size:150%;' class='ui-li-count'>" + "<b>" + value.cantidad + "</b> = " +totalLinea+ "</span>" + "</a></li>";
				html = html + "			<tr><font></font>"
				html = html + "				<td>" + value.cantidad
				if (value.kilos != 0 ){
					html = html + " [" + value.kilos + " Kg]"
				}
				html = html + " * "+ value.precio + "</td><font></font>"
				html = html + "			</tr><font></font>"
				
				html = html + "			<tr><font></font>"				
				html = html + "				<td>" + articulo.numero + " " + articulo.nombre + "</td><font></font>"				
				html = html + "				<td> $" + totalLinea + "</td><font></font>"
				html = html + "			</tr><font></font>"
            });
			
			html = html + "		</tbody><font></font>"
			html = html + "</table><font></font>"
			
			html = html + "<table id='table_pie' class='display'><font></font>"
			html = html + "		<tbody><font></font> "
			if (pedido.remito == '1'){
				html = html + "			<tr><font></font>"
				html = html + "				<td>SubTotal</th><font></font>"
				html = html + "				<td>"+ pedido.total +"</th><font></font>"
				html = html + "			</tr><font></font>"
			}else{
				
				html = html + "			<tr><font></font>"
				html = html + "				<td>SubTotal</th><font></font>"
				html = html + "				<td>"+ pedido.totalNeto +"</th><font></font>"
				html = html + "			</tr><font></font>"
				
				html = html + "			<tr><font></font>"
				html = html + "				<td>IVA</th><font></font>"
				html = html + "				<td>"+ (pedido.total - pedido.totalNeto - pedido.perceiibb - pedido.bonifpedido).toFixed(2) +"</th><font></font>"
				html = html + "			</tr><font></font>"
			}
			html = html + "			<tr><font></font>"
			html = html + "				<td>Bonificaciones</th><font></font>"
			html = html + "				<td> -"+ pedido.bonifpedido +"</th><font></font>"
			html = html + "			</tr><font></font>"
			
			if (pedido.remito == '0'){
				html = html + "			<tr><font></font>"
				html = html + "				<td>Percepcion</th><font></font>"			
				html = html + "				<td> "+ pedido.perceiibb +"</th><font></font>"
				html = html + "			</tr><font></font>"
			}
			html = html + "		</tbody><font></font>"
			html = html + "</table><font></font>"
			
			html = html + "<h2>Total: "+pedido.total+"</h2>"
			
			html = html + "</br>"
			if(pedido.pagoEfectivo + pedido.pagoCheque + pedido.pagoTransferencia > 0){
				html = html + "<table id='table_pagos' class='display'><font></font>"
				html = html + "		<thead><font></font> "
				html = html + "			<tr><font></font>"
				html = html + "				<th>Recibio del Cliente</th><font></font>"
				html = html + "				<th>Total</th><font></font>"
				html = html + "			</tr><font></font>"
				html = html + "		</thead><font></font>"
				html = html + "		<tbody><font></font>"
				if(pedido.pagoEfectivo > 0){
					html = html + "			<tr><font></font>"				
					html = html + "				<td> EFECTIVO</td><font></font>"				
					html = html + "				<td>" + pedido.pagoEfectivo + "</td><font></font>"
					html = html + "			</tr><font></font>"
				}
				if(pedido.pagoCheque > 0){
					html = html + "			<tr><font></font>"				
					html = html + "				<td> CHEQUE</td><font></font>"				
					html = html + "				<td>" + pedido.pagoCheque + "</td><font></font>"
					html = html + "			</tr><font></font>"
				}
				if(pedido.pagoTransferencia > 0){
					html = html + "			<tr><font></font>"				
					html = html + "				<td> TRANSF.</td><font></font>"				
					html = html + "				<td>" + pedido.pagoTransferencia + "</td><font></font>"
					html = html + "			</tr><font></font>"
				}
				html = html + "		</tbody><font></font>"
				html = html + "</table><font></font>"
				html = html + "</br></br>"
			}
			html = html + "</br></br>"
			html = html + "<br>..................</br>"
			html = html + "<br>     Firma        </br>"
            $("#imprimirPedidoContent").html(html).trigger('create');
			
			let options = {documentSize: 'A4',  type: 'share' ,fileName: "pedido_cliente_"+pedido.codigoCliente}
			
			alert(typeof cordova);
			if (typeof cordova != 'undefined'){
				pdf.fromData( html , options)
					.then((stats)=> console.log('status', stats) )   
					.catch((err)=>console.err(err))
			}
		};
			
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
	
	
    return {
        render: render
    };
    
};