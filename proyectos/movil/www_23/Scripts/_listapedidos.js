var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.listaPedidos = function () {

    var render,
        aplicarPedido,
		imprimirPedido,
        borrarPedido,
        pedidoNuevo,
        pedidoSeleccionado,
        renderPedidosDetalle,
        informarPedidoSyncOk,
        informarPedidoSyncError,
        establecerIdPedidoSeleccionado,
        obtenerIdPedidoSeleccionado,
        hayPedidoSeleccionado,
        establecerIdClienteSeleccionado,
        obtenerIdClienteSeleccionado,
        hayClienteSeleccionado,
        establecerIdArticuloSeleccionado,
        obtenerIdArticuloSeleccionado,
        hayArticuloSeleccionado,
        establecerIdLineaSeleccionada,
        obtenerIdLineaSeleccionada,
        hayLineaSeleccionada,
        limpiarLineaSeleccionada,
        on_success_pedido,
        obtenerObservacionesClienteSeleccionado,
        renderPedidoRentablePage,
        pedidoRentablePage,
		obtenerPerceClienteSeleccionado;



    pedidoRentablePage = function (idPedido) {
        establecerIdPedidoSeleccionado(idPedido);
        $.mobile.changePage('#pedidoRentablePage');
    };

    renderPedidoRentablePage = function () {

        try {
            var idPedido = obtenerIdPedidoSeleccionado();
            var pedido = preventamobile.dal().obtenerPedido(idPedido);

            // Convertir costo proveedor en array porque jsrender no toma el objeto
            var costoProveedor = [];
            var i=0;
            $.each(pedido.costoProveedor,
                function (index, value) {
                    costoProveedor[i] = value;
                    i++;
                });

            var html = $.templates("#pedidoRentableTmpl").render(costoProveedor);
            $("#pedidoRentableContent").html(html).trigger('create');
        }
        catch(err) {
            preventamobile.util().alerta(err.message);
            pedidoSeleccionado(obtenerIdPedidoSeleccionado());
        }

    };

    renderPedidosDetalle = function () {

        var pedido;
		
		var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
		var porcePerceCliente = preventamobile.ui.listaPedidos().obtenerPerceClienteSeleccionado(codigoCliente);
		// Si hay observaciones para el cliente, mostrarlas
		var observaciones = obtenerObservacionesClienteSeleccionado(codigoCliente);
		
		

	
        if (!hayPedidoSeleccionado()) {

            //var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
			//var porcePerceCliente = preventamobile.ui.listaPedidos().obtenerPerceClienteSeleccionado(codigoCliente);
			
            pedido = preventamobile.dal().factory().pedido(codigoCliente,'',porcePerceCliente);

            
        }
        else {
            var indicePedido = obtenerIdPedidoSeleccionado();
            pedido = preventamobile.dal().obtenerPedido(indicePedido);
        }
		
		var observaciones = obtenerObservacionesClienteSeleccionado(codigoCliente);
		
		if (observaciones) {
			var observa = replaceAll(observaciones,"[BONIF_OFF]","");
			preventamobile.util().alerta(observa, null, "Observaciones", "Continuar");
		}
		

        var htmlHeader = $.templates("#headerEditaPedidosTmpl").render(pedido);
        $("#headerEditaPedidos").html(htmlHeader).trigger('create');

        // El input de tipo date necesita la fecha en formato YYYY-MM-DD por lo que se agrega una funcion helper que utiliza jsrender
        var htmlContent = $.templates("#editaPedidoContentTmpl").render(pedido,
            {
                toDate: function (fecha) {
                    var dateToReturn = moment(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    return dateToReturn;
                }
            });

        $("#editaPedidosContent").html(htmlContent).trigger('create');

    };

    //#region Info sobre cliente activo

    obtenerObservacionesClienteSeleccionado = function (id) {
        var cliente = preventamobile.dal().obtenerCliente(id);
        if (cliente && cliente.observaciones) {
            return cliente.observaciones;
        }
        return '';
    }
	
	obtenerPerceClienteSeleccionado = function (id) {
        var cliente = preventamobile.dal().obtenerCliente(id);
		console.log('Cliente perce iibb ',cliente.porperce);
        if (cliente && cliente.porperce) {
            return cliente.porperce;
        }
        return '';
    }
	
    establecerIdClienteSeleccionado = function (id) {
        localStorage.setItem("CurrentClienteId", id);
    };

    obtenerIdClienteSeleccionado = function () {
        var clienteId = localStorage.getItem("CurrentClienteId");
        if (clienteId) {
            clienteId = clienteId.trim();
        }
        return clienteId;
    };
		
    hayClienteSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentClienteId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    //#region Info sobre articulo activo

    establecerIdArticuloSeleccionado = function (id) {
        localStorage.setItem("CurrentArticuloId", id);
    };

    obtenerIdArticuloSeleccionado = function () {
        return localStorage.getItem("CurrentArticuloId").trim();
    };

    hayArticuloSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentArticuloId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    //#region Info sobre pedido activa

    establecerIdPedidoSeleccionado = function (id) {
        localStorage.setItem("CurrentPedidoId", id);
    };

    obtenerIdPedidoSeleccionado = function () {
        return localStorage.getItem("CurrentPedidoId").trim();
    };

    hayPedidoSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentPedidoId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    //#region Info sobre linea activa

    establecerIdLineaSeleccionada = function (id) {
        localStorage.setItem("CurrentLineaId", id);
    };

    obtenerIdLineaSeleccionada = function () {
        return localStorage.getItem("CurrentLineaId").trim();
    };

    hayLineaSeleccionada = function () {
        var currentId = localStorage.getItem("CurrentLineaId");
        return currentId != undefined;
    };

    limpiarLineaSeleccionada = function () {
        establecerIdLineaSeleccionada(undefined);
    };

    //#endregion

    render = function () {

        var listaPedidos,
            tipoDePedido,
            html;

        var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
        listaPedidos = preventamobile.dal().listarPedidos(codigoCliente);
        // Si no hay pedidos los mando directo a NUEVO
        if (listaPedidos.length == 0) {
            preventamobile.ui.listaPedidos().pedidoNuevo();
        }
        else {

            html = "<div data-role='navbar'><ul id='listapednav'><li><a href='#homePage' data-icon='home' data-iconpos='notext'>Inicio</a></li><li><a href='#clientesDetallePage' data-icon='back'>Atrás</a>" +
                "</li><li><a href='#' data-icon='plus'onclick='preventamobile.ui.listaPedidos().pedidoNuevo();'>Nuevo</a></li></ul></div>";
            $("#headerlistaPedidos").html(html).trigger('create');
            html = "<div data-role='fieldcontain' class='ui-hidden-accessible'><label id='xcodigopedido'>" + "0" + "</label>" + "</div>";
            html = html + "<ul id='ullistaped' data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
                "data-filter='true' data-filter-placeholder='Ingrese valor a buscar'> ";

            $.each(listaPedidos, function (index, value) {

                var esRentable = preventamobile.dal().esPedidoRentable(value);

                tipoDePedido = preventamobile.dal().obtenerTipoPedido(value.tipoDePedido);
                html += "<li  style='white-space:normal;' data-theme='a' ><a style='white-space:normal;' href='#' onclick='preventamobile.ui.listaPedidos().pedidoSeleccionado(" +'"' + value.pedidoId + '"' + ");' ><br><h1>" + value.fecha + " " + tipoDePedido.Descripcion + " - $" + value.total ;
                if (!esRentable) {
                    html += "<span class='ui-li-count'>!$!</span>";
                }
                html += "</h1></a><br></li>";
            });
            html = html + "</ul>";

            $("#listaPedidosContent").html(html).trigger('create');
        }
    };

    pedidoNuevo = function () {
        establecerIdPedidoSeleccionado(0);
        $.mobile.changePage('#editaPedidosPage');
    };

    pedidoSeleccionado = function (codigo) {
        establecerIdPedidoSeleccionado(codigo);
        $.mobile.changePage('#editaPedidosPage');
    };
	function replaceAll(texto,original,nuevo){
		var ntexto=texto.split(original).join(nuevo);
		return ntexto; 		
    };
    /// Este metodo para pedidos nuevos genera un nuevo pedido desde la factory, ya que hasta que no es guardado por primera vez
    ///     no se encuentra realmente en el localStorage
    aplicarPedido = function (redirigir) {

        // redirigir=3, sync individual
        // redirigir>2, no redirige
        // redirigir=1, esta aplicando desde la pagina de detalle
        // redirigir=0, guardo el pedido automaticamente cuando paso a articulos
        
        var pedidoId = $('#pedidoId').text();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);
        var tipoDePedido, tP;
		//alert(JSON.stringify(pedido));
		
		console.log('Estado impreso',pedido.impreso);
		if (pedido.impreso == 0){
			tP = $('input[name="radio-choice-1"]:checked').val();

			tipoDePedido = tP;
			console.log(tipoDePedido);
			var remito = $('input[name="radio-remito"]:checked').val();
			console.log(remito);
		}else{
			tipoDePedido = pedido.tipoDePedido;
			remito = pedido.remito;
		}
        var vales;
        if ($('#sliderVales').val() == "on") {
            vales = "1";
        } else {
            vales = "0";
        }

        var bonificaciones;
        //        if ($('#sliderBoni').val() == "on") {
        //            bonificaciones = "1";
        //        } else {
        bonificaciones = "0";
        //        }
		
		var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
		var obser_cliente = obtenerObservacionesClienteSeleccionado(codigoCliente);
		
			
		if (obser_cliente.search("[BONIF_OFF]") != -1){
			pedido.siBonificar = false;
		}
		
        var observaciones = $('#textObserva').val();
        // Utiliza momentjs para formatear la fecha que se va a guardar en el objeto con formato dd/mm/yyyy		
        var fechaEntrega = moment($('#date2').val()).format("DD/MM/YYYY");
		// Valores pagados
		//var pagoEfectivo = $('#pagoEfectivo').val().replaceAll('$','');
		var pagoEfectivo = replaceAll( $('#pagoEfectivo').val() , '$','');		
		//pagoEfectivo = pagoEfectivo.replaceAll('$','');
		var pagoCheque = replaceAll( $('#pagoCheque').val(),'$','');
		//var pagoCheque = $('#pagoCheque').val().replaceAll('$','');		
		//var pagoTransferencia = $('#pagoTransferencia').val().replaceAll('$','');
		var pagoTransferencia = replaceAll( $('#pagoTransferencia').val() ,'$','');		
        pedido.tipoDePedido = tipoDePedido;
        pedido.vales = vales;
        pedido.remito = remito;
        pedido.bonificaciones = bonificaciones;
        pedido.observaciones = observaciones;
        pedido.fechaEntrega = fechaEntrega;
		pedido.pagoEfectivo = pagoEfectivo.trim();
		pedido.pagoCheque	= pagoCheque.trim();
		pedido.pagoTransferencia = pagoTransferencia.trim();
		
		//alert(JSON.stringify(pedido));
        preventamobile.dal().guardarPedido(pedido);

        // Cambio el tema x el de venta
        var idlineacliente;
        idlineacliente = "#lcli" + pedido.codigoCliente.trim();
        $(idlineacliente).attr("data-theme", "b").trigger('mouseover');
        $(idlineacliente).removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e')
            .addClass('ui-btn-up-' + "b")
            .attr('data-theme', "b");


        // guardo el codigo del pedido nuevamente por si era uno nuevo y no tenia numero
        establecerIdPedidoSeleccionado(pedido.pedidoId);

        switch (redirigir) {
            case 0:
                $.mobile.changePage('#listaArticulosPedidoPage');
                break;
            case 1:
                $.mobile.changePage('#listaPedidosPage');
                break;
            case 2:
                //preventamobile.ui.gridCargaRapidaArticulo().lanzarLista();
                break;
            case 3:
			
				//console.log(pedido.codigoCliente);
            
				var r = confirm("Desea sincronizar el pedido?");
                if (r == true) {
                    var lista = [];
                    lista[0] = pedido;
					
					var cliente = preventamobile.dal().obtenerCliente(pedido.codigoCliente);
					
                    var noventa = [];
					var cuentaCorriente = preventamobile.dal().obtenerCuentaCorriente(cliente);
					//console.log(cuentaCorriente);
					//console.log(cliente);
                    var model = { 
						data: preventamobile.util().serializar(preventamobile.util().comprimir(lista)), 
						noventa: preventamobile.util().serializar(noventa), 
						cuentaCorriente: preventamobile.util().serializar(cuentaCorriente),
						login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo()) 
					};
                    preventamobile.dal().syncPedidosConServidor(model, informarPedidoSyncOk, informarPedidoSyncError);
					preventamobile.dal(). marcarClienteParaSincronizar(pedido.codigoCliente,false);

                } else {
                    alert("No se sincronizó el pedido");
                }

                break;
			case 4:
				 $.mobile.changePage('#imprimirPedidoPage');
				break;
        };
    };





    informarPedidoSyncOk = function () {
        preventamobile.util().showDialog('<h2>Pedido sincronizado</h2>', function () { $.mobile.changePage('#listaPedidosPage'); });
    };

    informarPedidoSyncError = function (error) {
        preventamobile.util().showDialog('<h2>Error al hacer sync del pedido ' + error + '<h2>', function () { $.mobile.changePage('#listaPedidosPage'); });
    };

    borrarPedido = function () {

        var pedido;
        pedido = $('#indicepedido').text();

        if (pedido == 0) {
            alert('Debe seleccionar el pedido a borrar');
        } else {
            preventamobile.dal().eliminarPedido(pedido);
            $.mobile.changePage('#listaPedidosPage');
        }

    };
    imprimirPedido = function () {
		var pedidoId = $('#pedidoId').text();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);
		//alert(pedidoId)

    };

    return {
        render: render,
        pedidoNuevo: pedidoNuevo,
        pedidoSeleccionado: pedidoSeleccionado,
        aplicarPedido: aplicarPedido,
		imprimirPedido: imprimirPedido,
        renderPedidosDetalle: renderPedidosDetalle,
        borrarPedido: borrarPedido,
        establecerIdPedidoSeleccionado: establecerIdPedidoSeleccionado,
        obtenerIdPedidoSeleccionado: obtenerIdPedidoSeleccionado,
        hayPedidoSeleccionado: hayPedidoSeleccionado,
        establecerIdClienteSeleccionado: establecerIdClienteSeleccionado,
        obtenerIdClienteSeleccionado: obtenerIdClienteSeleccionado,
        hayClienteSeleccionado: hayClienteSeleccionado,
        establecerIdArticuloSeleccionado: establecerIdArticuloSeleccionado,
        obtenerIdArticuloSeleccionado: obtenerIdArticuloSeleccionado,
        hayArticuloSeleccionado: hayArticuloSeleccionado,
        establecerIdLineaSeleccionada: establecerIdLineaSeleccionada,
        obtenerIdLineaSeleccionada: obtenerIdLineaSeleccionada,
        hayLineaSeleccionada: hayLineaSeleccionada,
        on_success_pedido: on_success_pedido,
        limpiarLineaSeleccionada: limpiarLineaSeleccionada,
        renderPedidoRentablePage: renderPedidoRentablePage,
        pedidoRentablePage: pedidoRentablePage,
		obtenerPerceClienteSeleccionado: obtenerPerceClienteSeleccionado
    };
};

//@ sourceURL=_listapedidos.js