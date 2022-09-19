var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.altaLineaPedido = function () {

    var render,
        articuloSeleccionado,
        atras,
        buscarPorCodigo,
        buscar,
        calc,
        codigoYaCargado,
        selectorBusqueda;

    render = function () {
        $('#editaLineaSliderCambioVenta').val("off");
        // Limpiar la otra busqueda al ingresar en la caja de texto de busquedas
        $("#artbus").focus(function() {
            $("#artbus2").val("");
        });
        
        $("#artbus2").focus(function() {
            $("#artbus").val("");
        });
        
        var html;
        html = "";
        preventamobile.ui.editaLineaPedido().inicializarLinea();
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        
        var pedido = preventamobile.dal().obtenerPedido(pedidoId);
        if (pedido) {
            $("#altaTotalPedido").text("Total: "+pedido.total);
        };
        $("#artbus").focus();
        $("#editaLineaPedidoContent").html(html).trigger('create');

        $('#cantidad').inputmask("9999");


    };

    atras = function () {
        var indicePedido = localStorage.getItem("CurrentPedidoId");
        var listaArticulosPedido = preventamobile.dal().listarPedidoLineas(indicePedido);
        // Si no hay articulos en el pedido lo mando directo a NUEVO
        if (!listaArticulosPedido.length == 0) {
            $.mobile.changePage('#listaArticulosPedidoPage');
        } else {
            $.mobile.changePage('#listaPedidosPage');
        }
    };

    selectorBusqueda = function () {

        var codigo = $("#artbus").val();
        var texto = $("#artbus2").val();

        if (codigo) {
            buscarPorCodigo(codigo);
        } else {
            if (texto) {
                buscar(texto);
            }
        }

    }

    buscar = function (texto) {
		var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
		var pedido = preventamobile.dal().obtenerPedido(pedidoId);
		
        var sugList = $("#resultados");
        var suniventa = "";
		var precioL = 0;
        if (texto.length < 1) {
            sugList.html("");
            sugList.listview("refresh");
        } else {
            var lista = preventamobile.dal().articulosBuscar(texto);
            var html = "";
            if (lista.length > 0) {
                if (lista.length == 1) {
                    preventamobile.ui.altaLineaPedido().articuloSeleccionado(lista[0].id);
                }
                else {
					//alert(lista.toString());
                    $.each(lista, function (index, value) {
                        suniventa = value.univenta == "1" ? "x Bulto" : "";
						precioL = value.preventa1;
						//console.log(value);
						//console.log("ListaPrecio_Buscar",pedido.listaPrecio);
						//console.log("Precio ",precioL)
						if (pedido.listaPrecio == "2"){
							precioL = value.preventa2;
						};
						if (pedido.listaPrecio == "3"){
							precioL = value.preventa3;
						};
						if (pedido.listaPrecio == "4"){
							precioL = value.preventa4;
						};
						if (pedido.listaPrecio == "5"){
							precioL = value.preventa5;
						};
						if (pedido.listaPrecio == "6"){
							precioL = value.preventa6;
						};
						/*
						switch (pedido.listaPrecio) {
							case "2":
								alert(value.preventa2);
								precioL = value.preventa2;
							case "3":
								precioL = value.preventa3;
							case "4":
								precioL = value.preventa4;
							case "5":
								precioL = value.preventa5;
							case "6":
								precioL = value.preventa6;
						};*/	
						console.log("Precio ",precioL)
                        html = html + "<li style='white-space:normal' >" + "<a id='liarti" + value.numero.trim() + "'" + " style='white-space:normal' href='#' onclick='preventamobile.ui.altaLineaPedido().articuloSeleccionado(" +
                    '"' + value.id + '"' + ");' >" + value.numero + ' - ' + value.nombre + ' $' + precioL + " " + suniventa + "</a></li>";
                    });
                }
            }
            sugList.html(html).trigger("refresh");
            sugList.listview("refresh");

        }
    };

    buscarPorCodigo = function (texto) {
		var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
		var pedido = preventamobile.dal().obtenerPedido(pedidoId);
		
        var sugList = $("#resultados");
        var suniventa = "";
		var precioL = 0;
        if (texto.length < 1) {
            sugList.html("");
            sugList.listview("refresh");
        } else {
            var lista = preventamobile.dal().articulosBuscarCodigo(texto);
            preventamobile.dal().sort(lista, 'numero', 1);
            var html = "";
            if (lista.length > 0) {
                if (lista.length == 1) {
                    preventamobile.ui.altaLineaPedido().articuloSeleccionado(lista[0].id);
                }
                else {
                    $.each(lista, function (index, value) {
                        suniventa = value.univenta == "1" ? "x Bulto" : "";
						precioL = value.preventa1;
						
						//console.log("ListaPrecio_Buscar",pedido.listaPrecio);
						/*
						switch (pedido.listaPrecio) {
							case "2":
								precioL = value.preventa2;
							case "3":
								precioL = value.preventa3;
							case "4":
								precioL = value.preventa4;
							case "5":
								precioL = value.preventa5;
							case "6":
								precioL = value.preventa6;
						};	
						*/
						if (pedido.listaPrecio == "2"){
							precioL = value.preventa2;
						};
						if (pedido.listaPrecio == "3"){
							precioL = value.preventa3;
						};
						if (pedido.listaPrecio == "4"){
							precioL = value.preventa4;
						};
						if (pedido.listaPrecio == "5"){
							precioL = value.preventa5;
						};
						if (pedido.listaPrecio == "6"){
							precioL = value.preventa6;
						};
                        html = html + "<li style='white-space:normal' >" + "<a id='liarti" + value.numero.trim() + "'" + " style='white-space:normal' href='#' onclick='preventamobile.ui.altaLineaPedido().articuloSeleccionado(" +
                    '"' + value.id + '"' + ");' >" + value.numero + ' - ' + value.nombre + ' $' + precioL + " " + suniventa + "</a></li>";
                    });
                }
            }

            sugList.html(html).trigger("refresh");
            sugList.listview("refresh");

        }
    };

    calc = function (texto) {
        var o = $("#artbus");
        var a = o.val();

        var c = '';
        if (texto == 'OK') {
            o.trigger("change");
            o.blur();
        }
        else {

            if (texto == 'B') {
                c = (a.substr(0, a.length - 1));
            } else {
                c = (a + texto);
            }
            o.val(c);
            o.trigger('refresh');
        }
    };

    codigoNoCargado = function (idArticulo) {

        var noCargado = true;
        var pedidoId = preventamobile.ui.listaPedidos().obtenerIdPedidoSeleccionado();
        var lineasPedido = preventamobile.dal().listarPedidoLineas(pedidoId);
        $.each(lineasPedido, function (index, value) {           
            if (idArticulo.trim() == value.idarticulo.trim()) {
                noCargado = false;
                return false;   
            };            
        });
        return noCargado;
    };

    articuloSeleccionado = function (idArticulo) {

        var nombreEmpresa = preventamobile.dal().getNombreEmpresa();        
        var n = nombreEmpresa.indexOf("LEON");
        
        if (n != -1) {

            var estado = codigoNoCargado(idArticulo)
            
            if (estado==false) {       
                alert("Código ya cargado")                
            }
        };
        
        preventamobile.ui.listaPedidos().establecerIdArticuloSeleccionado(idArticulo);
        preventamobile.ui.listaPedidos().limpiarLineaSeleccionada();

        var articulo = preventamobile.dal().obtenerArticulo(idArticulo.trim());
        if (articulo.variedades.length > 0) {
            $.mobile.changePage('#editaLineaVariedadesPage');
        } else {
			
				
				preventamobile.ui.editaLineaPedido().enviarAConfirmacionGuardarLinea(
					{ articulo: articulo },
					function () {

						window.console.log('success');						
						
						if (preventamobile.ui.editaLineaPedido().recalcularLineaEnEdicion() ){
							
							//alert('Aqui GuardarLinea');
							
							preventamobile.ui.editaLineaPedido().guardarLinea();
							preventamobile.ui.editaLineaPedido().inicializarLinea();

							var cantsel = $('#cantidad').val();

							var sugList = $("#resultados");
							var html = "";
							html = html + "<li style='white-space:normal' >" + "<a style='white-space:normal' href='#' >" + articulo.numero + ' - ' + articulo.nombre + " - (" + cantsel + ")" + "</a></li>";

							sugList.html(html).trigger("refresh");
							sugList.listview("refresh");

							$.mobile.changePage("#altaLineaPedidoPage");
						}
					},
					function () {
						preventamobile.ui.editaLineaPedido().inicializarLinea();
						$.mobile.changePage("#altaLineaPedidoPage");
					}
				);
			
        };

        //};

    };

    return {
        render: render,
        articuloSeleccionado: articuloSeleccionado,
        atras: atras,
        selectorBusqueda: selectorBusqueda,
        codigoYaCargado:codigoYaCargado,
        calc: calc

    };
};


//@ sourceURL=_altalineapedido.js