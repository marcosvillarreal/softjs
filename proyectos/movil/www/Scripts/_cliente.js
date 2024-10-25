var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.cliente = function () {

    var render,
        renderFueraRuta,
        renderClientesDetalle,
        renderinfoPedidosPage,
        linkDestino,
        detallesCliente,
        agregarCliente,
        afectar,
		buscarLista,
		
		fueraRutaPorVendedor,
		
		renderClienteNuevo,
		almacenarClienteNuevo;

    var cargarCuentaCorriente;

    renderClientesDetalle = function () {
        var codigo = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
        var cliente = preventamobile.dal().obtenerCliente(codigo);
        if (cliente) {
            var htmlHeader = $.templates("#clienteDetalleHeaderTmpl").render();
            $("#headerclientesDetalle").html(htmlHeader).trigger('create');
            var htmlDetalleCliente = $.templates("#clienteDetalleTmpl").render(cliente);
            $("#detalleclientesContent").html(htmlDetalleCliente).trigger('create');

            // Mostrar datos de pedidos anteriores para el cliente si existen
            var htmlPedidoAnterior = 'Sin datos';

            if (cliente.pedidoAnterior1) {
                var htmlPedidoAnterior = $.templates("#pedidoAnteriorTmpl").render(cliente.pedidoAnterior1);
                if (cliente.pedidoAnterior2) {
                    htmlPedidoAnterior = htmlPedidoAnterior + $.templates("#pedidoAnteriorTmpl").render(cliente.pedidoAnterior2);
                }
            }

            $('#pedidoAnteriorCliente').html(htmlPedidoAnterior).trigger('create');

            cargarCuentaCorriente(cliente);

        } else {
            alert("No se encontro cliente");
        }
        return false;
    };
	
	buscarLista = function ( objetoUL) {
		var input, filter, ul, li, a, i, txtValue;
		input = document.getElementById("objetoUL");
		filter = input.value.toUpperCase();
		ul = document.getElementById("objetoUL");
		li = ul.getElementsByTagName("li");
		for (i = 0; i < li.length; i++) {
			a = li[i].getElementsByTagName("a")[0];
			txtValue = a.textContent || a.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	}
	
    cargarCuentaCorriente = function (cliente) {
        var htmlCuentaCorrienteCliente = $.templates("#cuentaCorrienteClienteTmpl").render({ cliente: cliente });
        $('#cuentaCorrienteCliente').html(htmlCuentaCorrienteCliente).trigger('create');
    };

    render = function () {

        var clientes = preventamobile.dal().clientesLista();
        $("#clientesContent").html($.templates("#clienteListaTmpl").render({ clientes: clientes })).trigger('create');
    };

    renderinfoPedidosPage = function () {

        var a0 = 0; var a1 = 0; var a2 = 0; var a3 = 0; var a4 = 0;
		var cantidadPedidos = 0;
        var totalPedidos = 0;
		
        var clientes = preventamobile.dal().clientesLista();

        $.each(clientes, function (index, value) {
            var codigo = value.numero.trim();

            var cliente = preventamobile.dal().obtenerCliente(codigo);

            if (cliente) {
                ++a0;
                if (cliente.tienePedido) { ++a1 };
                if (cliente.noVenta) { ++a2 };
                if (!cliente.noVenta && !cliente.tienePedido) { ++a3 };
				
				 var listaPedidos = preventamobile.dal().listarPedidos(codigo);
				 
				 if ((listaPedidos && listaPedidos.length && listaPedidos.length > 0)) {
					$.each(listaPedidos, function (index, value) {

						if (value.total) {

							totalPedidos = totalPedidos + value.total;
							cantidadPedidos = cantidadPedidos + 1;

						}

					});
				}
						 
            };

        });

        $('#A0').text((a0).toFixed(0));
        $('#A1').text((a1).toFixed(0));
        $('#A2').text((a2).toFixed(0));
        $('#A3').text((a3).toFixed(0));

        // Calcular total de pedidos

        var empresa = preventamobile.dal().getEmpresa();
		
		/*
        var pedidos = preventamobile.dal().listarPedidos();

        var cantidadPedidos = 0;
        var totalPedidos = 0;

        if ((pedidos && pedidos.length && pedidos.length > 0)) {
            $.each(pedidos, function (index, value) {

                if (value.total) {

                    totalPedidos = totalPedidos + value.total;
                    cantidadPedidos = cantidadPedidos + 1;

                }

            });
        }
		*/
		
        $('#A4').text((totalPedidos).toFixed(3));

        if (cantidadPedidos > 0)
            $('#A5').text((totalPedidos / cantidadPedidos).toFixed(3));
        else
            $('#A5').text(0);

        $('#A6').text(empresa.coeficienterentabilidad);

        // Calcular promedio de pedidos

        //  $("#infoPedidosPage").html().trigger('create');
    };

    renderFueraRuta = function () {
		
		
		var vendedores = preventamobile.dal().vendedoresLista();
        preventamobile.dal().sort(vendedores, 'codigo', 1);
        if (vendedores && vendedores.length && vendedores.length>0)
        {
            //for (var i = 0; i < secciones.length; i++) {
            //    secciones[i].articulosSeccion = preventamobile.dal().articulosSeccionLista(secciones[i].id);
            //}
			/*
            var html = $.templates("#precioListaTmpl").render({ secciones: secciones });
            if (noTrigger) {
                $("#preciosContent").html(html);
            } else {
                $("#preciosContent").html(html).trigger('create');
            }
			*/
			//var clientes = preventamobile.dal().clientesFueraRutaLista();
			console.log(vendedores);
			$("#clientesFueraRutaContent").html($.templates("#clienteFueraRutaListaTmpl").render({ vendedores: vendedores })).trigger('create');
	
        }

		
    };
	
	
	fueraRutaPorVendedor = function (codigo) {
		//console.log("index "+ id);
        var vdor = $('#vendedor' + codigo)
        if (vdor.html().trim().length <= 0) {
            fueraRutaVendedor = preventamobile.dal().fueraRutaVendedorLista(codigo);
			//console.log(fueraRutaVendedor);
            var html = $.templates("#fueraRutaVdorTmpl").render({ fueraRutaVendedor: fueraRutaVendedor });          
            vdor.html(html).trigger('create');
        };

    };
	
    detallesCliente = function (codigo) {
        preventamobile.ui.listaPedidos().establecerIdClienteSeleccionado(codigo);
        $.mobile.changePage('#clientesDetallePage');
    };

    agregarCliente = function (codigo) {
        var clientaAAgregar = preventamobile.dal().obtenerClienteFueraRuta(codigo);
        preventamobile.dal().guardarClienteEnStorage(clientaAAgregar);
        preventamobile.dal().removerClienteFueraRutaEnStorage(codigo);
        preventamobile.ui.listaPedidos().establecerIdClienteSeleccionado(codigo);
        var clientes = preventamobile.dal().clientesLista();
        $("#clientesContent").html($.templates("#clienteListaTmpl").render({ clientes: clientes })).trigger('create');

        preventamobile.ui.listaPedidos().pedidoNuevo();
    };

    // La informacion de cuenta corriente que esta en cliente.cuentaCorriente puede estar
    // desactualizada respecto de la data local por un sync
    // Entonces se toman los datos del cliente y se le agregan los datos locales de seleccion de comprobantes
    afectar = function (idCuentaCorriente, numeroCliente) {

        var cliente = preventamobile.dal().obtenerCliente(numeroCliente);
        var cuentaCorriente = preventamobile.dal().obtenerCuentaCorriente(cliente); // Cargar info local de cuenta corriente en los datos del cliente

        if (cliente && cuentaCorriente) {

            cliente.totalCuentaCorrienteSeleccionado = 0;
            cliente.totalCuentaCorrientePendiente = 0;
            cliente.totalCuentaCorriente = 0;

            $.each(cuentaCorriente, function (index, value) {

                if (value.idOrden === idCuentaCorriente) {
                    value.seleccionado = !value.seleccionado;
                }

                if (value.seleccionado) {
                    cliente.totalCuentaCorrienteSeleccionado =
                        cliente.totalCuentaCorrienteSeleccionado + (parseFloat(value.saldo.replace(",", ".")) * parseFloat(value.signo));
                } else {
                    cliente.totalCuentaCorrientePendiente = cliente.totalCuentaCorrientePendiente + (parseFloat(value.saldo.replace(",", ".")) * parseFloat(value.signo));
                }

            });

            cliente.totalCuentaCorriente =
                cliente.totalCuentaCorrienteSeleccionado + cliente.totalCuentaCorrientePendiente;

            cliente.totalCuentaCorrienteSeleccionado = cliente.totalCuentaCorrienteSeleccionado.toFixed(2);
            cliente.totalCuentaCorrientePendiente = cliente.totalCuentaCorrientePendiente.toFixed(2);
            cliente.totalCuentaCorriente = cliente.totalCuentaCorriente.toFixed(2);
            cliente.cuentaCorriente = cuentaCorriente;

            preventamobile.dal().guardarClienteEnStorage(cliente);
            preventamobile.dal().guardarCuentaCorrienteEnStorage(cliente.numero.trim(), cuentaCorriente);

            cargarCuentaCorriente(cliente);
        }

    };

    linkDestino = function (opcion) {
		
		//redirigir = 0, pedido
		//redirigir = 1, recibo
		//var opcion = 0;
		
		if (isNaN(opcion)) {opcion=0} ;
		
        var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
		
		var observaciones = preventamobile.ui.listaPedidos().obtenerObservacionesClienteSeleccionado(codigoCliente);
		
		if (opcion == 0 ) {
			if (observaciones) {
				//alert(observaciones.search('PED_OFF'))
				if (observaciones.search("PED_OFF") != -1){
					var observa = preventamobile.dal().replaceAll(observaciones,"[PED_OFF]","");
					preventamobile.util().alerta(observa, null, "Observaciones", "Continuar");
					
					//return true;
				}			
				
			}
			
			var listaPedidos = preventamobile.dal().listarPedidos(codigoCliente);
			// Si no hay pedidos los mando directo a NUEVO
			if (listaPedidos.length == 0) {
				preventamobile.ui.listaPedidos().pedidoNuevo();
			} else {
				$.mobile.changePage('#listaPedidosPage');
			}
		}else{
			var listaRecibos = preventamobile.dal().listarRecibos(codigoCliente);
			// Si no hay recibo los mando directo a NUEVO
			if (listaRecibos.length == 0) {
				preventamobile.ui.listaRecibos().reciboNuevo();
			} else {
				$.mobile.changePage('#listaRecibosPage');
			}
		}
    };
	
	
	//Funciones de nuevo Cliente
	
	renderClienteNuevo = function () {
		
		
		var aceptaNuevoCliente = preventamobile.dal().getClienteNuevo();
		
        if (aceptaNuevoCliente == 'S') {	
		
			var codigo = ''
			//var cliente = preventamobile.dal().obtenerCodigoCliente(codigo);
			var cliente = preventamobile.dal().factory().cliente();
			var categorias = preventamobile.dal().categoriasLista();
			
			console.log(categorias);
			/*var codigoNuevo = localStorage.getItem("UltimoCodigo");
			//if (codigoNuevo == null){
				codigoNuevo = 0
			}
			codigoNuevo++;
			cliente.numero = 'A'+codigoNuevo;
			*/
			codigoNuevo = cliente.numero
			localStorage.setItem("UltimoCodigo",codigoNuevo);
			localStorage.setItem("Cliente - " + cliente.numero.trim(), preventamobile.util().serializar(cliente)); 
		
		 
            var htmlHeader = $.templates("#clienteNuevoHeaderTmpl").render();
            $("#headerClienteNuevoDetalle").html(htmlHeader).trigger('create');
			
            var htmlDetalleCliente = $.templates("#clienteNuevoTmpl").render(cliente);
			
			var htmlLista = "<div id=divcategoria> <fieldset data-role='controlgroup' data-type='horizontal'>"
			htmlLista = htmlLista + "<legend>Categorias</legend>"
			//htmlLista = "<ul data-theme='a' data-role='listview' data-inset='true' data-autodividers='false' " +
            //"data-filter='true' data-filter-placeholder='Ingrese letras a buscar'> ";
			$.each(categorias, function (index, value) {
				//htmlLista = htmlLista + "<li><a href='#' ><h3>" + value.nombre.toUpperCase() + "*" + "</h3></a></li>";
				
				htmlLista = htmlLista + "<input type='radio' name='radio-choice-10' id='radio-choice-"+value.numero+"' value='"+value.numero+"' {{if idcategoria == '" + value.numero + "'}} " + 'checked="checked"'+ " {{/if}} data-type='horizontal' data-inline='true' />" + 
				 "<label for='radio-choice-"+value.numero+"'>"+value.nombre+"</label>"
			
			});
			htmlLista = htmlLista + " </fieldset></div>";
			
			htmlLista = htmlLista + "<div id=divsituacioniva> <fieldset data-role='controlgroup' data-type='horizontal'>"
			htmlLista = htmlLista + "<legend>Situación ante IVA</legend>"
			htmlLista = htmlLista + "<input type='radio' name='radio-choice-11' id='radio-choice-1' value='1' {{if cliente.situacioniva == '1'}} checked='checked' {{/if}} data-type='horizontal' data-inline='true' />"
            htmlLista = htmlLista + "<label for='radio-choice-1'>R.Inscripto</label>"
            htmlLista = htmlLista + "<input type='radio' name='radio-choice-11' id='radio-choice-2' value='5' {{if cliente.situacioniva == '5'}} checked='checked' {{/if}} data-type='horizontal' data-inline='true' />"
            htmlLista = htmlLista + "<label for='radio-choice-2'>R.Monotributo</label>"			
			htmlLista = htmlLista + "<input type='radio' name='radio-choice-11' id='radio-choice-3' value='3' {{if cliente.situacioniva == '3'}} checked='checked' {{/if}} data-type='horizontal' data-inline='true' />"
            htmlLista = htmlLista + "<label for='radio-choice-3'>C.Final</label>"
			
			
			htmlLista = htmlLista + " </fieldset></div>";
			
			
			//console.log(htmlLista);
			
		
			htmlDetalleCliente = htmlDetalleCliente + htmlLista
            $("#detalleclienteNuevoContent").html(htmlDetalleCliente).trigger('create');

           
           

        } else {
            alert("No se encuentra habilitada la función por el momento.");
			return false;
        }
       
    };
	
	almacenarClienteNuevo = function( cliente ){
		var codigoNuevo = localStorage.getItem("UltimoCodigo");
		if (codigoNuevo == null){
			codigoNuevo = 1
		}
		console.log('Almacenar Nuevo Cliente ' + codigoNuevo);
		//codigoNuevo = 'A'+codigoNuevo;
		var mensajeError = '';
		
		if ($('#nombre').val() == ''){			
			mensajeError = 'El Nombre y Apellido no pueden ser vacios \n';
			//console.log(mensajeError);
		}
		if ($('#direccion').val() == ''){
			mensajeError = mensajeError +  'La dirección no pueden ser vacia \n';
			//console.log(mensajeError);
		}
		if ($('#telefono').val() == ''){
			mensajeError = mensajeError + 'El telefono no pueden ser vacio \n';
			//console.log(mensajeError);
		}
		if ($('#cuit').val() == ''){
			mensajeError = mensajeError + 'El documento no pueden ser vacio \n';
			//console.log(mensajeError);
		}
		if ($('#cuit').val() == '00-0000000-00'){
			mensajeError = mensajeError + 'El documento no pueden ser vacio \n';
			//console.log(mensajeError);
		}
		/*
		if ($('input[name="radio-choice-10"]:checked').val() == 0){
			mensajeError = mensajeError + 'Debe elegir una categoria \n';
			//console.log(mensajeError);
		}
		if ($('input[name="radio-choice-11"]:checked').val() == 0){
			mensajeError = mensajeError + 'Debe elegir una tipo IVA';
			//console.log(mensajeError);
		}
		*/

		if (mensajeError==''){
			var clientaAAgregar = preventamobile.dal().obtenerCliente(codigoNuevo);
			clientaAAgregar.nombre = $('#nombre').val();
			clientaAAgregar.direccion = $('#direccion').val();
			clientaAAgregar.telefono = $('#telefono').val();
			clientaAAgregar.cuit = $('#cuit').val();
			
			//console.log('categoria ',clientaAAgregar.idcategoria)
			clientaAAgregar.idcategoria = $('input[name="radio-choice-10"]:checked').val();
			console.log('categoria ',clientaAAgregar.idcategoria)
			var categoria = preventamobile.dal().obtenerCategoria(clientaAAgregar.idcategoria);
			
			clientaAAgregar.Idlista =  categoria.listaprecio;
			if (clientaAAgregar.Idlista.length == 0) {clientaAAgregar.Idlista = "1"};
			
			clientaAAgregar.situacioniva = $('input[name="radio-choice-11"]:checked').val();
			
			clientaAAgregar.situacionivaDescripcion = preventamobile.dal().obtenerDescripcionIva(clientaAAgregar.situacioniva);
			
			
			
			preventamobile.dal().guardarClienteEnStorage(clientaAAgregar);
			//Guardamos la observacion solo en ClientesNuevos. para que no muestre cartel
			clientaAAgregar.observaciones = $('#observaciones').val();
			preventamobile.dal().guardarClienteNuevoEnStorage(clientaAAgregar);
			preventamobile.ui.listaPedidos().establecerIdClienteSeleccionado(codigoNuevo);
			var clientes = preventamobile.dal().clientesLista();
			$("#clientesContent").html($.templates("#clienteListaTmpl").render({ clientes: clientes })).trigger('create');

			preventamobile.ui.listaPedidos().pedidoNuevo();
		}else{
			console.log(mensajeError)
			alert(mensajeError)
			return false
		}
	};
	

	
    return {
        render: render,
        renderFueraRuta: renderFueraRuta,
        renderClientesDetalle: renderClientesDetalle,
        renderinfoPedidosPage: renderinfoPedidosPage,
        linkDestino: linkDestino,
        detallesCliente: detallesCliente,
        agregarCliente: agregarCliente,
        afectar: afectar,
		buscarLista: buscarLista,
		fueraRutaPorVendedor:fueraRutaPorVendedor,
		
		renderClienteNuevo: renderClienteNuevo,
		almacenarClienteNuevo: almacenarClienteNuevo
    };
};

//@ sourceURL=_cliente.js