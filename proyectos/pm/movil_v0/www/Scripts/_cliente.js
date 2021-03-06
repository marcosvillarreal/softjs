﻿var preventamobile = preventamobile || {};

preventamobile.ui = preventamobile.ui || {};

preventamobile.ui.cliente = function () {

    var render,
        renderFueraRuta,
        renderClientesDetalle,
        renderinfoPedidosPage,
        linkDestino,
        detallesCliente,
        agregarCliente,
        afectar;

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
        var clientes = preventamobile.dal().clientesLista();

        $.each(clientes, function (index, value) {
            var codigo = value.numero.trim();

            var cliente = preventamobile.dal().obtenerCliente(codigo);

            if (cliente) {
                ++a0;
                if (cliente.tienePedido) { ++a1 };
                if (cliente.noVenta) { ++a2 };
                if (!cliente.noVenta && !cliente.tienePedido) { ++a3 };
            };

        });

        $('#A0').text(a0);
        $('#A1').text(a1);
        $('#A2').text(a2);
        $('#A3').text(a3);

        // Calcular total de pedidos

        var empresa = preventamobile.dal().getEmpresa();

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

        $('#A4').text(totalPedidos);

        if (cantidadPedidos > 0)
            $('#A5').text(totalPedidos / cantidadPedidos);
        else
            $('#A5').text(0);

        $('#A6').text(empresa.coeficienterentabilidad);

        // Calcular promedio de pedidos

        //  $("#infoPedidosPage").html().trigger('create');
    };

    renderFueraRuta = function () {
        var clientes = preventamobile.dal().clientesFueraRutaLista();
        $("#clientesFueraRutaContent").html($.templates("#clienteFueraRutaListaTmpl").render({ clientes: clientes })).trigger('create');
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

    linkDestino = function () {
        var codigoCliente = preventamobile.ui.listaPedidos().obtenerIdClienteSeleccionado();
        var listaPedidos = preventamobile.dal().listarPedidos(codigoCliente);
        // Si no hay pedidos los mando directo a NUEVO
        if (listaPedidos.length == 0) {
            preventamobile.ui.listaPedidos().pedidoNuevo();
        } else {
            $.mobile.changePage('#listaPedidosPage');
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
        afectar: afectar
    };
};

//@ sourceURL=_cliente.js