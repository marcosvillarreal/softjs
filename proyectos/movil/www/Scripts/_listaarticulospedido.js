var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

on_success_pedido = function (position) {

    var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
    var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
    var objGeolocation = [{ codigocliente: codigoCliente, pedidoid: pedidoId, latitud: position.coords.latitude, longitud: position.coords.longitude, velocidad: position.coords.speed }];
    preventamobile.dal().syncTracking(objGeolocation);

}

preventamobile.ui.listaArticulosPedido = function () {

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
            navigator.geolocation.getCurrentPosition(on_success_pedido);
            preventamobile.ui.editaLineaPedido().lineaNueva();
        }
        else {
            pedido = preventamobile.dal().obtenerPedido(pedidoId);
            html ="<h2>Total: "+pedido.total+"</h2>"
			html = html + "<div id='divbonif' data-role='fieldcontain'><label for='total'>Bonificacion General: %</label><input type='text' value=' '" + " name='bonifporcepedido' id='bonifporcepedido' onchange='preventamobile.ui.listaArticulosPedido().recalcularBonificacionGral();' /></div>"
            html = html + "<div id='divpedido' data-role='fieldcontain' class='ui-hidden-accessible'><label id='xxcodigopedido'>" + "0" + "</label>" + "</div>";
            html = html + "<div class='ui-btn-text'><ol id='ullistartped' data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
            "data-filter='true' data-filter-placeholder='Ingrese valor a buscar'> ";

            $.each(lineasPedido, function (index, value) {
                articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
                var totalLinea = preventamobile.dal().calcularLineaTotal(value);
                html = html + "<li style='white-space:normal;' data-theme='a' ><a style='white-space:normal;'  href='#' onclick='preventamobile.ui.listaArticulosPedido().lineaSeleccionada(" +
              '"' + value.idarticulo + '"' + ',"' + value.lineaId + '"' + ");' >" + articulo.numero + " " + articulo.nombre + "<span style='font-size:150%;' class='ui-li-count'>" + "<b>" + value.cantidad + "</b> = " +totalLinea+ "</span>" + "</a></li>";
            });
            html = html + "</ol></div>";

            $("#listaArticulosPedidoContent").html(html).trigger('create');
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
	
	var recalcularBonificacionGral = function() {
		
		
		var lineasPedido,
            articulo,
            html,pedido,porcebonif;
        
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        $('#ullistartped').empty();
        lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        
        
		pedido = preventamobile.dal().obtenerPedido(pedidoId);
		
		porcebonif = ($('#bonifporcepedido').val());
		//alert(porcebonif);
		
		$.each(lineasPedido, function (index, value) {
			//articulo = preventamobile.dal().obtenerArticulo(value.idarticulo);
			value = preventamobile.ui.editaLineaPedido().modificarBonifLinea(value,porcebonif,pedidoId);
			
			//alert(value.bonif1);
			//preventamobile.dal().eliminarPedidoLinea(pedidoId,value.lineaId);
			preventamobile.dal().guardarPedidoLinea(pedidoId, value);
		});
		
		//preventamobile.dal().guardarPedido(pedido);
        pedido.total = preventamobile.dal().calcularTotal(pedido);
		
	};
	
    return {
        render: render,
        lineaSeleccionada: lineaSeleccionada,
		recalcularBonificacionGral: recalcularBonificacionGral
    };
    
};