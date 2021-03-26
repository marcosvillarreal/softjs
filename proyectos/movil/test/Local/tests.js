// QUnit.test("can create pedido ok", function (assert) {

//     // Arrange
//     cleanLocalStorage();

//     // Act
//     var pedido = preventamobile.dal().factory().pedido(1);

//     // Assert
//     assert.ok(typeof pedido !== 'undefined', "Pedido inicializado");
//     assert.ok(typeof pedido.pedidoId !== 'undefined', "pedidoId inicializado: " + pedido.pedidoId);

// });

// QUnit.test("sync clientes ok", function (assert) {

//     // Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();

//     // Act
//     var error = preventamobile.dal().sync({ filtro: filtro });

//     // Assert
//     setTimeout(function () {

//         var listaClientes = preventamobile.dal().clientesLista();
//         assert.ok(error === '', "Sync sin errores");
//         assert.ok(listaClientes.length > 0, "Clientes sincronizados");
//         done();

//     });

// });

// QUnit.test("obtener proveedor ok", function (assert) {

//     // Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();
//     var error = preventamobile.dal().sync({ filtro: filtro });

//     setTimeout(function () {

//         // Act
//         var proveedor = preventamobile.dal().obtenerProveedor("1100003552");

//         // Assert
//         assert.ok(error === '', "Sync OK");
//         assert.ok(proveedor.idproveedor === '1100003552', "Proveedor encontrado");
//         done();

//     });

// });

// QUnit.test("obtener articulo ok", function (assert) {

//     // Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();
//     var error = preventamobile.dal().sync({ filtro: filtro });

//     setTimeout(function () {

//         // Act
//         var articulo = preventamobile.dal().obtenerArticulo("10101");

//         // Assert
//         assert.ok(error === '', "Sync OK");
//         assert.ok(articulo.id === '10101', "Articulo encontrado");
//         done();

//     });

// });


// QUnit.test("obtener cliente ok", function (assert) {

//     // Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();
//     var error = preventamobile.dal().sync({ filtro: filtro });

//     setTimeout(function () {

//         // Act
//         var cliente = preventamobile.dal().obtenerCliente("1227");

//         // Assert
//         assert.ok(error === '', "Sync OK");
//         assert.ok(cliente.numero === '1227', "Cliente encontrado");
//         done();

//     });

// });

// QUnit.test("es pedido rentable", function (assert) {

//      //Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();
//     var error = preventamobile.dal().sync({ filtro: filtro });


//     setTimeout(function () {

//         var cliente = preventamobile.dal().obtenerCliente("1227");
//         var pedido = preventamobile.dal().factory().pedido(cliente.numero);
//         var pedidoId = preventamobile.dal().guardarPedido(pedido); // guardar pedido por primera vez para luego poder agregar las lineas

//         var articulo = preventamobile.dal().obtenerArticulo("10101");   // Articulo con Proveedor con coeficiente rentabilidad al 20
//         var lineaPedido = preventamobile.dal().factory().lineaPedidoDesdeCargaRapida(articulo.id, 5);

//         // Esta informacion se setea en la edicion, por eso lo agrego aqui manualmente
//         lineaPedido.precio = articulo.preventa1;
//         lineaPedido.costo = articulo.costo;
//         lineaPedido.idproveedor = articulo.idproveedor;

//         preventamobile.dal().guardarPedidoLinea(pedidoId, lineaPedido);

//         //Act
//         var pedidoActualizado = preventamobile.dal().obtenerPedido(pedidoId);

//          //Assert
//         assert.ok(error === '', "Sync OK");
//         console.log("Datos del pedido actualizado:");
//         console.log(pedidoActualizado);
//         console.log("Datos de costo proveedor");
//         console.log(pedidoActualizado.costoProveedor);
//         assert.ok(pedidoActualizado.total > 0, "Total pedido > 0");
//         assert.ok(preventamobile.dal().esPedidoRentable(pedidoActualizado) === true, "Es pedido rentable");
//         assert.ok(preventamobile.dal().detallePedidoNoRentable(pedidoActualizado) === "", "Detalle pedido rentable vacio");
//         done();

//     });

// });


// QUnit.test("NO es pedido rentable", function (assert) {

//     //Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();
//     var error = preventamobile.dal().sync({ filtro: filtro });


//     setTimeout(function () {

//         var cliente = preventamobile.dal().obtenerCliente("1227");
//         var pedido = preventamobile.dal().factory().pedido(cliente.numero);
//         var pedidoId = preventamobile.dal().guardarPedido(pedido); // guardar pedido por primera vez para luego poder agregar las lineas

//         var articulo = preventamobile.dal().obtenerArticulo("10205");   // Articulo con Proveedor con coeficiente rentabilidad al 50
//         var lineaPedido = preventamobile.dal().factory().lineaPedidoDesdeCargaRapida(articulo.id, 5);

//         // Esta informacion se setea en la edicion, por eso lo agrego aqui manualmente
//         lineaPedido.precio = articulo.preventa1;
//         lineaPedido.costo = articulo.costo;
//         lineaPedido.idproveedor = articulo.idproveedor;

//         preventamobile.dal().guardarPedidoLinea(pedidoId, lineaPedido);

//         //Act
//         var pedidoActualizado = preventamobile.dal().obtenerPedido(pedidoId);

//         //Assert
//         assert.ok(error === '', "Sync OK");
//         console.log("Datos del pedido actualizado:");
//         console.log(pedidoActualizado);
//         console.log("Datos de costo proveedor");
//         console.log(pedidoActualizado.costoProveedor);
//         assert.ok(pedidoActualizado.total > 0, "Total pedido > 0");
//         assert.ok(preventamobile.dal().esPedidoRentable(pedidoActualizado) === false, "NO Es pedido rentable");
//         assert.ok(preventamobile.dal().detallePedidoNoRentable(pedidoActualizado) !== "", "Detalle pedido NO rentable: " + preventamobile.dal().detallePedidoNoRentable(pedidoActualizado));
//         done();

//     });

// });
// QUnit.test("NO es pedido rentable", function (assert) {

//     //Arrange
//     cleanLocalStorage();
//     localStorage.setItem("urlServer", "http://localhost:8084/preventamobile/");  // Url
//     localStorage.setItem("opcionSync", 1);  // Sync de Clientes
//     var filtro = { dia: 2, username: "2", clave: "302" };
//     var done = assert.async();
//     var error = preventamobile.dal().sync({ filtro: filtro });


//     setTimeout(function () {

//         var cliente = preventamobile.dal().obtenerCliente("1227");
//         var pedido = preventamobile.dal().factory().pedido(cliente.numero);
//         var pedidoId = preventamobile.dal().guardarPedido(pedido); // guardar pedido por primera vez para luego poder agregar las lineas

//         var articulo = preventamobile.dal().obtenerArticulo("10205");   // Articulo con Proveedor con coeficiente rentabilidad al 50
//         var lineaPedido = preventamobile.dal().factory().lineaPedidoDesdeCargaRapida(articulo.id, 5);

//         // Esta informacion se setea en la edicion, por eso lo agrego aqui manualmente
//         lineaPedido.precio = articulo.preventa1;
//         lineaPedido.costo = articulo.costo;
//         lineaPedido.idproveedor = articulo.idproveedor;

//         preventamobile.dal().guardarPedidoLinea(pedidoId, lineaPedido);

//         //Act
//         var pedidoActualizado = preventamobile.dal().obtenerPedido(pedidoId);

//         //Assert
//         assert.ok(error === '', "Sync OK");
//         console.log("Datos del pedido actualizado:");
//         console.log(pedidoActualizado);
//         console.log("Datos de costo proveedor");
//         console.log(pedidoActualizado.costoProveedor);
//         assert.ok(pedidoActualizado.total > 0, "Total pedido > 0");
//         assert.ok(preventamobile.dal().esPedidoRentable(pedidoActualizado) === false, "NO Es pedido rentable");
//         assert.ok(preventamobile.dal().detallePedidoNoRentable(pedidoActualizado) !== "", "Detalle pedido NO rentable: " + preventamobile.dal().detallePedidoNoRentable(pedidoActualizado));
//         done();

//     });

// });


QUnit.test("HTML NO es pedido rentable", function (assert) {
    
        //Arrange
        cleanLocalStorage();
        localStorage.setItem("urlServer", "http://190.15.194.24:8084/preventamobile/");  // Url
        localStorage.setItem("opcionSync", 1);  // Sync de Clientes
        var filtro = { dia: 2, username: "2", clave: "302" };
        var done = assert.async();
        var error = preventamobile.dal().sync({ filtro: filtro });
    
    
        setTimeout(function () {

            
            // TODO: ver porque 10205 es un articulo con variedades, verificar los tests al respecto

            var cliente = preventamobile.dal().obtenerCliente("1227");
            var pedido = preventamobile.dal().factory().pedido(cliente.numero);
            var pedidoId = preventamobile.dal().guardarPedido(pedido); // guardar pedido por primera vez para luego poder agregar las lineas
    
            var articulo = preventamobile.dal().obtenerArticulo("10205");   // Articulo con Proveedor con coeficiente rentabilidad al 50
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

            assert.ok(pedidoActualizado.total > 0, "Total pedido > 0");
            assert.ok(preventamobile.dal().esPedidoRentable(pedidoActualizado) === false, "NO Es pedido rentable");
            assert.ok(preventamobile.dal().detallePedidoNoRentable(pedidoActualizado) !== "", "Detalle pedido NO rentable: " + preventamobile.dal().detallePedidoNoRentable(pedidoActualizado));

            // Convertir costo proveedor en array porque jsrender no toma el objeto
            var costoProveedor = [];
            var i=0;
            $.each(pedidoActualizado.costoProveedor,
                function (index, value) {
                    costoProveedor[i] = value;
                    i++;
                });

            console.log(preventamobile.dal().detallePedidoNoRentable(pedidoActualizado));
            console.log("Datos de costo proveedor");
            console.log(costoProveedor);
            // console.log(pedidoActualizado);

            console.log("Html pedido rentable");
            console.log($.templates("#pedidoRentableTmpl").render(costoProveedor));

            done();
    
        });
    
    });

function cleanLocalStorage() {
    localStorage.clear();
}