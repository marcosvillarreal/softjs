var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.listaRecibos = function () {

    var render,
        aplicarRecibo,
		imprimirRecibo,
        borrarRecibo,
        reciboNuevo,
        reciboSeleccionado,
        renderRecibosDetalle,
        informarReciboSyncOk,
        informarReciboSyncError,
        establecerIdReciboSeleccionado,
        obtenerIdReciboSeleccionado,
        hayReciboSeleccionado,
        establecerIdClienteSeleccionado,
        obtenerIdClienteSeleccionado,
        hayClienteSeleccionado,
        on_success_recibo,
        obtenerObservacionesClienteSeleccionado,

    

    renderRecibosDetalle = function () {

        var recibo;
		
		var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
		var porcePerceCliente = preventamobile.ui.listaPedidos().obtenerPerceClienteSeleccionado(codigoCliente);
		// Si hay observaciones para el cliente, mostrarlas
		var observaciones = obtenerObservacionesClienteSeleccionado(codigoCliente);
		
		

	
        if (!hayReciboSeleccionado()) {

			
            recibo = preventamobile.dal().factory().pedido(codigoCliente,'','');

            
        }
        else {
            var indicePedido = obtenerIdReciboSeleccionado();
            recibo = preventamobile.dal().obtenerPedido(indicePedido);
        }
		
		console.log(recibo);
		
		var observaciones = obtenerObservacionesClienteSeleccionado(codigoCliente);
		
		if (observaciones) {
			//var observa = preventamobile.dal().replaceAll(observaciones,"[BONIF_OFF]","");
			//preventamobile.util().alerta(observa, null, "Observaciones", "Continuar");
		}
		

        var htmlHeader = $.templates("#headerEditaRecibosTmpl").render(recibo);
        $("#headerEditaRecibos").html(htmlHeader).trigger('create');

        // El input de tipo date necesita la fecha en formato YYYY-MM-DD por lo que se agrega una funcion helper que utiliza jsrender
        var htmlContent = $.templates("#editaReciboContentTmpl").render(recibo,
            {
                toDate: function (fecha) {
                    var dateToReturn = moment(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    return dateToReturn;
                }
            });

        $("#editaRecibosContent").html(htmlContent).trigger('create');

    };

    //#region Info sobre cliente activo
		
    obtenerObservacionesClienteSeleccionado = function (id) {
        var cliente = preventamobile.dal().obtenerCliente(id);
        if (cliente && cliente.observaciones) {
            return cliente.observaciones;
        }
        return '';
    };
	
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

   
    //#region Info sobre pedido activa

    establecerIdReciboSeleccionado = function (id) {
        localStorage.setItem("CurrentPedidoId", id);
    };

    obtenerIdReciboSeleccionado = function () {
        return localStorage.getItem("CurrentPedidoId").trim();
    };

    hayReciboSeleccionado = function () {
        var currentId = localStorage.getItem("CurrentPedidoId");
        return currentId != undefined && currentId != 0;
    };

    //#endregion

    render = function () {

        var listaRecibo,
            html;

        var codigoCliente = preventamobile.ui.listaRecibos().obtenerIdClienteSeleccionado();
        listaRecibos = preventamobile.dal().listarRecibos(codigoCliente);
        // Si no hay pedidos los mando directo a NUEVO
        if (listaRecibos.length == 0) {
            preventamobile.ui.listaRecibos().reciboNuevo();
        }
        else {

            html = "<div data-role='navbar'><ul id='listapednav'><li><a href='#homePage' data-icon='home' data-iconpos='notext'>Inicio</a></li><li><a href='#clientesDetallePage' data-icon='back'>Atrás</a>" +
                "</li><li><a href='#' data-icon='plus'onclick='preventamobile.ui.listaRecibos().reciboNuevo();'>Nuevo</a></li></ul></div>";
            $("#headerlistaRecibos").html(html).trigger('create');
            html = "<div data-role='fieldcontain' class='ui-hidden-accessible'><label id='xcodigopedido'>" + "0" + "</label>" + "</div>";
            html = html + "<ul id='ullistaped' data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
                "data-filter='true' data-filter-placeholder='Ingrese valor a buscar'> ";

            $.each(listaRecibos, function (index, value) {

                html += "<li  style='white-space:normal;' data-theme='a' ><a style='white-space:normal;' href='#' onclick='preventamobile.ui.listaRecibos().reciboSeleccionado(" +'"' + value.pedidoId + '"' + ");' ><br><h1>" + value.fecha  + " - $" + value.total  + " " + value.observaciones;
                
                html += "</h1></a><br></li>";
            });
            html = html + "</ul>";

            $("#listaRecibosContent").html(html).trigger('create');
        }
    };

    reciboNuevo = function () {
		console.log('recibo nuevo');
        establecerIdReciboSeleccionado(0);
        $.mobile.changePage('#editaRecibosPage');
		//$("#radio-choice-dif").removeAttr('disabled');
    };

    reciboSeleccionado = function (codigo) {
        establecerIdReciboSeleccionado(codigo);
        $.mobile.changePage('#editaRecibosPage');
    };
	
    /// Este metodo para pedidos nuevos genera un nuevo pedido desde la factory, ya que hasta que no es guardado por primera vez
    ///     no se encuentra realmente en el localStorage
    aplicarRecibo = function (redirigir) {

        // redirigir=3, sync individual
        // redirigir>2, no redirige
        // redirigir=1, esta aplicando desde la pagina de detalle
        // redirigir=0, guardo el recibo automaticamente cuando paso a articulos
				
        var reciboId = $('#reciboId').text();
        var recibo = preventamobile.dal().obtenerPedido(reciboId);
        var tipoDePedido, tP;
		//alert(JSON.stringify(pedido));
		
		console.log('ID',reciboId);
		
		console.log('Estado impreso',recibo.impreso);
		if (recibo.impreso == 0){
			tP = $('input[name="radio-choice-1"]:checked').val();
			
			tipoDePedido = tP;
			console.log(tipoDePedido);
			var remito = $('input[name="radio-remito"]:checked').val();
			console.log(remito);
		}else{
			tipoDePedido = recibo.tipoDePedido;
		}
        
        var bonificaciones;
        bonificaciones = "0";
		
		var codigoCliente = preventamobile.ui.listaRecibos().obtenerIdClienteSeleccionado();
		var obser_cliente = obtenerObservacionesClienteSeleccionado(codigoCliente);
				
        var observaciones = $('#textObservaR').val();
        // Utiliza momentjs para formatear la fecha que se va a guardar en el objeto con formato dd/mm/yyyy		
       	// Valores pagados
		//var pagoEfectivo = $('#pagoEfectivo').val().replaceAll('$','');
		var pagoEfectivo = preventamobile.dal().replaceAll( $('#pagoEfectivoR').val() , '$','');		
		var pagoCheque = preventamobile.dal().replaceAll( $('#pagoChequeR').val(),'$','');
		var pagoTransferencia = preventamobile.dal().replaceAll( $('#pagoTransferenciaR').val() ,'$','');
		
        recibo.tipoDePedido = tipoDePedido;
        recibo.observaciones = observaciones;
        recibo.pagoEfectivo = pagoEfectivo.trim();
		recibo.pagoCheque	= pagoCheque.trim();
		recibo.pagoTransferencia = pagoTransferencia.trim();
		recibo.esRecibo = true;
		
		var nPagoEfectivo	= parseInt((recibo.pagoEfectivo));
		var nPagoCheque		= parseInt((recibo.pagoCheque));
		var nPagoTransferencia = parseInt((recibo.pagoTransferencia));
		
		if (isNaN(nPagoEfectivo)) { nPagoEfectivo = 0 };
		if (isNaN(nPagoCheque)) { nPagoCheque = 0 };
		if (isNaN(nPagoTransferencia)) { nPagoTransferencia = 0 };
		
		totalRecibo = nPagoEfectivo + nPagoCheque + nPagoTransferencia;
		
		console.log('Recibo $',totalRecibo);
		console.log('ID',recibo.pedidoId);
		recibo.total = totalRecibo;
		
		//alert(JSON.stringify(pedido));
        preventamobile.dal().guardarRecibo(recibo);

        // Cambio el tema x el de venta
        var idlineacliente;
        idlineacliente = "#lcli" + recibo.codigoCliente.trim();
        $(idlineacliente).attr("data-theme", "b").trigger('mouseover');
        $(idlineacliente).removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e')
            .addClass('ui-btn-up-' + "b")
            .attr('data-theme', "b");

		
        // guardo el codigo del recibo nuevamente por si era uno nuevo y no tenia numero
        establecerIdReciboSeleccionado(recibo.pedidoId);

        switch (redirigir) {
            case 0:
                //$.mobile.changePage('#listaArticulosPedidoPage');
                break;
            case 1:
                $.mobile.changePage('#listaRecibosPage');
                break;
            case 2:
                //preventamobile.ui.gridCargaRapidaArticulo().lanzarLista();
                break;
            case 3:
			
				//console.log(pedido.codigoCliente);
				preventamobile.dal().controlarUsuarioValido();
				
				var r = confirm("Desea sincronizar el recibo?");
                if (r == true) {
                    var lista = [];
                    lista[0] = recibo;
					
					var cliente = preventamobile.dal().obtenerCliente(recibo.codigoCliente);
					var clienteNuevo = preventamobile.dal().obtenerClienteNuevo(recibo.codigoCliente);
					
                    var noventa = [];
					var cuentaCorriente = [];
					
                    var model = { 
						data: preventamobile.util().serializar(preventamobile.util().comprimir(lista)), 
						noventa: preventamobile.util().serializar(noventa), 
						cuentaCorriente: preventamobile.util().serializar(cuentaCorriente),
						clienteNuevo: preventamobile.util().serializar(clienteNuevo),
						login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo()) 
					};
                    preventamobile.dal().syncPedidosConServidor(model, informarRecibosSyncOk, informarReciboSyncError);
					preventamobile.dal().marcarClienteParaSincronizar(recibo.codigoCliente,false);

                } else {
                    alert("No se sincronizó el recibo");
                }

                break;
			case 4:
				 $.mobile.changePage('#imprimirReciboPage');
				break;
        };
    };





    informarRecibosSyncOk = function () {
        preventamobile.util().showDialog('<h2>Recibo sincronizado</h2>', function () { $.mobile.changePage('#listaRecibosPage'); });
    };

    informarReciboSyncError = function (error) {
        preventamobile.util().showDialog('<h2>Error al hacer sync del recibo ' + error + '<h2>', function () { $.mobile.changePage('#listaReciboPage'); });
    };

    borrarRecibo = function () {

        var recibo;
        recibo = $('#indicepedido').text();

        if (recibo == 0) {
            alert('Debe seleccionar el recibo a borrar');
        } else {
            preventamobile.dal().eliminarRecibo(recibo);
            $.mobile.changePage('#listaReciboPage');
        }

    };
    imprimirRecibo = function () {
		var pedidoId = $('#reciboId').text();
        var recibo = preventamobile.dal().obtenerPedido(pedidoId);
		//alert(pedidoId)

    };
	
	
    return {
        render: render,
        aplicarRecibo: aplicarRecibo,
		imprimirRecibo: imprimirRecibo,
        borrarRecibo: borrarRecibo,
        reciboNuevo: reciboNuevo,
        reciboSeleccionado: reciboSeleccionado,
        renderRecibosDetalle: renderRecibosDetalle,
        informarReciboSyncOk: informarReciboSyncOk,
        informarReciboSyncError: informarReciboSyncError,
        establecerIdReciboSeleccionado: establecerIdReciboSeleccionado,
        obtenerIdReciboSeleccionado: obtenerIdReciboSeleccionado,
        hayReciboSeleccionado: hayReciboSeleccionado,
        establecerIdClienteSeleccionado: establecerIdClienteSeleccionado,
        obtenerIdClienteSeleccionado: obtenerIdClienteSeleccionado,
        hayClienteSeleccionado: hayClienteSeleccionado,
        on_success_recibo: on_success_recibo,
        obtenerObservacionesClienteSeleccionado: obtenerObservacionesClienteSeleccionado,
		
		
    };
};

//@ sourceURL=_listarecibos.js