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
        }
        else {
			
            pedido = preventamobile.dal().obtenerPedido(pedidoId);
            
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
			html = html + "				<th>Articulo</th><font></font>"
			html = html + "				<th>Cantidad</th><font></font>"
			html = html + "				<th>Kilos</th><font></font>"
			html = html + "				<th>P.Unitario</th><font></font>"
			html = html + "				<th>Total</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "		</thead><font></font>"
			html = html + "		<tbody><font></font>"
			
			$.each(lineasPedido, function (index, value) {
                articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
                var totalLinea = preventamobile.dal().calcularLineaTotal(value);
               // html = html + "<li style='white-space:normal;' data-theme='a' ><a style='white-space:normal;'  href='#'  >" + articulo.numero + " " + articulo.nombre + "<span style='font-size:150%;' class='ui-li-count'>" + "<b>" + value.cantidad + "</b> = " +totalLinea+ "</span>" + "</a></li>";
				html = html + "			<tr><font></font>"
				html = html + "				<td>" + articulo.numero + " " + articulo.nombre + "</td><font></font>"
				html = html + "				<td>" + value.cantidad + "</td><font></font>"
				html = html + "				<td>" + value.kilos + "</td><font></font>"
				html = html + "				<td>" + value.precio + "</td><font></font>"
				html = html + "				<td>" + totalLinea + "</td><font></font>"
				html = html + "			</tr><font></font>"
            });
			
			html = html + "		</tbody><font></font>"
			html = html + "</table><font></font>"
			
			html = html + "<table id='table_pie' class='display'><font></font>"
			html = html + "		<tbody><font></font> "
			html = html + "			<tr><font></font>"
			html = html + "				<td>SubTotal</th><font></font>"
			html = html + "				<td>"+ pedido.totalNeto +"</th><font></font>"
			html = html + "			</tr><font></font>"
			
			html = html + "			<tr><font></font>"
			html = html + "				<td>IVA</th><font></font>"
			html = html + "				<td>"+ (pedido.total - pedido.totalNeto - pedido.perceiibb - pedido.bonifpedido) +"</th><font></font>"
			html = html + "			</tr><font></font>"
			
			html = html + "			<tr><font></font>"
			html = html + "				<td>Bonificaciones</th><font></font>"
			html = html + "				<td> -"+ pedido.bonifpedido +"</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "			<tr><font></font>"
			html = html + "				<td>Percepcion</th><font></font>"			
			html = html + "				<td> "+ pedido.perceiibb +"</th><font></font>"
			html = html + "			</tr><font></font>"
			html = html + "		</tbody><font></font>"
			html = html + "</table><font></font>"
			
			html = html + "<h2>Total: "+pedido.total+"</h2>"
			
            $("#imprimirPedidoContent").html(html).trigger('create');
			
			let options = {documentSize: 'A4',  type: 'share' ,fileName: "pedido_cliente_"+pedido.codigoCliente}
 
			pdf.fromData( html , options)
				.then((stats)=> console.log('status', stats) )   
				.catch((err)=>console.err(err))
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