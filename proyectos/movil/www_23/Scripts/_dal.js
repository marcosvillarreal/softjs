var preventamobile = preventamobile || {};

preventamobile.dal = function () {

    //#region Variables

    var syncFull,
        serverInfo,
        serverVersion,
        sync,

        syncTracking,
        syncTrackingConServidor,

        syncClientes,
        guardarClientesEnStorage,
        guardarClienteEnStorage,
        guardarCuentaCorrienteEnStorage,
        removerClienteFueraRutaEnStorage,
        clientesLista,
        clientesFueraRutaLista,
        obtenerCliente,
        obtenerCuentaCorriente,
        obtenerClienteFueraRuta,
        eliminarClientes,
        marcarClienteParaSincronizar,
        obtenerDescripcionIva,
		actualizarClientesEstados,
		
        getUrlServer,
        setUrlServer,

        getNombreEmpresa,
        getEmpresa,
        getDecimales,
        getTracking,
        setTitle,

        syncArticulos,
        guardarArticulosEnStorage,
        articulosLista,
        articulosSeccionLista,
        articulosBuscar,
        articulosBuscarCodigo,
        obtenerArticulo,

        obtenerProveedor,
        guardarProveedoresEnStorage,

        syncSecciones,
        guardarSeccionesEnStorage,
        seccionesLista,
        obtenerSeccion,

        syncNoVenta,
        getNoVentaFromExternalDb,
        noVentaLista,
        obtenerNoVenta,
        establecerNoVenta,
        listarNoVenta,
        listarCuentaCorriente,
        guardarNoVenta,

        calcularTotal,
		generarListPedido,
        establecerTienePedido,
        syncPedidos,
        syncPedidosConServidor,
        guardarPedido,
        eliminarPedido,
        eliminarPedidos,
        borrarPedidos,
        listarPedidos,
        obtenerPedido,
        esPedidoRentable,
        detallePedidoNoRentable,

        guardarPedidoLinea,
        eliminarPedidoLinea,
        listarPedidoLineas,
        listarPedidoLineasPorArticulo,
        obtenerPedidoLinea,

        guardarLineaVariedad,
        eliminarLineaVariedad,
        listarLineaVariedad,
        calcularLineaTotal,
        recalcularTotalesLinea,

        syncTipoPedido,
        getTipoPedidoFromExternalDb,
        obtenerTipoPedido,
        clearData,
        factory,
        eliminarLista,
        obtenerLista,
        guardarLista,
        getLoginInfo,
        setLoginInfo,
        sort,
        agregarLog,
        obtenerLog,
        limpiarLog,

        controlarUsuarioValido;

    //#endregion

    //#region log

    obtenerLog = function () {
        return localStorage.getItem("log");
    };

    agregarLog = function (mensaje) {
        var logActual = obtenerLog();
        if (!logActual) {
            logActual = "";
        }
        var logNuevo = logActual + mensaje + '|';
        localStorage.setItem("log", logNuevo);
    };

    limpiarLog = function () {
        localStorage.removeItem("log");
    };

    //#endregion

    //#region Login

    getEmpresa = function () {

        try {
            var empresaString = localStorage.getItem("empresa");
            if (empresaString) {
                return JSON.parse(empresaString);
            }
            return null;
        } catch (err) {
            return null;
        }

    }

    getNombreEmpresa = function () {

        var empresa = getEmpresa();

        if (empresa && empresa.razonsocial)
            return empresa.razonsocial;

        return "Empresa sin Sincronizar";

    }

    getDecimales = function () {

        var empresa = getEmpresa();

        if (empresa && empresa.decimales)
            return empresa.decimales;

        return 1;

    }

    getTracking = function () {

        var empresa = getEmpresa();

        if (empresa && empresa.trackinghabilitado)
            return empresa.trackinghabilitado;

        return 1;

    }

    setTitle = function () {
        $("#apptitle").text(getNombreEmpresa());
    }

    getLoginInfo = function () {
        return { username: localStorage.getItem("PM_USERNAME"), password: localStorage.getItem("PM_PASSWORD") };
    };

    setLoginInfo = function (username, password) {
        localStorage.setItem("PM_USERNAME", username);
        localStorage.setItem("PM_PASSWORD", password);
    };

    controlarUsuarioValido = function () {

        // beforeSend: function (xhr) { preventamobile.util().setAuthorizationHeader(xhr, preventamobile.dal().getLoginInfo()); },

        var model = { data: preventamobile.util().serializar(preventamobile.dal().getLoginInfo()) };

        $.ajax({
            url: preventamobile.configuration().getUrlBase() + "usuariovalido",
            type: 'GET',
            cache: false,
            async: false,
            data: model,
            success: function (response) {
                var data = JSON.parse(response);
                if (!data || !data.valido) {
                    throw new Error("El usuario o la clave ingresada son incorrectos");
                }
            }
        }).error(function (data) {
            var errorMessage = "No se pudo conectar con el servicio de datos, verifique la conección a Internet de su dispositivo: El código de error es " + data.status + " - " + data.statusText;
            preventamobile.util().log(errorMessage);
            throw new Error(errorMessage);
        });
    };

    //#endregion

    //#region Sync

    serverVersion = function (callback) {
        $.ajax({
            url: preventamobile.configuration().getUrlBase() + "info",
            type: 'GET',
            cache: false,
            async: false,
            success: function (dataInfo) {

                try {

                    var data = JSON.parse(dataInfo);

                    callback(data.version);

                } catch (exception) {
                    var errorMessage = "No se pudo obtener informacion del servidor: " + exception;
                    preventamobile.util().log(errorMessage);
                    callback(errorMessage);
                    throw new Error(errorMessage);
                }
            }
        }).error(function (data) {
            var errorMessage = "No se pudo obtener informacion del servidor: " + data.status + " - " + data.statusText;
            preventamobile.util().log(errorMessage);
            callback(errorMessage);
            throw new Error(errorMessage);
        });
    };

    clearData = function () {
        localStorage.clear();
    };

    serverInfo = function (callback) {
        return serverVersion(callback);
    };

    sync = function (options) {

        preventamobile.parametros.indicadorProgreso = options.progreso;
        var tipoSync = ["Clientes/Precios", "Pedidos", "Total", "Pedidos 1 a 1"];
        var op = localStorage.getItem("opcionSync"); // opciones de sincronizacion

        preventamobile.util().log("Inicio sync " + tipoSync[op - 1] + Date());

        var error = "";

        try {

            setLoginInfo(options.filtro.username, options.filtro.clave);

            controlarUsuarioValido();

            // sync download o total 
            if (op == 2 || op == 3) {
                syncPedidos();
            };

            // sync upload o total
            if (op == 1 || op == 3) {
                syncNoVenta();
                syncTipoPedido();
                syncFull(options.filtro.dia, options.filtro.username, options.filtro.clave);
            };

			 if (op == 4) {
                syncPedidosOneForOne();
            };
            //syncSecciones();
            //syncArticulos();
            //syncClientes(options.filtro.dia);

        } catch (e) {
            error = e;
            preventamobile.util().log(error);
        }

        preventamobile.util().log("Fin sync");

        preventamobile.parametros.indicadorProgreso = "";

        return error;
    };

    syncFull = function (dia, username, password) {

        try {
            var filtro = { dia: dia, username: username, password: password };
            preventamobile.util().log("Inicio syncFull");

            eliminarClientes();

            // TODO: pasar filtro al servicio
            var model = { data: preventamobile.util().serializar(filtro) };

            preventamobile.util().log("Inicio llamada ajax");

            // beforeSend: function (xhr) { preventamobile.util().setAuthorizationHeader(xhr, preventamobile.dal().getLoginInfo()); },
            // Los datos deben encontrarse ordenados para su correcta presentacion

            setTimeout(function () {

                $.ajax({
                    url: preventamobile.configuration().getUrlBase() + "fullsync",
                    type: 'GET',
                    cache: false,
                    async: false,
                    data: model,
                    success: function (response) {

                        try {
                            preventamobile.util().log("Finalizada llamada ajax");
                            var parsedResponse = JSON.parse(response);
							
							preventamobile.util().log("Iniciando guardarArticulosEnStorage");
                            var articulos = JSON.hunpack(JSON.parse(parsedResponse.articulos));
							//alert(JSON.parse(parsedResponse.articulos))
                            if (articulos && articulos.length > 0) {
                                // preventamobile.util().log("Iniciando guardarArticulosEnStorage");
                                guardarArticulosEnStorage(articulos);
                            }
							
                            preventamobile.util().log("Iniciando guardarSeccionesEnStorage");
							//alert(JSON.parse(parsedResponse.secciones))
							var secciones = JSON.hunpack(JSON.parse(parsedResponse.secciones));                            
							if (secciones && secciones.length > 0) {
                                // preventamobile.util().log("Iniciando guardarSeccionesEnStorage");
                                guardarSeccionesEnStorage(secciones);
                            } 
							preventamobile.util().log("Iniciando guardarProveedoresEnStorage");
                            if (parsedResponse.proveedores !== ''){
                                var proveedores = JSON.hunpack(JSON.parse(parsedResponse.proveedores));
                                if (proveedores && proveedores.length > 0) {
                                    // preventamobile.util().log("Iniciando guardarProveedoresEnStorage");
                                    guardarProveedoresEnStorage(proveedores);
                                }
                            }

                            localStorage.setItem("empresa", parsedResponse.empresa);

                            preventamobile.dal().setTitle();

                            // preventamobile.ui.precios().render(true);
                            $("#divprecios").html("");
                            preventamobile.util().log("Iniciando guardarClientesEnStorage");
                            guardarClientesEnStorage(parsedResponse);

                            preventamobile.util().log("Fin syncFull");
							
							actualizarClientesEstados();
							
                        } catch (exception) {

                            preventamobile.util().log("Error al obtener datos : " + exception);

                        }
                    }
                }).error(function (data) {
                    preventamobile.util().log("No se pudo completar la operación syncClientes: " + data.status + " - " + data.statusText);
                    throw new Error("No se pudo completar la operación syncClientes: " + data.status + " - " + data.statusText);
                });

            }, 1);

        } catch (e) {
            preventamobile.util().log("No se pudo completar la operación syncClientes: " + e);
        }
    };

    //#endregion

    //#region Clientes

    syncClientes = function (dia) {

        try {
            var filtro = { dia: dia };
            preventamobile.util().log("Inicio syncClientes");

            eliminarClientes();

            var model = { data: preventamobile.util().serializar(filtro) };

            preventamobile.util().log("Inicio llamada ajax");

            // Los datos deben encontrarse ordenados para su correcta presentacion
            $.ajax({
                url: preventamobile.configuration().getUrlBase() + "clientes",
                beforeSend: function (xhr) { preventamobile.util().setAuthorizationHeader(xhr, preventamobile.dal().getLoginInfo()); },
                type: 'GET',
                cache: false,
                async: false,
                data: model,
                success: function (dataClientes) {

                    try {

                        var data = JSON.parse(dataClientes);

                        if (data && data.clientes && data.fueraRuta) {
							//alert('Entrando a actualiza');
                            guardarClientesEnStorage(data);
                        }
						
						
						
                        preventamobile.util().log("Fin syncClientes......");
						
						//2022-01-12 Tratamos de volver a marcar s los clientes si hubo una sync de clientes antes de sync de pedidos
						actualizarClientesEstados();

                    } catch (exception) {

                        preventamobile.util().log("Error al obtener datos de clientes: " + exception);

                    }
                }
            }).error(function (data) {
                preventamobile.util().log("No se pudo completar la operación syncClientes: " + data.status + " - " + data.statusText);
                throw new Error("No se pudo completar la operación syncClientes: " + data.status + " - " + data.statusText);
            });
        } catch (e) {
            preventamobile.util().log("No se pudo completar la operación syncClientes: " + e);
        }
    };

    eliminarClientes = function () {

        eliminarLista("Cliente");
        eliminarLista("FueraRuta");

    };

    guardarClientesEnStorage = function (data) {

        preventamobile.util().log("Inicio guardarClientesEnStorage");

        var clientes,
            fueraRuta;

        if (data.clientes)
            clientes = JSON.hunpack(JSON.parse(data.clientes));

        if (data.fueraRuta)
            fueraRuta = JSON.hunpack(JSON.parse(data.fueraRuta));

        if (clientes && clientes.length > 0) {
            guardarLista("Cliente", clientes);
            for (var index = 0; index < clientes.length; index++) {
                preventamobile.ui.cliente().afectar('', clientes[index].numero);
            }
        }
        if (fueraRuta && fueraRuta.length > 0) {
            guardarLista("FueraRuta", fueraRuta);
        }
        preventamobile.util().log("Fin guardarClientesEnStorage");
    };

    obtenerCliente = function (codigo) {
        if (!codigo) {
            return false;
        }

        var cliente = localStorage.getItem("Cliente - " + codigo.trim());
        if (cliente) {
            var clienteObj = JSON.parse(cliente);
            clienteObj.situacionivaDescripcion = obtenerDescripcionIva(clienteObj.situacioniva);
            return clienteObj;
        }
        return false;
    };
	
	actualizarClientesEstados = function () {
		
		
		
		var empresa = getEmpresa();

		var pedidos = listarPedidos();

		preventamobile.util().log('Actualizando Clientes')
		
		if ((pedidos && pedidos.length && pedidos.length > 0)) {
			$.each(pedidos, function (index, value) {
				
				//El servidor no marca el pedido en la app como sync
				/*
				preventamobile.util().log(value.pedidoId)
				
				var sincronizar = true ; 
				if (value.pedidoID != ''){ 
					sincronizar = false;
				}
				marcarClienteParaSincronizar(value.codigoCliente,sincronizar);
				*/
				establecerTienePedido(value.codigoCliente, true);
			

			});
		}
		
		
	};			
		
    obtenerCuentaCorriente = function (cliente) {

        if (!cliente  || !cliente.cuentaCorriente) {
            return false;
        }

        var cuentaCorrienteLocal = localStorage.getItem("CuentaCorriente - " + cliente.numero.trim());

        if (!cuentaCorrienteLocal)
            return cliente.cuentaCorriente;

        var cuentaCorrienteLocalObj = JSON.parse(cuentaCorrienteLocal);
        $.each(cuentaCorrienteLocalObj, function (indexLocal, valueLocal) {

            $.each(cliente.cuentaCorriente, function (index, value) {

                if (value.idOrden === valueLocal.idOrden) {
                    value.seleccionado = valueLocal.seleccionado;
                };
            });
        });

        return cliente.cuentaCorriente;
    };

    obtenerDescripcionIva = function (numero) {
        var iva = ['R.Inscripto', 'R.No Inscripto', 'Cons. Final', 'Exento', 'R:Monotributo', 'R.I. Ley 19640', 'Extranjero'];
        return iva[numero - 1];
    }

    marcarClienteParaSincronizar = function (codigo, sincronizar) {
        var cliente = obtenerCliente(codigo);
        if (cliente) {
            cliente.sincronizar = sincronizar;
            guardarClienteEnStorage(cliente);
            // Actualizar la lista para que no muestre la marca de sincronizar
            if (!sincronizar)
                $("#sincronizar" + codigo).hide();
            else
                $("#sincronizar" + codigo).show();
        }
    };

    obtenerClienteFueraRuta = function (codigo) {
        var cliente = localStorage.getItem("FueraRuta - " + codigo.trim());
        if (cliente) {
            return JSON.parse(cliente);
        }
        return false;
    };

    guardarClienteEnStorage = function (cliente) {
        localStorage.setItem("Cliente - " + cliente.numero.trim(), preventamobile.util().serializar(cliente));
    };
    
    guardarCuentaCorrienteEnStorage = function (codigoCliente, cuentaCorriente) {
        localStorage.setItem("CuentaCorriente - " + codigoCliente.trim(), preventamobile.util().serializar(cuentaCorriente));
    };

    removerClienteFueraRutaEnStorage = function (codigo) {
        localStorage.removeItem("FueraRuta - " + codigo.trim());
    };

    clientesLista = function () {
        var clientes = obtenerLista("Cliente");
        sort(clientes, 'ordenvisita', 1);
        return clientes;

    };

    clientesFueraRutaLista = function () {
        var clientesFueraRuta = obtenerLista("FueraRuta");
        sort(clientesFueraRuta, 'nombre', 1);
        return clientesFueraRuta;
    };

    //#endregion

    //#region Articulos

    syncArticulos = function () {

        preventamobile.util().log("Inicio syncArticulos");

        // Articulos individuales
        $.ajax({
            url: preventamobile.configuration().getUrlBase() + "articulos",
            beforeSend: function (xhr) { preventamobile.util().setAuthorizationHeader(xhr, preventamobile.dal().getLoginInfo()); },
            type: 'GET',
            cache: false,
            async: false,
            success: function (articulos) {
                var data = JSON.parse(articulos);
                if (data && data.length > 0) {
                    guardarArticulosEnStorage(data);
                }

                // preventamobile.ui.precios().render(true);
                $("#divprecios").html("");

                preventamobile.util().log("Fin syncArticulos");
            }
        }).error(function (data) {
            throw new Error("No se pudo completar la operación: " + data.status + " - " + data.statusText);
        });
    };

    guardarArticulosEnStorage = function (articulos) {
        preventamobile.util().log("Inicio guardarArticulosEnStorage");
        // Quitar informacion previa de articulos
        eliminarLista("Articulo");
        // Los datos deben encontrarse ordenados para su correcta presentacion
        $.each(articulos, function (index, value) {
            value.id = value.numero;
            localStorage.setItem("Articulo - " + value.id.trim(), preventamobile.util().serializar(value));
        });
        preventamobile.util().log("Fin guardarArticulosEnStorage");
    };

    obtenerArticulo = function (idarticulo) {

        var articulo = localStorage.getItem("Articulo - " + idarticulo);
        if (articulo) {
            return JSON.parse(articulo);
        }
        return false;
    };

    articulosLista = function () {
        return obtenerLista("Articulo");
    };

    articulosSeccionLista = function (idSeccion) {

        var lista = [];

        // Ciclar las keys de localStorage y devolver las que comienzan con Articulo y pertenecen a la seccion
        var listaIndex = 0;
        var articulos = articulosLista();
        if (articulos && articulos.length > 0)
            for (var index = 0; index < articulos.length; index++) {
                if (idSeccion === articulos[index].idseccion) {
                    lista[listaIndex] = articulos[index];
                    listaIndex++;
                }
            }
        sort(lista, "nombre", 1);
        return lista;

    };

    articulosBuscar = function (cadena) {

        var lista = [];

        // Ciclar las keys de localStorage y devolver las que comienzan con Articulo
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var index = 0; index < localStorage.length; index++) {
                var key = localStorage.key(index);
                var value = localStorage[key];
                var cad = cadena.toUpperCase();
                if (key.substr(0, 8) === 'Articulo') {
                    var articulo = preventamobile.dal().obtenerArticulo(key.substr(11, 8));
                    var nom = articulo.nombre.toUpperCase();
                    var posi = nom.indexOf(cad.trim());
                    var posi2 = articulo.numero.indexOf(cadena.trim());
                    if (posi >= 0 || posi2 >= 0) {
                        lista[listaIndex] = JSON.parse(value);
                        listaIndex++;
                    }
                }
            }
        }

        return lista;

    };

    articulosBuscarCodigo = function (cadena) {

        var lista = [];
        var strCadena = cadena.trim();

        var posi3 = strCadena.indexOf("-");
        strCadena = strCadena.replace("-", "");
        // Ciclar las keys de localStorage y devolver las que comienzan con Articulo
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var index = 0; index < localStorage.length; index++) {
                var key = localStorage.key(index);
                var value = localStorage[key];
                if (key.substr(0, 8) === 'Articulo') {
                    var articulo = preventamobile.dal().obtenerArticulo(key.substr(11, 8));
                    var posi2 = articulo.numero.indexOf(strCadena);
                    if (posi3 >= 0) {
                        if (posi2 >= 0) {
                            lista[listaIndex] = JSON.parse(value);
                            listaIndex++;
                        }

                    } else {
                        if (articulo.numero == strCadena) {
                            lista[listaIndex] = JSON.parse(value);
                            listaIndex++;
                        }
                    }
                }
            }
        }

        return lista;
    };

    //#endregion

    //#region Proveedores

    guardarProveedoresEnStorage = function (proveedores) {
        eliminarLista("Proveedor");
        // Los datos deben encontrarse ordenados para su correcta presentacion
        $.each(proveedores, function (index, value) {
            localStorage.setItem("Proveedor - " + value.idproveedor.trim(), preventamobile.util().serializar(value));
        });
    };

    obtenerProveedor = function (idproveedor) {

        var proveedor = localStorage.getItem("Proveedor - " + idproveedor);
        if (proveedor) {
            return JSON.parse(proveedor);
        }
        return false;
    };

    //#endregion

    //#region Secciones

    syncSecciones = function () {

        preventamobile.util().log("Inicio syncSecciones");

        // Secciones individuales
        $.ajax({
            url: preventamobile.configuration().getUrlBase() + "secciones",
            beforeSend: function (xhr) { preventamobile.util().setAuthorizationHeader(xhr, preventamobile.dal().getLoginInfo()); },
            type: 'GET',
            cache: false,
            async: false,
            success: function (secciones) {
                var data = JSON.parse(secciones);
                if (data && data.length > 0) {
                    guardarSeccionesEnStorage(data);
                }

                preventamobile.util().log("Fin syncSecciones");
            }
        }).error(function (data) {
            throw new Error("No se pudo completar la operación: " + data.status + " - " + data.statusText);
        });
    };

    guardarSeccionesEnStorage = function (secciones) {
        eliminarLista("Seccion");
        // Los datos deben encontrarse ordenados para su correcta presentacion
        $.each(secciones, function (index, value) {
            localStorage.setItem("Seccion - " + value.id.trim(), preventamobile.util().serializar(value));
        });
    };

    obtenerSeccion = function (id) {

        var seccion = localStorage.getItem("Seccion - " + id.trim());
        if (seccion) {
            return JSON.parse(seccion);
        }
        return false;
    };

    seccionesLista = function () {
        return obtenerLista("Seccion");
    };

    //#endregion

    //#region NoVenta

    // TODO: revisar pero creo que no se usa mas
    syncNoVenta = function () {

        // NoVenta individuales
        var noVenta = getNoVentaFromExternalDb();
        $.each(noVenta, function (index, value) {
            localStorage.setItem("NoVenta - " + value.Codigo, preventamobile.util().serializar(value));
        });

    };

    // TODO: revisar pero creo que no se usa mas
    getNoVentaFromExternalDb = function () {
        // TODO: tomar desde servicios
        // Los datos deben encontrarse ordenados para su correcta presentacion
        return [{ "Id": "1", "Descripcion": "Cerrado", "Codigo": "1" },
        { "Id": "2", "Descripcion": "Sin dinero", "Codigo": "2" },
        { "Id": "3", "Descripcion": "No quiso comprar", "Codigo": "3" },
        { "Id": "4", "Descripcion": "Malos precios", "Codigo": "4" },
        { "Id": "5", "Descripcion": "Vacaciones", "Codigo": "5" },
        { "Id": "6", "Descripcion": "No Encontrado", "Codigo": "6" }];
    };

    // TODO: revisar pero creo que no se usa mas
    obtenerNoVenta = function (codigo) {
        var noVenta = localStorage.getItem("NoVenta - " + codigo);
        if (noVenta) {
            return JSON.parse(noVenta);
        }
        return false;
    };

    // TODO: revisar pero creo que no se usa mas
    noVentaLista = function () {
        return obtenerLista("NoVenta");
    };

    establecerNoVenta = function (codigoCliente, fecha, hora, chksum, idPedido) {

        var clienteNoVenta = obtenerCliente(codigoCliente);

        if (!clienteNoVenta)
            throw "Establecer No Venta - No se encontró el cliente " + codigoCliente;

        clienteNoVenta.noVenta = { chksum: chksum, fecha: fecha, hora: hora, idPedido: idPedido };

        localStorage.setItem("Cliente - " + codigoCliente.trim(), preventamobile.util().serializar(clienteNoVenta));

    };

    establecerTienePedido = function (codigoCliente, tienePedido) {

        var clienteTienePedido = obtenerCliente(codigoCliente);

        if (clienteTienePedido) {
            clienteTienePedido.tienePedido = tienePedido;
            localStorage.setItem("Cliente - " + codigoCliente.trim(), preventamobile.util().serializar(clienteTienePedido));
        }

    };

    //#endregion

    //#region Pedidos
	

	
    function marcarClientesComoSincronizados(pedidos) {
        $.each(pedidos, function (index, value) {
            marcarClienteParaSincronizar(value.codigoCliente, false);
        });
    }

    trakingOk = function () { }
    trakingError = function (errorMessage) { }

    syncTrackingConServidor = function (model) {

        $.ajax({
            url: preventamobile.configuration().getUrlBase() + "tracking",
            type: 'POST',
            cache: false,
            async: true,
            data: model,

            success: function (data) {

                var respuesta = JSON.parse(data);

                if (respuesta && respuesta.ok) {

                    if (trakingOk) {
                        trakingOk();
                    }
                }

            }
        }).error(function (data) {
            var errorMessage = "No se pudo completar la operación: " + data.status + " - " + data.statusText;
            //alert(errorMessage)
            //if (errorCallback) {
            //    errorCallback(errorMessage);
            //} else {
            //    throw new Error(errorMessage);
            // }
        });
        // }, .5);
    };


    syncTracking = function (objTracking) {

        if (preventamobile.dal().getTracking() != 1) { return };

        var tracking = objTracking;

        if (tracking && tracking.length && tracking.length > 0) {

            var model = {
                data: preventamobile.util().serializar(preventamobile.util().comprimir(tracking)),
                login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo())
            };

            syncTrackingConServidor(model);

        }
    };



    syncPedidosOneForOne = function () {

        var message = '';
		var messageErrorPedido = '';
		
        preventamobile.util().log("Inicio syncPedidos");
		
		var ClientesLista = clientesLista();
		
		//alert(ClientesLista[0].numero);
		var hayPedido = false;
		
		for (var i = 0; i < ClientesLista.length; i++) {
						
				var pedidos = listarPedidos(ClientesLista[i].numero);
				
				if ((pedidos && pedidos.length && pedidos.length > 0)) {
					hayPedido = true;
					console.log('SyncPedido Cliente ' + ClientesLista[i].numero);
					var model = {
						data: preventamobile.util().serializar(preventamobile.util().comprimir(pedidos)),
						login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo())
					};

					var ok = syncPedidosConServidor(
						model,
						marcarClientesComoSincronizados(pedidos),
						false,
						'Pedido del ' + ClientesLista[i].numero +'  ',true)
					
					if (ok == false) {
						messageErrorPedido = messageErrorPedido + 'Error Cliente  ' + ClientesLista[i].numero + '   '
						
					}
					//preventamobile.util().log('syncPedidos OK - Pedidos ' + ClientesLista[i].numero);
					

				} 
				
				message = message + "Fin syncPedidosOneForOne";
				
			};			
		
		
		//console.log(hayPedido);	
			
        var noventa = listarNoVenta();
        var cuentaCorriente = listarCuentaCorriente();
		
		
        if ( (noventa && noventa.length && noventa.length > 0) || (cuentaCorriente && cuentaCorriente.length && cuentaCorriente.length > 0)) {
			
			 var model = {
				noventa: preventamobile.util().serializar(noventa),
                cuentaCorriente: preventamobile.util().serializar(cuentaCorriente),
                login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo())
            };
			 syncPedidosConServidor(
                model,
                marcarClientesComoSincronizados(pedidos));
				
			preventamobile.util().log('syncPedidos OK - Cobros/No Ventas');
			
            message = "Fin syncPedidosOneForOne";

        } else {
			if (hayPedido == false) {
				message = "No hay informacion para sincronizar";
			}else{
				message = "Se sincronozaron pedidos";
			}
        }
        
        preventamobile.util().log(message + '  ' + messageErrorPedido);
        
		if (messageErrorPedido.length > 0){
			alert(messageErrorPedido);
		}
        return message;

    };
	
	syncPedidos = function () {

        var message = '';
        preventamobile.util().log("Inicio syncPedidos");

        var pedidos = listarPedidos();
        var noventa = listarNoVenta();
        var cuentaCorriente = listarCuentaCorriente();

        if ((pedidos && pedidos.length && pedidos.length > 0) || (noventa && noventa.length && noventa.length > 0) || (cuentaCorriente && cuentaCorriente.length && cuentaCorriente.length > 0)) {

            var model = {
                data: preventamobile.util().serializar(preventamobile.util().comprimir(pedidos)),
                noventa: preventamobile.util().serializar(noventa),
                cuentaCorriente: preventamobile.util().serializar(cuentaCorriente),
                login: preventamobile.util().serializar(preventamobile.dal().getLoginInfo())
            };

            syncPedidosConServidor(
                model,
                marcarClientesComoSincronizados(pedidos));

            message = "Fin syncPedidos";

        } else {
            message = "No hay informacion para sincronizar";
        }
        
        preventamobile.util().log(message);
        
        return message;

    };

    syncPedidosConServidor = function (model, sucessCallback, errorCallback, message, errorContinue) {
		var ok = true;
		
        $.ajax({
            url: preventamobile.configuration().getUrlBase() + "pedidos",
            type: 'POST',
            cache: false,
            async: false,
            data: model,

            success: function (data) {

                var respuesta = JSON.parse(data);

                if (respuesta && respuesta.ok) {

                    if (sucessCallback) {
                        sucessCallback();
                    }
                }
			
            }
			
			
        }).error(function (data) {
			
			var errorMessage =  "No se pudo completar la operación: " + data.status + " - " + data.statusText;
			if (message){
				errorMessage = message.trim()+ '   ' + errorMessage ;
			}
			
            
            if (errorCallback) {
                errorCallback(errorMessage);
            } else {
				if (errorContinue == false){
					  throw new Error(errorMessage);
				}else{
					ok =  false;
				}
            
            }
        });
		return ok
        // }, .5);
    };

    obtenerPedido = function (id) {

        var pedido = localStorage.getItem("Pedido - " + id);

        if (pedido) {
            pedido = JSON.parse(pedido);
        } else {
            var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
			var porcePerceCliente = preventamobile.ui.listaPedidos().obtenerPerceClienteSeleccionado(codigoCliente);
			console.log('Perce IIBB ',porcePerceCliente);
            pedido = preventamobile.dal().factory().pedido(codigoCliente, id, porcePerceCliente);
        }

        return pedido;

    };

    esPedidoRentable = function (pedido) {

        if (!pedido.costoProveedor)
            return true;

        var rentable = true;

        $.each(pedido.costoProveedor,
            function (index, value) {

                if (!value.esRentable) {
                    rentable = false;
                    return false;
                }

                return true;
            });

        return rentable;

    }

    detallePedidoNoRentable = function (pedido) {

        if (!pedido.costoProveedor)
            return "";

        var detalle = "";

        $.each(pedido.costoProveedor,
            function (index, value) {

                if (!value.esRentable) {

                    if (detalle !== "")
                        detalle += " / ";
                    detalle += value.nombre;
                }
            });

        if (detalle !== "")
            detalle = "Pedido NO rentable para: " + detalle;

        return detalle;

    }


    guardarPedido = function (pedido) {

        calcularTotal(pedido);

        localStorage.setItem("Pedido - " + pedido.pedidoId, preventamobile.util().serializar(pedido));
        establecerTienePedido(pedido.codigoCliente, true);
        marcarClienteParaSincronizar(pedido.codigoCliente, true);

        return pedido.pedidoId;
    };

    guardarNoVenta = function () { };

    calcularLineaTotal = function (linea) {
        var totalLinea = 0;
        if (linea && linea.precio) {

            var cantidad = linea.cantidad;
            var univenta = linea.univenta ? parseInt(linea.univenta, 10) : 0;
            var unibulto = linea.unibulto ? parseInt(linea.unibulto, 10) : 0;
            var precio = linea.precio ? parseFloat(linea.precio) : 0;
            var bonif1 = linea.bonif1 ? parseFloat(linea.bonif1, 10) : 0;
            var bonif2 = linea.bonif2 ? parseFloat(linea.bonif2, 10) : 0;
            var peso = linea.peso ? parseFloat(linea.peso) : 1;
			var kilos = 0;
            if (peso == 0) { peso = 1 };
            var sikilos = linea.sikilos;
			if (sikilos == 'N'){
				if (univenta) {
					cantidad = cantidad * unibulto;
				};
				kilos = peso;
			}else{
				kilos = linea.kilos ;
				cantidad = 1;
			}
            
            var subTotal = cantidad * precio * kilos;
			//console.log('SubTotal Linea',subTotal);
            var importeBonif1 = (subTotal * bonif1) / 100;
			//console.log('Total Bonif',importeBonif1);
            var importeBonif2 = ((subTotal - importeBonif1) * bonif2) / 100;
            totalLinea = (subTotal - importeBonif1 - importeBonif2);
			//console.log('Total Linea',totalLinea);
            totalLinea = parseInt((totalLinea + 0.005) * 100) / 100;
			//totalLinea = parseFloat(totalLinea).toFixed(2);
			
					
        }
        return totalLinea;

    };

    calcularTotal = function (pedido) {

        if (pedido) {

            pedido.total = 0;
            pedido.costoProveedor = {};
			pedido.totalNeto = 0;
			pedido.bonifpedido = '';
			
			
			
			var porcePerce = pedido.porcePerce ? parseFloat(pedido.porcePerce,10) :0;
			
			if (pedido.remito != 0){
				porcePerce = 0;	
			}
			
			
			var SubPerce,SubBonif;
			
			SubPerce,SubBonif = 0;
			
			//console.log('----------Calcular Total ------------')
            for (var lineaId in pedido.lineas) {
                var linea = pedido.lineas[lineaId];
                if (linea && linea.precio) {

                    var cantidad = linea.cantidad;
                    var univenta = linea.univenta ? parseInt(linea.univenta, 10) : 0;
                    var unibulto = linea.unibulto ? parseInt(linea.unibulto, 10) : 0;
                    var precio = linea.precio ? parseFloat(linea.precio) : 0;
					var neto = linea.neto ? parseFloat(linea.neto) : 0;
                    var costo = linea.costo ? parseFloat(linea.costo) : 0;
                    var bonif1 = linea.bonif1 ? parseFloat(linea.bonif1, 10) : 0;
                    var bonif2 = linea.bonif2 ? parseFloat(linea.bonif2, 10) : 0;
                    var peso = linea.peso ? parseFloat(linea.peso) : 1;
					
					var kilos = 1;
                    if (peso == 0) { peso = 1 };
                    var sikilos = linea.sikilos;
					if (sikilos == 'N'){
						if (univenta) {
							cantidad = cantidad * unibulto;
						};
						kilos = peso;
					}else{
						kilos = linea.kilos ;
						cantidad = 1;
						
					}
                    var subTotal = cantidad * precio * kilos;
					//console.log('Subtotal ' + subTotal)
                    var subTotalCosto = cantidad * costo * kilos;
                    var importeBonif1 = ((subTotal * bonif1) / 100).toFixed(2);
					//console.log('Total Bonif '+ importeBonif1)
                    var importeBonif2 = (((subTotal - importeBonif1) * bonif2) / 100).toFixed(2);
					// Totales del neto
					var subTotalNeto = cantidad * neto * kilos;
					var netoBonif1	 = ((subTotalNeto * bonif1) / 100).toFixed(2);
					var netoBonif2	 = (((subTotalNeto - netoBonif1) * bonif2) / 100).toFixed(2);
					
					SubBonif = (parseFloat(SubBonif) + parseFloat(importeBonif1));
					//console.log('Total Bonif '+ SubBonif);
					
                    var costoProveedor;
                    if (!pedido.costoProveedor[linea.idproveedor]) {
                        var proveedor = obtenerProveedor(linea.idproveedor);

                        if (!proveedor)
                            costoProveedor = { costo: 0, total: 0, idproveedor: linea.idproveedor, nombre: "Sin datos " + linea.idproveedor, coeficienteRentabilidad: 0, esRentable: true };
                        else
                            costoProveedor = { costo: 0, total: 0, idproveedor: linea.idproveedor, nombre: proveedor.nombre, coeficienteRentabilidad: proveedor.coeficienterentabilidad, esRentable: true };
                    } else {
                        costoProveedor = pedido.costoProveedor[linea.idproveedor];
                    }

                    costoProveedor.costo += subTotalCosto;
                    costoProveedor.total += subTotal;
					
					
                    pedido.total += (subTotal - importeBonif1 - importeBonif2);
                    pedido.total = parseInt((pedido.total + 0.005) * 100) / 100;
					console.log('Total Pedido ' + pedido.total)
					//Total neto
					pedido.totalNeto += (subTotalNeto - netoBonif1 - netoBonif2);
					pedido.totalNeto = parseInt((pedido.totalNeto + 0.005) *100) / 100;
					
                    pedido.costoProveedor[linea.idproveedor] = costoProveedor;
					
					
					
                }

            }
			//Bonificaciones
			pedido.bonifpedido = SubBonif;
			pedido.bonifpedido = parseFloat(pedido.bonifpedido).toFixed(2);
			
					
			//pedido.bonifpedido = importeBonif1;
			
			//console.log('pedido.totalNeto ' + pedido.totalNeto);
			//console.log('perce: ' + parseFloat(porcePerce));
			//Almacenamos el total de la percepcion
			pedido.perceiibb = ((pedido.totalNeto * porcePerce) / 100).toFixed(3);
			pedido.total += parseInt(pedido.perceiibb);
			
            $.each(pedido.costoProveedor,
                function (index, value) {

                    value.esRentable = ((value.total / value.costo) - 1) * 100 > value.coeficienteRentabilidad;
                });

            return pedido;

        }

    };

    eliminarPedido = function (pedidoId) {
        localStorage.removeItem("Pedido - " + pedidoId);
    };

    eliminarPedidos = function () {
        eliminarLista("Pedido");
    };

    borrarPedidos = function () {

        eliminarPedidos();

        var clientes = preventamobile.dal().clientesLista();

        $.each(clientes, function (index, value) {
            var numero = value.numero;
            establecerTienePedido(numero, false);
            var clienteNoVenta = obtenerCliente(numero);
            clienteNoVenta.noVenta = null;
            localStorage.setItem("Cliente - " + numero.trim(), preventamobile.util().serializar(clienteNoVenta));
        });
        preventamobile.util().showDialog("<h1>Pedidos Eliminados</h1>");

    };

    listarPedidos = function (codigoCliente, lineasParaSync) {

        var lista = [];

        // Ciclar las keys de localStorage y devolver las que comienzan con Pedido y pertenecen al cliente especificado
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var index = 0; index < localStorage.length; index++) {
                var key = localStorage.key(index);
                var value = localStorage[key];
                if (value !== 'undefined') {

                    if (key.substr(0, 6) === 'Pedido') {
                        var pedido = JSON.parse(value);
                        if (codigoCliente) {
                            if (pedido && pedido.codigoCliente && pedido.codigoCliente.trim() === codigoCliente.trim()) {
                                lista[listaIndex] = pedido;
                                listaIndex++;
                            }
                        } else {
                            lista[listaIndex] = pedido;
                            listaIndex++;
                        }
                    }
                }
            }
        }

        sort(lista, 'codigoCliente', 1);

        return lista;
    };

    listarNoVenta = function () {

        var lista = [];

        // Ciclar las keys de localStorage y devolver las que comienzan con Cliente y tienen noVenta
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var index = 0; index < localStorage.length; index++) {
                var key = localStorage.key(index);
                var value = localStorage[key];
                if (value !== 'undefined') {

                    if (key.substr(0, 7) === 'Cliente') {
                        var cliente = JSON.parse(value);
                        if (cliente.noVenta) {
                            lista[listaIndex] = { Id: cliente.numero, chksum: cliente.noVenta.chksum, fecha: cliente.noVenta.fecha, hora: cliente.noVenta.hora, idPedido: cliente.noVenta.idPedido };
                            listaIndex++;
                        }
                    }
                }
            }
        }

        return lista;
    };

    listarCuentaCorriente = function () {

        var lista = [];

        // Ciclar las keys de localStorage y devolver las que comienzan con Cliente
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var index = 0; index < localStorage.length; index++) {
                var key = localStorage.key(index);
                var value = localStorage[key];
                if (value !== 'undefined') {
                    if (key.substr(0, 7) === 'Cliente') {
                        var cliente = JSON.parse(value);
                        if (cliente.cuentaCorriente) {
                            for (var j = 0; j < cliente.cuentaCorriente.length; j++) {
                                lista[listaIndex] = cliente.cuentaCorriente[j];
                                listaIndex++;
                            }
                        }
                    }
                }
            }
        }

        return lista;
    };
    //#endregion

    //#region Lineas de Pedido

    guardarPedidoLinea = function (pedidoId, lineaPedido) {

        var pedido = obtenerPedido(pedidoId);

        pedido.lineas[lineaPedido.lineaId] = lineaPedido;

        guardarPedido(pedido);

    };

    eliminarPedidoLinea = function (pedidoId, lineaId) {

        var pedido = obtenerPedido(pedidoId);

        delete pedido.lineas[lineaId];

        guardarPedido(pedido);

    };

    obtenerPedidoLinea = function (pedidoId, lineaId) {
        var pedido = obtenerPedido(pedidoId);
        var linea = pedido.lineas[lineaId];
        return linea;
    };

    listarPedidoLineas = function (pedidoId) {

        var i = 0;

        var lista = [];

        var pedido = obtenerPedido(pedidoId);

        for (var lineaId in pedido.lineas) {
            lista[i] = pedido.lineas[lineaId];
            i++;
        }

        return lista;
    };

    listarPedidoLineasPorArticulo = function (pedidoId, idarticulo) {

        var i = 0,
            totalArticulos = 0;

        var lista = [];

        var pedido = obtenerPedido(pedidoId);

        for (var linea in pedido.lineas) {
            if (linea.idarticulo && linea.idarticulo == idarticulo) {
                totalArticulos += linea.cantidad;
                lista[i] = linea;
                i++;
            }

        }

        return { total: totalArticulos, lineas: lista };
    };

    //#endregion

    //#region Lineas de Variedad

    guardarLineaVariedad = function (pedidoId, lineaId, lineaVariedad) {

        var pedidoLinea = obtenerPedidoLinea(pedidoId, lineaId);

        if (!pedidoLinea) {
            return;
        }

        pedidoLinea.variedades[lineaVariedad.lineaVariedadId] = lineaVariedad;

        recalcularTotalesLinea(pedidoLinea);

        guardarPedidoLinea(pedidoId, pedidoLinea);

    };

    recalcularTotalesLinea = function (pedidoLinea) {
        var cantidadLinea = 0;
        for (var lineaVariedadId in pedidoLinea.variedades) {
            var lineaVariedad = pedidoLinea.variedades[lineaVariedadId];
            cantidadLinea += parseInt(lineaVariedad.cantidad);
        }
        pedidoLinea.cantidad = cantidadLinea;
    };

    eliminarLineaVariedad = function (pedidoId, lineaId, lineaVariedadId) {

        var pedidoLinea = obtenerPedidoLinea(pedidoId, lineaId);

        if (!pedidoLinea) {
            return;
        }

        delete pedidoLinea.variedades[lineaVariedadId];

        guardarPedidoLinea(pedidoId, pedidoLinea);

    };

    listarLineaVariedad = function (pedidoId, lineaId) {

        var i = 0;

        var lista = [];

        var pedidoLinea = obtenerPedidoLinea(pedidoId, lineaId);

        for (var variedad in pedidoLinea.variedades) {
            lista[i] = variedad;
            i++;
        }

        return lista;
    };

    //#endregion

    //#region Tipo Pedido

    getTipoPedidoFromExternalDb = function () {
        return [{ "Id": "1", "Descripcion": "Normal", "Codigo": "1" },
        { "Id": "2", "Descripcion": "Diferido", "Codigo": "2" },
        { "Id": "3", "Descripcion": "Anterior", "Codigo": "3" },
        { "Id": "4", "Descripcion": "No Encontrado", "Codigo": "4" },
		{ "Id": "5", "Descripcion": "Credito", "Codigo": "5" }
		];
    };

    syncTipoPedido = function () {

        // NoVenta individuales
        var tipoDePedido = getTipoPedidoFromExternalDb();
        $.each(tipoDePedido, function (index, value) {
            localStorage.setItem("TipoPedido - " + value.Codigo, preventamobile.util().serializar(value));
        });

    };

    obtenerTipoPedido = function (codigo) {
		console.log("Tipo de Pedido -" + codigo);
        var tipoDePedido = localStorage.getItem("TipoPedido - " + codigo);
        if (tipoDePedido) {
            return JSON.parse(tipoDePedido);
        }
        return false;
    };

    //#endregion

    //#region factory

    factory = function () {

        var lineaPedido,
            lineaPedidoDesdeCargaRapida,
            pedido,
            lineaVariedad;

        pedido = function (codigoCliente, pedidoId ,porcePerceCliente) {
			
			console.log('Perce IIBB ',porcePerceCliente);
			
            var f = new Date();
            var dia = moment(f).format('DD/MM/YYYY');
            var hora = preventamobile.util().strZ(f.getHours()) + ":" + preventamobile.util().strZ(f.getMinutes()) + ":" + preventamobile.util().strZ(f.getSeconds());

            if (!pedidoId && pedidoId == '')
                pedidoId = preventamobile.util().generateUUID();

            return {
                pedidoId: pedidoId, // es el id de la base de datos
                codigoCliente: codigoCliente,
                fecha: dia,
                horaIn: hora,
                horaOut: "",
                chksum: "",
                vales: 0,
                remito: 0,
                bonificaciones: 0,
                observaciones: "",
                fechaEntrega: dia,
                tipoDePedido: 1,
                total: "",
                lineas: {},
                costoProveedor: {},
				pagoEfectivo: "",
				pagoCheque: "",
				pagoTransferencia: "",
				totalNeto: "",
				perceiibb: "",
				porcePerce: porcePerceCliente,
				bonifpedido: "",
				impreso: 0,
				siBonificar: true
            };
        };

        lineaPedidoDesdeCargaRapida = function (idArticulo, cantidad) {

            var linea = lineaPedido();

            linea.idarticulo = idArticulo;
            linea.cantidad = cantidad;

            return linea;
        };

        // Utilizar este metodo para obtener nuevas lineas de pedido, de manera que nos aseguramos que en todas partes se usa la misma estructura de datos
        lineaPedido = function () {
            return {
                lineaId: preventamobile.util().generateUUID(),    // es el id de la base de datos
                idarticulo: 0,
                codigoArticulo: 0,  // es el campo numero de la tabla articulo
                cantidad: 0,
                precio: 0,
                univenta: 0,
                unibulto: 0,
                bonif1: 0,
                bonif2: 0,
                peso: 1,
                sikilos: 'N',
                variedades: {},
				kilos: 0,
				neto: 0,
				estopebonif: '1',
				porceMerma: 0,
				boniftope:0

            };
        };

        lineaVariedad = function () {
            return {
                idarticulo: 0,
                idvariedad: 0,
                cantidad: 0,
                lineaVariedadId: preventamobile.util().generateUUID(),    // es el id de la base de datos
            };
        };

        return {
            pedido: pedido,
            lineaPedido: lineaPedido,
            lineaPedidoDesdeCargaRapida: lineaPedidoDesdeCargaRapida,
            lineaVariedad: lineaVariedad
        };
    };

    //#endregion

    //#region Util

    obtenerLista = function (entidad) {
        var lista = [];

        // Ciclar las keys de localStorage y devolver las que comienzan con el valor especificado en la entidad
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.substr(0, entidad.length) === entidad) {
                    var value = JSON.parse(localStorage[key]);
                    if (value) {
                        lista[listaIndex] = value;
                        listaIndex++;
                    }
                }
            }
        }

        return lista;
    };

    eliminarLista = function (entidad) {

        var lista = [];

        // Ciclar las keys de localStorage y eliminar las que comienzan con el valor especificado en la entidad
        if (localStorage && localStorage.length > 0) {
            var listaIndex = 0;
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.substr(0, entidad.length) === entidad) {
                    lista[listaIndex] = key;
                    listaIndex++;
                }
            }

            if (lista.length > 0)
                for (var j = 0; j < lista.length; j++) {
                    localStorage.removeItem(lista[j]);
                }
        }

    };

    guardarLista = function (entidad, lista) {
        if (lista && lista.length > 0)
            for (var i = 0; i < lista.length; i++) {
                localStorage.setItem(entidad + " - " + lista[i].numero.trim(), preventamobile.util().serializar(lista[i]));
            }
    };

    sort = function (objArray, prop, direction) {
        if (arguments.length < 2) throw new Error("sortJsonArrayByProp requires 2 arguments");
        var direct = arguments.length > 2 ? direction : 1; //Default to ascending

        if (objArray && objArray.constructor === Array) {
            var propPath = (prop.constructor === Array) ? prop : prop.split(".");
            objArray.sort(function (a, b) {
                for (var p in propPath) {
                    if (a[propPath[p]] && b[propPath[p]]) {
                        a = a[propPath[p]];
                        b = b[propPath[p]];
                    }
                }
                // convert numeric strings to integers
                a = a.match(/^\d+$/) ? +a : a;
                b = b.match(/^\d+$/) ? +b : b;
                return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
            });
        }
    };

    //#endregion

    //#region Return

    return {
        clientesLista: clientesLista,
        clientesFueraRutaLista: clientesFueraRutaLista,
        obtenerCliente: obtenerCliente,
        obtenerCuentaCorriente: obtenerCuentaCorriente,
        obtenerClienteFueraRuta: obtenerClienteFueraRuta,
        guardarClienteEnStorage: guardarClienteEnStorage,
        guardarCuentaCorrienteEnStorage: guardarCuentaCorrienteEnStorage,
        removerClienteFueraRutaEnStorage: removerClienteFueraRutaEnStorage,
        marcarClienteParaSincronizar: marcarClienteParaSincronizar,
		actualizarClientesEstados: actualizarClientesEstados,
		
        getUrlServer: getUrlServer,
        setUrlServer: setUrlServer,

        getNombreEmpresa: getNombreEmpresa,
        getEmpresa: getEmpresa,
        getDecimales: getDecimales,
        getTracking: getTracking,
        setTitle: setTitle,

        articulosLista: articulosLista,
        articulosSeccionLista: articulosSeccionLista,
        articulosBuscar: articulosBuscar,
        articulosBuscarCodigo: articulosBuscarCodigo,
        obtenerArticulo: obtenerArticulo,

        obtenerProveedor: obtenerProveedor,
        guardarProveedoresEnStorage: guardarProveedoresEnStorage,

        guardarSeccionesEnStorage: guardarSeccionesEnStorage,
        seccionesLista: seccionesLista,
        obtenerSeccion: obtenerSeccion,

        noVentaLista: noVentaLista,
        obtenerNoVenta: obtenerNoVenta,
        establecerNoVenta: establecerNoVenta,
        listarNoVenta: listarNoVenta,
        guardarNoVenta: guardarNoVenta,

        establecerTienePedido: establecerTienePedido,
        obtenerPedido: obtenerPedido,
        obtenerPedidoLinea: obtenerPedidoLinea,
        guardarPedido: guardarPedido,
        eliminarPedido: eliminarPedido,
        eliminarPedidos: eliminarPedidos,
        borrarPedidos: borrarPedidos,
        listarPedidos: listarPedidos,
        esPedidoRentable: esPedidoRentable,
        detallePedidoNoRentable: detallePedidoNoRentable,
        calcularTotal: calcularTotal,
		generarListPedido:generarListPedido,
		
        guardarPedidoLinea: guardarPedidoLinea,
        eliminarPedidoLinea: eliminarPedidoLinea,
        listarPedidoLineas: listarPedidoLineas,
        listarPedidoLineasPorArticulo: listarPedidoLineasPorArticulo,

        guardarLineaVariedad: guardarLineaVariedad,
        eliminarLineaVariedad: eliminarLineaVariedad,
        listarLineaVariedad: listarLineaVariedad,

        sync: sync,
        syncTipoPedido: syncTipoPedido,
        syncNoVenta: syncNoVenta,
        syncPedidos: syncPedidos,
        syncPedidosConServidor: syncPedidosConServidor,
        syncClientes: syncClientes,
        eliminarClientes: eliminarClientes,
        syncArticulos: syncArticulos,
        syncSecciones: syncSecciones,
        syncTracking: syncTracking,
        syncTrackingConServidor: syncTrackingConServidor,

        obtenerTipoPedido: obtenerTipoPedido,

        getLoginInfo: getLoginInfo,
        setLoginInfo: setLoginInfo,
        calcularLineaTotal: calcularLineaTotal,
        agregarLog: agregarLog,
        obtenerLog: obtenerLog,
        limpiarLog: limpiarLog,
        serverInfo: serverInfo,
        serverVersion: serverVersion,

        sort: sort,
        clearData: clearData,
        factory: factory

    };

    //#endregion
};

//@ sourceURL=_dal.js