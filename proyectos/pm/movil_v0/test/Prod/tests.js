QUnit.test("NO es pedido rentable", function (assert) {

    //Arrange
    cleanLocalStorage();
    localStorage.setItem("urlServer", "http://localhost:8082/preventamobile/");  // Url
    localStorage.setItem("opcionSync", 1);  // Sync de Clientes
    var filtro = { dia: 2, username: "10", clave: "410" };
    var done = assert.async();
    var error = preventamobile.dal().sync({ filtro: filtro });


    setTimeout(function () {

        var cliente = preventamobile.dal().obtenerCliente("10303");
        var pedido = preventamobile.dal().factory().pedido(cliente.numero);
        var pedidoId = preventamobile.dal().guardarPedido(pedido); // guardar pedido por primera vez para luego poder agregar las lineas

        var articulo = preventamobile.dal().obtenerArticulo("3436");   // Articulo con Proveedor con coeficiente rentabilidad al 50
        var lineaPedido = preventamobile.dal().factory().lineaPedidoDesdeCargaRapida(articulo.id, 5);

        // Esta informacion se setea en la edicion, por eso lo agrego aqui manualmente
        lineaPedido.precio = articulo.preventa1;
        lineaPedido.costo = articulo.costo;
        lineaPedido.idproveedor = articulo.idproveedor;

        preventamobile.dal().guardarPedidoLinea(pedidoId, lineaPedido);

        //Act
        var pedidoActualizado = preventamobile.dal().obtenerPedido(pedidoId);

        //Assert
        assert.ok(error === '', "Sync OK");
        console.log("Datos del pedido actualizado:");
        console.log(pedidoActualizado);
        console.log("Datos de costo proveedor");
        console.log(pedidoActualizado.costoProveedor);
        assert.ok(pedidoActualizado.total > 0, "Total pedido > 0");
        assert.ok(preventamobile.dal().esPedidoRentable(pedidoActualizado) === false, "NO Es pedido rentable");
        assert.ok(preventamobile.dal().detallePedidoNoRentable(pedidoActualizado) !== "", "Detalle pedido NO rentable: " + preventamobile.dal().detallePedidoNoRentable(pedidoActualizado));
        done();

    });

});


function cleanLocalStorage() {
    localStorage.clear();
}