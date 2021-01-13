var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.editaLineaPedido = function () {

    var render = function () {

        var articuloId = preventamobile.ui.listaPedidos().obtenerIdArticuloSeleccionado();
        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var decimales = preventamobile.dal().getDecimales();

        var pedido = preventamobile.dal().obtenerPedido(pedidoId);
        var articulo = preventamobile.dal().obtenerArticulo(articuloId);

        if (!articulo || !pedido) {
            alert("No se puede editar la linea especificada");
            return false;
        }

        var linea = preventamobile.dal().obtenerPedidoLinea(pedidoId, lineaId);

        // veo si es una linea nueva
        if (!linea) {
            linea = preventamobile.dal().factory().lineaPedido();
            linea.idarticulo = idarticulo;
            linea.codigoArticulo = articulo.numero;
            linea.cantidad = "";
            linea.peso = articulo.peso;
            linea.sikilos = articulo.sikilos;
            linea.bonif1 = articulo.bonif1;
            if (linea.bonif1 == 0) {
                linea.bonif1 = "";
            };
            linea.univenta = articulo.univenta;
            linea.unibulto = articulo.unibulto;
            if (linea.univenta == 0) {
                linea.univenta = "0";
            };
			linea.kilos = "";
			

        } else {
            linea = pedido.lineas[lineaId];
        }

        var model = { linea: linea, articulo: articulo, decimales: decimales };
        $("#headerEditaLineaPedido").html($.templates("#headerEditaLineaPedidoTmpl").render(linea)).trigger('create');
        $("#editaLineaPedidoContent").html($.templates("#editaLineaPedidoContentTmpl").render(model)).trigger('create');
        $('#editaLineaSliderCambioVenta').val("off");
        return false;
    };

    var enviarAConfirmacionGuardarLinea = function (options, success, cancel) {

        // Cargar datos de detalle segun options {articulo}
        $('#articulo').val(options.articulo.numero + ' - ' + options.articulo.nombre);
        $('#articuloPrecioUnitario').val(options.articulo.preventa1);
        $('#articuloUnidadesPorBulto').val(options.articulo.unibulto);
        $('#articuloSiKilos').val(options.articulo.sikilos);
        $('#articuloPeso').val(options.articulo.peso);
		$('#articuloNetoUnitario').val(options.articulo.neto);
		$('#articuloTipoBonif').val(options.articulo.tipobonif);
		$('#articuloPorceMerma').val(options.articulo.porcemerma);
		$('#articuloMaxBonif').val(options.articulo.bonif1);
		$('#kilos').val('');
		$('#kilos').hide();
		$('#labelkilos').hide();
		if ($('#articuloSiKilos').val() == "S") {
			$('#kilos').show();
			$('#labelkilos').show();
		}
		if ($('#articuloTipoBonif').val() == "2"){
			$('#bonif1').val(options.articulo.bonif1);
		}
        // Mostrar pantalla con detalles
        $.mobile.changePage("#confirmaAltaLineaPedidoPage");

        // Establecer slider luego de cambiar de pagina ya que tiene que estar inicializado para llamar al metodo refresh
        var sliderVal;
        if (options.articulo.univenta == '1') { sliderVal = 'on'; } else { sliderVal = 'off'; }
        $('#sliderUniVenta').val(sliderVal).slider("refresh");


        $("#cantidad").focus();

        $("#confirmaAltaLineaPedidoOk").unbind().click(success);
		$("#confirmaAltaLineaPedidoOk").hide();
        $("#confirmaAltaLineaPedidoCancel").unbind().click(cancel);

    };

    var guardarLinea = function (edicion) {

        var articuloId = preventamobile.ui.listaPedidos().obtenerIdArticuloSeleccionado();
        var articulo = preventamobile.dal().obtenerArticulo(articuloId);

        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);

        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();
        var linea = preventamobile.dal().obtenerPedidoLinea(pedidoId, lineaId);

        // veo si es una linea nueva
        if (!linea) {
            linea = preventamobile.dal().factory().lineaPedido();
            linea.peso = articulo.peso;
            linea.sikilos = articulo.sikilos;
			
        } else {
            linea = pedido.lineas[lineaId];
        }
		
		//alert(linea);
		
        linea.idarticulo = articuloId;
        linea.idproveedor = articulo.idproveedor;
        linea.codigoArticulo = articulo.numero;
        linea.precio = articulo.preventa1;
        linea.costo = articulo.costo;
		linea.neto= articulo.neto;
		linea.porcemerma = articulo.porcemerma;
		
        // obtener valores de controles y actualizar info de la linea
        var uniVenta;
        var signo;
		var cantidad;
		var pesoEstimado;
		var peso;
		
        if (edicion) {
            if ($('#editaLineaSliderCambioVenta').val() == "on") { signo = -1; } else { signo = 1; };
            linea.cantidad = Math.abs($('#editaLineaCantidad').val()) * signo;
            linea.bonif1 = $('#editaLineaBonif1').val();
            if ($('#editaLineaSliderUniVenta').val() == "on") { uniVenta = "1"; } else { uniVenta = "0"; };
            linea.univenta = uniVenta;
            linea.unibulto = $('#editaLineaUnibulto').val();
			linea.kilos = Math.abs($('#editaLineaKilos').val()) * signo;
            // Actualizar la cantidad que varia segun el slider de cambio / venta
            $('#editaLineaCantidad').val(linea.cantidad);
        } else {
            if ($('#sliderVenta').val() == "on") { signo = -1; } else { signo = 1; };
            linea.cantidad = Math.abs($('#cantidad').val()) * signo;
            linea.bonif1 = $('#bonif1').val();
            if ($('#sliderUniVenta').val() == "on") { uniVenta = "1"; } else { uniVenta = "0"; };
            linea.univenta = uniVenta;
            linea.unibulto = $('#articuloUnidadesPorBulto').val();
			linea.kilos		= Math.abs($('#kilos').val()) * signo;
        }
        
        if (linea.cantidad == 0) {
            alert('Debe indicar una cantidad!');
            return false;
        };
		
		//Si se vende por kilos, validamos que tiene que tener kilos cargados
		if ($('#articuloSiKilos').val() == "N") {
			linea.kilos = 0;
		}else{
			cantidad = linea.cantidad ;
			peso 	= articulo.peso;
			kilos	= linea.kilos;
			
			//Validamos que los kilos esten en el valor estimado
			var pesoEstimado = peso * cantidad;
			var porceMerma = linea.porcemerma;
			if ((pesoEstimado * (1 - porceMerma /100) <= kilos ) && (kilos <= pesoEstimado * (1 + porceMerma /100)) ){
			}else{
				alert('Los kilos son inferiores / superios al estimado de ' + pesoEstimado * (1 - porceMerma / 100)+' '+ pesoEstimado * (1 + porceMerma / 100));
				//$("#cantidad").val('');
				//$("#kilos").val('');
				return false;
			}			
        }
		
        preventamobile.dal().guardarPedidoLinea(pedidoId, linea);
        return true;

    };

    var recalcularLineaEnEdicion = function () {

        var signo;
        var peso;

        if ($('#sliderVenta').val() == "on") { signo = -1; } else { signo = 1; };

        var cantidad = Math.abs($('#cantidad').val()) * signo;
        var bonif1 = $('#bonif1').val();
        var precio = $('#articuloPrecioUnitario').val();
		var neto	= $('#articuloNetoUnitario').val();
		var kilos	= Math.abs($('#kilos').val())*signo;
		var peso	=  Math.abs($('#articuloPeso').val());
		var porceMerma = Math.abs($('#articuloPorceMerma').val());
		
			
		//0=Nada,1=Se valida tope,2=se autocompleta
		if ($('#articuloTipoBonif').val() == '1'){
			if (bonif1 > $('#articuloMaxBonif').val()) {
				alert('Bonificacion digitada, supera la establecida.');
				$('#bonif1').val('');
				return false
			}else{
				//alert('bonif1' + bonif1);
				//alert('#articuloMaxBonif ' + $('#articuloMaxBonif').val());
				
			}
		}
		//Si no se vende por kilos, usamos calculamos venta si existe en bultos
		if ($('#articuloSiKilos').val() == "N") {
			if ($('#sliderUniVenta').val() == "on") {
			    cantidad = cantidad * $('#articuloUnidadesPorBulto').val();
			}
			peso = 1;
		}else{ 			
			//Validamos que los kilos esten en el valor estimado
			var pesoEstimado = peso * cantidad;
			//alert('porceMerma ' + porceMerma);
			if ($('#kilos').val() == ''){
				kilos = 0;
				peso = 0;
				
			}else{
				if ((pesoEstimado * (1 - porceMerma /100) <= kilos ) && (kilos <= pesoEstimado * (1 + porceMerma /100)) ){
					peso = kilos;
					cantidad = 1; //Para el calculo va en 1, no se alamcena
				}else{
					alert('Los kilos son inferiores / superios al estimado de ' + pesoEstimado * (1 - porceMerma / 100)+' '+ pesoEstimado * (1 + porceMerma / 100));
					return false;
				}	
			}
        }
        
		//alert(peso);
        //if ($('#sliderUniVenta').val() == "on") {
        //    cantidad = cantidad * $('#articuloUnidadesPorBulto').val();
        //}

        var precioBonificado = (precio * (1 - (bonif1 / 100))).toFixed(3);
        var netoBonificado	= (neto * (1 - (bonif1 / 100))).toFixed(3);
		//peso = 1;
        //if ($('#articuloSiKilos').val() == "S") {
        //    peso = $('#articuloPeso').val();
        //    if (isNaN(peso) == true) { peso = 1 }
        //    else {                
        //        peso = Math.round(peso * 100) / 100
        //        if (peso == 0) { peso = 1 };
        //    }
        //}
		
		
        $('#articuloPrecioBonificado').val(precioBonificado);
        $('#totalLinea').val((cantidad * peso  * precioBonificado).toFixed(3));
		//alert('totalLinea' + (cantidad * peso  * precioBonificado).toFixed(3));
		
		$('#articuloNetoBonificado').val(netoBonificado);
        $('#totalNetoLinea').val((cantidad * peso  * netoBonificado).toFixed(3));
		
		$('#confirmaAltaLineaPedidoOk').show();
		if ($('#totalLinea').val() == 0){
			$('#confirmaAltaLineaPedidoOk').hide();
			
		}
		
    };

    var lineaNueva = function () {
        $.mobile.changePage('#altaLineaPedidoPage');

    };

    var borrarLinea = function () {

        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var lineaId = preventamobile.ui.listaPedidos().obtenerIdLineaSeleccionada();

        if (!pedidoId) {
            alert('Debe seleccionar la linea a borrar');
        } else {

            preventamobile.dal().eliminarPedidoLinea(pedidoId, lineaId);

            $.mobile.changePage('#listaArticulosPedidoPage');
        }

    };

    var inicializarLinea = function () {

        // Nueva linea siempre se muestra como venta
        $('#sliderVenta').val('off').slider("refresh");
        $("#artbus").val("");
        $("#artbus2").val("");
        $("#cantidad").val("");
        $("#bonif1").val("");
        $("#resultados").empty();

    };


    return {
        render: render,
        lineaNueva: lineaNueva,
        guardarLinea: guardarLinea,
        enviarAConfirmacionGuardarLinea: enviarAConfirmacionGuardarLinea,
        inicializarLinea: inicializarLinea,
        borrarLinea: borrarLinea,
        recalcularLineaEnEdicion: recalcularLineaEnEdicion
    };
};

//@ sourceURL=_editalineapedido.js